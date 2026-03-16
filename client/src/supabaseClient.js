import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Checking Supabase Config...");
console.log(
  "URL detected:",
  supabaseUrl ? "✅ Yes" : "❌ NO (Check your .env file name)",
);
console.log(
  "Key detected:",
  supabaseKey ? "✅ Yes" : "❌ NO (Check your .env variable names)",
);

// Database connection
export const supabase = createClient(supabaseUrl, supabaseKey);
