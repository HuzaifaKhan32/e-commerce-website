import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Auto-detect deployment URL for preview environments
// This makes OAuth callbacks work automatically on platforms like Vercel, Netlify, etc.
if (!process.env.NEXTAUTH_URL) {
  if (process.env.VERCEL_URL) {
    // Vercel preview deployments
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
  } else if (process.env.RENDER_EXTERNAL_URL) {
    // Render deployments
    process.env.NEXTAUTH_URL = process.env.RENDER_EXTERNAL_URL;
  } else if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    // Railway deployments
    process.env.NEXTAUTH_URL = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  } else if (process.env.NETLIFY_URL) {
    // Netlify deployments
    process.env.NEXTAUTH_URL = `https://${process.env.NETLIFY_URL}`;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };