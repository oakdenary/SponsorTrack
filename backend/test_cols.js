import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('users').select('*').limit(1); // Wait users is in sponsorship schema
  const { data: d2, error: e2 } = await supabase.rpc('get_columns', { table_name: 'users' });
  console.log("Error:", e2?.message);
}
run();
