import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

async function verifySetup() {
  console.log("🔍 Verifying Environment and Connections...");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;

  console.log(`\nChecking Variables:`);
  console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "✅ Found" : "❌ Missing"}`);
  console.log(`- SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? "✅ Found" : "❌ Missing"}`);
  console.log(`- RESEND_API_KEY: ${resendApiKey ? "✅ Found" : "❌ Missing"}`);

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Critical: Supabase credentials missing. Cannot proceed.");
    return;
  }

  // 1. Test Supabase Connection & Table Existence
  try {
    console.log("\n📡 Testing Supabase Connection...");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Try to select from the table. If it doesn't exist, this will fail.
    const { data, error } = await supabase
      .from("two_factor_codes")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error(`❌ Database Error: ${error.message}`);
      if (error.code === '42P01') {
        console.error("   --> Hint: The table 'two_factor_codes' does NOT exist. Please run the migration SQL.");
      }
    } else {
      console.log("✅ Supabase Connection Successful");
      console.log("✅ Table 'two_factor_codes' exists");
    }

    // Check Users table for emailVerified column
    const { error: usersError } = await supabase
      .from("users")
      .select("emailVerified")
      .limit(1);

    if (usersError) {
       console.warn(`⚠️ Warning checking 'users' table: ${usersError.message}`);
       console.warn("   --> Ensure 'emailVerified' column exists for NextAuth.");
    } else {
        console.log("✅ Column 'emailVerified' found in 'users' table");
    }

  } catch (err) {
    console.error("❌ Unexpected Supabase connection error:", err);
  }

  // 2. Test Resend Configuration (Dry Run)
  if (resendApiKey) {
    try {
      console.log("\n📧 Testing Resend Configuration...");
      const resend = new Resend(resendApiKey);
      
      // We don't actually send, just checking if the client initializes and we can make a basic call
      // Fetching domains is a safe read-only operation to check the key
      const { data, error } = await resend.domains.list();
      
      if (error) {
         console.error(`❌ Resend API Error: ${error.message}`);
         if (error.message.includes("API key")) {
             console.error("   --> Hint: Your RESEND_API_KEY might be invalid.");
         }
      } else {
          console.log("✅ Resend API Key is valid.");
          console.log(`   --> Found ${data?.data.length || 0} domains.`);
          
          const hasVerifiedDomain = data?.data.some((d: any) => d.status === 'verified');
          if (!hasVerifiedDomain) {
              console.warn("   ⚠️ No verified domains found. You can ONLY send emails to your registered Resend email address.");
          }
      }

    } catch (err) {
        console.error("❌ Unexpected Resend error:", err);
    }
  }
}

verifySetup().catch(console.error);
