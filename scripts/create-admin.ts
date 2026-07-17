import "dotenv/config";
import { Pool } from "pg";
import * as bcrypt from "bcryptjs";

async function createAdmin() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const email = "admin@luxeleather.com";
    const password = "Admin123!";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const checkResult = await pool.query(
      'SELECT id FROM "Users" WHERE email = $1',
      [email]
    );

    if (checkResult.rows.length > 0) {
      console.log("✅ Admin user already exists!");
      console.log("Email:", email);
      console.log("Password:", password);
    } else {
      // Insert admin user
      await pool.query(
        `INSERT INTO "Users" (id, email, password, name, role, "emailVerified", created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())`,
        [email, hashedPassword, "Admin User", "admin"]
      );

      console.log("✅ Admin user created successfully!");
      console.log("");
      console.log("🔑 Login Credentials:");
      console.log("Email:", email);
      console.log("Password:", password);
      console.log("");
      console.log("Navigate to /auth to login");
    }
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createAdmin();
