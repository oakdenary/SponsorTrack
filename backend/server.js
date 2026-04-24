import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getUserFromToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) return null;

  return data.user;
}

async function verifyAdminAuth(req) {
  const user = await getUserFromToken(req);
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .schema("sponsorship")
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !data || data.role !== "admin") return null;
    return user;
  } catch (err) {
    return null;
  }
}

async function getUserCouncil(userId) {
  const { data, error } = await supabase
    .schema("sponsorship")
    .from("users")
    .select("councilid")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return data.councilid;
}

// ====================================================
//                    OUTREACH
// ====================================================

// GET — Fetch all outreach data via outreach_view
app.get("/outreach", async (req, res) => {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let councilId = await getUserCouncil(user.id);

    if (!councilId || councilId === "null") {
      return res.status(400).json({ error: "Invalid council ID" });
    }

    councilId = Number(councilId);

    const { data: viewData, error } = await supabase
      .schema("sponsorship")
      .from("outreach_view")
      .select("*")
      .eq("councilid", councilId);

    if (error) return res.status(500).json({ error: error.message });

    const { data: sponsorData } = await supabase
      .schema("sponsorship")
      .from("sponsor")
      .select("companyname, categoryname");

    const categoryMap = {};
    (sponsorData || []).forEach(s => {
      if (s.companyname) {
        categoryMap[s.companyname] = s.categoryname;
      }
    });

    const data = (viewData || []).map(row => ({
      ...row,
      categoryname: categoryMap[row.companyname] || row.categoryname || "Uncategorized"
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — Add new outreach entry
app.post("/outreach", async (req, res) => {
  try {
    // 🔐 STEP 1: Get user from token
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 🧠 STEP 2: Get user's council
    const councilId = await getUserCouncil(user.id);
    if (!councilId) {
      return res.status(400).json({ error: "User council not found" });
    }

    // 📦 STEP 3: Extract request data
    const {
      sponsorid,
      contactmode,
      status,
      notes,
      eventid,
      deal_type,
      deal_value,
      memberid: inputMemberId,
    } = req.body;

    if (!sponsorid) {
      return res.status(400).json({ error: "sponsorid is required" });
    }

    // 🔍 STEP 4: Validate sponsor
    const { data: sponsorData, error: sponsorError } = await supabase
      .schema("sponsorship")
      .from("sponsor")
      .select("sponsorid")
      .eq("sponsorid", sponsorid)
      .single();

    if (sponsorError || !sponsorData) {
      return res.status(400).json({ error: "Invalid sponsorid" });
    }

    // 👤 STEP 5: Decide memberid
    const memberid =
      inputMemberId && inputMemberId !== "null"
        ? Number(inputMemberId)
        : null;

    const parsedEventId =
      eventid && eventid !== "null"
        ? Number(eventid)
        : null;

    // 🚫 STEP 6: Prevent duplicate outreach (same sponsor + council)
    const { data: existing } = await supabase
      .schema("sponsorship")
      .from("outreach")
      .select("outreachid")
      .eq("sponsorid", sponsorid)
      .eq("councilid", councilId)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        error: "This sponsor is already contacted by your council",
      });
    }

    // 💾 STEP 7: Insert outreach
    const { data, error } = await supabase
      .schema("sponsorship")
      .from("outreach")
      .insert({
        sponsorid: Number(sponsorid),
        contactmode: contactmode || "Email",
        status: status || "Cold",
        notes: notes || "",
        memberid,
        councilid: councilId, // 🔥 CRITICAL FIELD
        eventid: parsedEventId,
        deal_type: deal_type || "Monetary",
        deal_value: deal_value ? Number(deal_value) : null,
      })
      .select();

    if (error) {
      console.error("OUTREACH INSERT ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("OUTREACH API ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT — Update outreach entry
app.put("/outreach", async (req, res) => {
  try {
    // 🔐 STEP 1: Authenticate user
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 🧠 STEP 2: Get council
    const councilId = await getUserCouncil(user.id);
    if (!councilId) {
      return res.status(400).json({ error: "User council not found" });
    }

    // 📦 STEP 3: Get request data
    const { outreachid, status, notes } = req.body;

    if (!outreachid) {
      return res.status(400).json({ error: "outreachid is required" });
    }

    // ✏️ STEP 4: Prepare update fields
    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;

    // 🚫 STEP 5: Validate council permission manually due to legacy nulls
    const { data: existing, error: existErr } = await supabase
      .schema("sponsorship")
      .from("outreach")
      .select("councilid")
      .eq("outreachid", outreachid)
      .single();

    if (existErr || !existing) return res.status(404).json({ error: "Not found" });
    if (existing.councilid !== null && existing.councilid !== councilId) {
      return res.status(403).json({ error: "You are not allowed to update this outreach" });
    }

    const { data, error } = await supabase
      .schema("sponsorship")
      .from("outreach")
      .update(updateFields)
      .eq("outreachid", outreachid)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("OUTREACH UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE — Delete outreach entry
app.delete("/outreach", async (req, res) => {
  try {
    // 🔐 STEP 1: Authenticate user
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 🧠 STEP 2: Get council
    const councilId = await getUserCouncil(user.id);
    if (!councilId) {
      return res.status(400).json({ error: "User council not found" });
    }

    // 📦 STEP 3: Get request data
    const { outreachid } = req.body;

    if (!outreachid) {
      return res.status(400).json({ error: "outreachid is required" });
    }

    // 🚫 STEP 4: Delete ONLY if same council
    const { data: existing, error: existErr } = await supabase
      .schema("sponsorship")
      .from("outreach")
      .select("councilid")
      .eq("outreachid", outreachid)
      .single();

    if (existErr || !existing) return res.status(404).json({ error: "Not found" });
    if (existing.councilid !== null && existing.councilid !== councilId) {
      return res.status(403).json({ error: "You are not allowed to delete this outreach" });
    }

    const { data, error } = await supabase
      .schema("sponsorship")
      .from("outreach")
      .delete()
      .eq("outreachid", outreachid)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("OUTREACH DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ====================================================
//                    SPONSORS
// ====================================================

// GET — Fetch sponsors with category
app.get("/sponsors", async (req, res) => {
  try {
    const { data, error } = await supabase
      .schema("sponsorship")
      .from("sponsor")
      .select(`
        sponsorid,
        companyname,
        contactperson,
        designation,
        phoneno,
        email,
        sponsorcategory:categoryid (categoryname)
      `)
      .order("companyname");

    if (error) return res.status(500).json({ error: error.message });

    // Flatten the nested category
    const sponsors = (data || []).map((s) => ({
      sponsorid: s.sponsorid,
      companyname: s.companyname,
      categoryname: s.sponsorcategory?.categoryname || "Uncategorized",
      contactperson: s.contactperson,
      designation: s.designation,
      phoneno: s.phoneno,
      email: s.email,
    }));

    res.json(sponsors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — Add new sponsor
app.post("/sponsors", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const councilId = await getUserCouncil(user.id);
    if (!councilId) return res.status(400).json({ error: "User council not found" });

    const { companyname, sponsorcategoryid, contactperson, designation, email, phoneno } = req.body;

    if (!companyname) {
      return res.status(400).json({ error: "companyname is required" });
    }

    const { data, error } = await supabase
      .schema("sponsorship")
      .from("sponsor")
      .insert({
        companyname,
        categoryid: sponsorcategoryid ? Number(sponsorcategoryid) : null,
        contactperson,
        designation,
        email,
        phoneno
      })
      .select();

    if (error) {
      console.error("SPONSOR INSERT ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("SPONSOR POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET — Fetch all councils for dropdowns
app.get("/councils", async (req, res) => {
  try {
    const { data, error } = await supabase
      .schema("sponsorship")
      .from("council")
      .select("councilid, councilname")
      .order("councilname");

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — Fetch events for dropdown
app.get("/events", async (req, res) => {
  try {
    const { data, error } = await supabase
      .schema("sponsorship")
      .from("event")
      .select("eventid, eventname")
      .order("eventname");

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — Fetch team members for dropdown
app.get("/teammembers", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const councilId = await getUserCouncil(user.id);

    const { data, error } = await supabase
      .schema("sponsorship")
      .from("teammember")
      .select("memberid, membername")
      .eq("councilid", councilId)
      .order("membername");

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ====================================================
                    FEEDBACK
==================================================== */

// POST — Save feedback
app.post("/feedback", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { data, error } = await supabase
      .schema("sponsorship")
      .from("feedback")
      .insert({
        name,
        email,
        message,
      })
      .select();

    if (error) {
      console.error("FEEDBACK INSERT ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error("FEEDBACK API ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ====================================================
//                    DASHBOARD
// ====================================================

// GET — Return all dashboard stats
app.get("/dashboard", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 🧠 Get user's council and find their member identity
    const councilId = await getUserCouncil(user.id);
    if (!councilId) {
      return res.status(400).json({ error: "User council not found" });
    }

    // We need the user's explicit memberid mapped from `users` table directly
    const { data: userData } = await supabase
      .schema("sponsorship")
      .from("users")
      .select("memberid")
      .eq("id", user.id)
      .single();

    const myMemberId = userData?.memberid;

    // Dynamic extraction of ALL dashboard stats directly from native tables (matching the Tracker fixes)
    const { data: rawData, error } = await supabase
      .schema("sponsorship")
      .from("outreach")
      .select(`
        *,
        sponsor ( companyname, categoryid, sponsorcategory ( categoryname ) )
      `)
      .eq("councilid", councilId);

    if (error) {
      console.error("Dashboard API Error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    const pipelineWithCategories = (rawData || []).map(row => ({
      ...row,
      companyname: row.sponsor?.companyname || "Unknown Company",
      categoryname: row.sponsor?.sponsorcategory?.categoryname || "Uncategorized"
    }));

    const myDeals = pipelineWithCategories.filter(
      o =>
        o.memberid === myMemberId &&
        (o.status || "").toLowerCase().trim() === "closed"
    );

    const myTotalValue = myDeals.reduce(
      (sum, o) => sum + (Number(o.deal_value) || 0),
      0
    );

    const councilDeals = pipelineWithCategories.filter(
      o => (o.status || "").toLowerCase().trim() === "closed"
    );

    const councilRevenue = councilDeals.reduce(
      (sum, o) => sum + (Number(o.deal_value) || 0),
      0
    );

    // 1. Revenue Flow based directly on outreach dates
    // Using created_at if present. If missing, groups to today's date.
    const revenueFlowMap = {};
    councilDeals.forEach(o => {
      const dateObj = o.created_at ? new Date(o.created_at) : new Date();
      const date = dateObj.toISOString().split("T")[0];
      if (!revenueFlowMap[date]) revenueFlowMap[date] = 0;
      revenueFlowMap[date] += (Number(o.deal_value) || 0);
    });

    const revenueFlow = Object.entries(revenueFlowMap).map(([date, amount]) => ({
      date,
      amount,
    })).sort((a,b) => new Date(a.date) - new Date(b.date));

    // 2. Company Categories for Pie Chart
    const categoryMap = {};
    pipelineWithCategories.filter(o => {
      const s = (o.status || "").toLowerCase().trim();
      return s === "closed" || s === "confirmed";
    }).forEach(o => {
      const catName = o.categoryname;
      if (!categoryMap[catName]) categoryMap[catName] = 0;
      categoryMap[catName]++;
    });

    const pieData = Object.entries(categoryMap).map(([label, value]) => ({
      label,
      value
    }));

    // 3. Pipeline Stats for PipelineCard
    const statusMap = {};
    pipelineWithCategories.forEach(o => {
      const s = (o.status || "Unknown").trim();
      if (!statusMap[s]) statusMap[s] = 0;
      statusMap[s]++;
    });

    const pipelineStats = Object.entries(statusMap).map(([label, count]) => ({
      label,
      count
    }));

    // OPTIONAL DEBUG
    console.log("TOTAL ROWS:", pipelineWithCategories.length);
    console.log("CLOSED DEALS:", councilDeals.length);
    console.log("STATUSES:", pipelineWithCategories.map(o => o.status));

    res.json({
      totalDeals: councilDeals.length,
      totalRevenue: councilRevenue,
      pieData,
      pipelineStats,
      revenueFlow, 
      myContribution: {
        totalDeals: myDeals.length,
        totalValue: myTotalValue
      },
      councilOutreach: pipelineWithCategories
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================
//                    ADMIN DASHBOARD
// ====================================================

app.get("/admin/dashboard", async (req, res) => {
  try {
    const adminUser = await verifyAdminAuth(req);
    if (!adminUser) return res.status(403).json({ error: "Forbidden: Admins only" });

    const [
      { data: users },
      { data: councils },
      { data: sponsors },
      { data: outreach },
      { data: payments },
      { data: sponsorships },
      { data: teammembers },
      { data: feedback }
    ] = await Promise.all([
      supabase.schema("sponsorship").from("users").select("id, username, email, councilid, role"),
      supabase.schema("sponsorship").from("council").select("*"),
      supabase.schema("sponsorship").from("sponsor").select("sponsorid, companyname, contactperson, email, phoneno, sponsorcategory(categoryname)"),
      supabase.schema("sponsorship").from("outreach").select("outreachid, sponsorid, status, deal_type, deal_value, memberid, councilid"),
      supabase.schema("sponsorship").from("payment").select("paymentid, amountpaid, paymentdate, sponsorshipid"),
      supabase.schema("sponsorship").from("sponsorship").select("sponsorshipid, status, sponsorid, eventid, event(councilid)"),
      supabase.schema("sponsorship").from("teammember").select("memberid, membername, councilid"),
      supabase.schema("sponsorship").from("feedback").select("id, name, email, message, created_at")
    ]);

    res.json({
      users: users?.data || users || [],
      councils: councils || [],
      sponsors: sponsors || [],
      outreach: outreach || [],
      payments: payments || [],
      sponsorships: sponsorships || [],
      teammembers: teammembers || [],
      feedback: feedback || []
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/admin/users/role", async (req, res) => {
  try {
    const adminUser = await verifyAdminAuth(req);
    if (!adminUser) return res.status(403).json({ error: "Forbidden: Admins only" });

    const { targetUserId, newRole, newCouncilId } = req.body;
    if (!targetUserId) return res.status(400).json({ error: "Missing target userId" });

    const updates = {};
    if (newRole !== undefined) updates.role = newRole;
    if (newCouncilId !== undefined) updates.councilid = newCouncilId === "null" ? null : Number(newCouncilId);

    const { data, error } = await supabase
      .schema("sponsorship")
      .from("users")
      .update(updates)
      .eq("id", targetUserId)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, user: data[0] });
  } catch (err) {
    console.error("USER ROLE UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ====================================================
//                    USER
// ====================================================

// GET — Fetch user details with council
app.get("/user", async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(400).json({ error: "Missing user id" });
    }

    const { data, error } = await supabase
      .schema("sponsorship")
      .from("users")
      .select("id, username, email, councilid, role, council(councilname)")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      if (error.message && (error.message.includes("role") || error.message.includes("council"))) {
        // Fallback if role doesn't exist yet, or council join fails
        const { data: fallbackData } = await supabase
          .schema("sponsorship")
          .from("users")
          .select("id, username, email, councilid")
          .eq("id", userId)
          .maybeSingle();
        if (fallbackData) {
          fallbackData.role = "user";
          return res.json(fallbackData);
        }
      }
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    // Flatten councilname for easy frontend access
    if (data.council && data.council.councilname) {
      data.councilname = data.council.councilname;
      delete data.council;
    }

    res.json(data);
  } catch (err) {
    console.error("USER API ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST — Create user profile on first login
app.post("/user/profile", async (req, res) => {
  try {
    // Basic verification just to ensure they have a token
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id, username, email, councilid, role, adminPassword } = req.body;

    if (!id || !username || !email) {
      return res.status(400).json({ error: "Missing core user details" });
    }

    if (id !== user.id) {
      return res.status(403).json({ error: "ID mismatch" });
    }

    let finalCouncilId = Number(councilid);
    let finalRole = role || 'user';

    if (role === 'admin') {
      if (adminPassword !== 'admin@123') {
        return res.status(403).json({ error: "Invalid Admin authorization code" });
      }
      finalRole = 'admin';
      finalCouncilId = null; // Admin has no fixed council requirement
    } else {
      if (!finalCouncilId || isNaN(finalCouncilId)) {
        return res.status(400).json({ error: "Standard users must select a council" });
      }
    }

    const { data: insertData, error: insertError } = await supabase
      .schema("sponsorship")
      .from("users")
      .insert({
        id,
        username,
        email,
        councilid: finalCouncilId,
        role: finalRole
      })
      .select('id, username, email, councilid, role, council(councilname)');

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    const createdUser = insertData[0] || {};
    if (createdUser.council && createdUser.council.councilname) {
      createdUser.councilname = createdUser.council.councilname;
      delete createdUser.council;
    }

    res.json({ success: true, user: createdUser });

  } catch (err) {
    console.error("USER PROFILE UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT — Update user profile (username, role)
app.put("/user/profile/update", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id, username, role, adminPassword } = req.body;

    if (id !== user.id) {
      return res.status(403).json({ error: "ID mismatch" });
    }

    let finalRole = role;

    if (role === 'admin') {
      if (adminPassword !== 'admin@123') {
        return res.status(403).json({ error: "Invalid Admin authorization code" });
      }
      finalRole = 'admin';
    } else {
      finalRole = 'user';
    }

    const { data: updateData, error: updateError } = await supabase
      .schema("sponsorship")
      .from("users")
      .update({
        username,
        role: finalRole,
        ...(finalRole === 'admin' && { councilid: null }) // Admins drop council dependency
      })
      .eq("id", user.id)
      .select('id, username, email, councilid, role');

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    res.json({ success: true, user: updateData[0] });

  } catch (err) {
    console.error("USER PROFILE PUT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});



// ====================================================
//                    START SERVER
// ====================================================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ SponsorTrack backend running on http://localhost:${PORT}`);
});