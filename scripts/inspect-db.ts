
import { createClient } from "@supabase/supabase-js";

async function inspectDb() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing credentials");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Check if table exists and get a sample row to see structure
  const { data, error } = await supabase
    .from('two_factor_codes')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Error accessing table:", error);
  } else {
    console.log("Table access successful. Sample row (or empty):", data);
    
    // Try to insert a dummy record to verify permissions and schema match
    const testEmail = `test-${Date.now()}@example.com`;
    const { error: insertError } = await supabase
      .from('two_factor_codes')
      .upsert([{ 
        email: testEmail, 
        code: '123456', 
        expires_at: new Date(Date.now() + 60000).toISOString() 
      }]);
      
    if (insertError) {
      console.error("Insert test failed:", insertError);
    } else {
      console.log("Insert test successful");
      // Clean up
      await supabase.from('two_factor_codes').delete().eq('email', testEmail);
    }
  }
}

inspectDb();
