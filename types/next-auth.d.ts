// types/next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    accessToken: string; // Adding 'token' as a string
  }

  interface JWT {
    accessToken?: string; // Define 'accessToken' on JWT object
  }

  interface Session {
    accessToken: string; // Make accessToken available in the session
  }
}
