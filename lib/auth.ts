import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { decode } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Query local PostgreSQL database directly via Prisma
          const user = await prisma.users.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            return null;
          }

          if (!user.password) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name ?? undefined,
            email: user.email,
            image: user.image ?? undefined,
            role: user.role ?? undefined
          };
        } catch (error) {
          console.error("Auth authorize error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    decode: async ({ secret, token }) => {
      try {
        return await decode({ secret, token });
      } catch (error) {
        console.error("JWT Decode Error (likely secret mismatch):", error);
        return null; // Return null instead of crashing, which triggers a logout
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists by email
          let dbUser = await prisma.users.findUnique({
            where: { email: user.email! }
          });

          // Create user if doesn't exist
          if (!dbUser) {
            dbUser = await prisma.users.create({
              data: {
                email: user.email!,
                name: user.name || null,
                image: user.image || null,
                emailVerified: new Date(),
                role: "user"
              }
            });
          }

          // Link OAuth account to user (upsert to avoid duplicates)
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId
              }
            },
            update: {
              access_token: account.access_token,
              expires_at: account.expires_at ? BigInt(account.expires_at) : null,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state
            },
            create: {
              userId: dbUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at ? BigInt(account.expires_at) : null,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state
            }
          });

          return true;
        } catch (error) {
          console.error("Google OAuth signIn error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth',
  }
};

