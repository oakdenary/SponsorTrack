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

// ====================================================
//                    OUTREACH
// ====================================================

// GET — Fetch all outreach data via outreach_view
app.get("/outreach", async (req, res) => {
  try {
    const { data, error } = await supabase
      .schema("sponsorship")
      .from("outreach_view")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — Add new outreach entry
app.post("/outreach", async (req, res) => {
  try {
    const { sponsorid, contactmode, status, notes, eventid, deal_type, deal_value, memberid: inputMemberId } = req.body;

    if (!sponsorid) {
      return res.status(400).json({ error: "sponsorid is required" });
    }

    const { data: sponsorData, error: sponsorError } = await supabase
      .schema("sponsorship")
      .from("sponsor")
      .select("memberid")
      .eq("sponsorid", sponsorid)
      .single();

    if (sponsorError || !sponsorData) {
      return res.status(400).json({ error: "Invalid sponsorid" });
    }

    const memberid = inputMemberId ? Number(inputMemberId) : sponsorData.memberid;

    const { data, error } = await supabase
      .schema("sponsorship")
      .from("outreach")
      .insert({
        sponsorid: Number(sponsorid),
        contactmode: contactmode || "Email",
        status: status || "Cold",
        notes: notes || "",
        memberid,
        eventid: eventid ? Number(eventid) : null,
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
    res.status(500).json({ error: err.message });
  }
});

// PUT — Update outreach entry
app.put("/outreach", async (req, res) => {
  try {
    const { outreachid, status, notes } = req.body;

    if (!outreachid) {
      return res.status(400).json({ error: "outreachid is required" });
    }

    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;

    const { data, error } = await supabase
      .schema("sponsorship")
      .from("outreach")
      .update(updateFields)
      .eq("outreachid", outreachid)
      .select();

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — Delete outreach entry
app.delete("/outreach", async (req, res) => {
  try {
    const { outreachid } = req.body;

    if (!outreachid) {
      return res.status(400).json({ error: "outreachid is required" });
    }

    const { error } = await supabase
      .schema("sponsorship")
      .from("outreach")
      .delete()
      .eq("outreachid", outreachid);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ success: true });
  } catch (err) {
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
        sponsorcategory (categoryname)
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
    const { data, error } = await supabase
      .schema("sponsorship")
      .from("teammember")
      .select("memberid, membername")
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
    // 1. Total Sponsorship Secured (status = 'Confirmed')
    const { count: totalSecured } = await supabase
      .schema("sponsorship")
      .from("sponsorship")
      .select("*", { count: "exact", head: true })
      .eq("status", "Confirmed");

    // 2. Pending Sponsorship (status = 'Pending')
    const { count: pending } = await supabase
      .schema("sponsorship")
      .from("sponsorship")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending");

    // 3. Total Revenue (sum of amountpaid)
    const { data: revenueData } = await supabase
      .schema("sponsorship")
      .from("payment")
      .select("amountpaid");

    const revenue = (revenueData || []).reduce(
      (sum, p) => sum + (parseFloat(p.amountpaid) || 0),
      0
    );

    // 4. Revenue Flow (grouped by payment date)
    const { data: revenueFlowRaw } = await supabase
      .schema("sponsorship")
      .from("payment")
      .select("paymentdate, amountpaid")
      .order("paymentdate");

    const revenueFlowMap = {};
    (revenueFlowRaw || []).forEach((p) => {
      const date = p.paymentdate?.split("T")[0] || p.paymentdate;
      if (!revenueFlowMap[date]) revenueFlowMap[date] = 0;
      revenueFlowMap[date] += parseFloat(p.amountpaid) || 0;
    });

    const revenueFlow = Object.entries(revenueFlowMap).map(([date, amount]) => ({
      date,
      amount,
    }));

    // 5. Event Sponsors (count per event)
    const { data: eventSponsorsRaw } = await supabase
      .schema("sponsorship")
      .from("sponsorship")
      .select("eventid, event(eventname)");

    const eventMap = {};
    (eventSponsorsRaw || []).forEach((s) => {
      const name = s.event?.eventname || `Event ${s.eventid}`;
      if (!eventMap[name]) eventMap[name] = 0;
      eventMap[name]++;
    });

    const eventSponsors = Object.entries(eventMap).map(([name, total]) => ({
      eventname: name,
      total,
    }));

    // 6. Pipeline Stats (outreach count by status)
    const { data: pipelineRaw } = await supabase
      .schema("sponsorship")
      .from("outreach")
      .select("status");

    const pipelineMap = {};
    (pipelineRaw || []).forEach((o) => {
      const s = o.status || "Unknown";
      if (!pipelineMap[s]) pipelineMap[s] = 0;
      pipelineMap[s]++;
    });

    const pipelineStats = Object.entries(pipelineMap).map(([label, count]) => ({
      label,
      count,
    }));

    res.json({
      totalSecured: totalSecured || 0,
      pending: pending || 0,
      revenue,
      revenueFlow,
      eventSponsors,
      pipelineStats,
    });
  } catch (err) {
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
      .select("id, username, role, councilid, council(councilname)")
      .eq("id", userId)
      .single();

    if (error) return res.status(500).json({ error: error.message });

    if (!data) return res.status(404).json({ error: "User not found" });

    res.json({
      id: data.id,
      username: data.username,
      role: data.role,
      councilid: data.councilid,
      councilname: data.council?.councilname || null,
    });
  } catch (err) {
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
