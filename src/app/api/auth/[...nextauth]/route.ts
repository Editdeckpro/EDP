// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Safe guard: ensure credentials are present
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BE_URL}/auth/login`,
            {
              username: credentials.username,
              password: credentials.password,
            }
          );

          // Assuming response shape: { accessToken: "..." }
          const user = {
            id: credentials.username,
            accessToken: response.data.accessToken,
          };

          return user;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 400) throw new Error("User not found");
            if (status === 403) throw new Error("Invalid password");
          }

          throw new Error("Server error");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
