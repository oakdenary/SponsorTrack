import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabase.schema("sponsorship").from("outreach_with_category").select("*").limit(1);
  console.log("OUTREACH VIEW:", data, error);
}
run();
