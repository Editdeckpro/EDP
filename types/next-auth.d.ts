// types/next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    accessToken: string;
    username: string; // Add username here
  }

  interface JWT {
    accessToken: string;
    username: string;
  }

  interface Session {
    accessToken: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username: string;
    };
  }
}
