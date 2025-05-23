// components/Providers.tsx
import axios from "axios";
import { getServerSession, NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Credentials from "next-auth/providers/credentials";
import { axiosInstance } from "./lib/axios-instance";

interface DecodedJWT extends JwtPayload {
  username: string;
}

// Define the type for authOptions
export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "CustomOAuth",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        const token = credentials?.token;

        if (!token) return null;

        // OPTIONAL: Validate the token with your backend
        // const res = await axiosInstance("https://your-backend.com/api/auth/validate", {
        //   method: "POST",
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // if (!res.ok) return null;
        // const user = await res.json();

        const decoded = jwtDecode<DecodedJWT>(token);

        const user: User | AdapterUser = {
          id: decoded.username,
          accessToken: token,
          username: decoded.username,
        };

        return user;
      },
    }),
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
          const response = await axiosInstance.post(`/auth/login`, {
            username: credentials.username,
            password: credentials.password,
          });

          const decoded = jwtDecode<DecodedJWT>(response.data.accessToken);

          const user: User | AdapterUser = {
            id: credentials.username,
            accessToken: response.data.accessToken,
            username: decoded.username,
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
      if (user?.username) {
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.username = token.username as string;
      return session;
    },
  },
};

interface ProvidersProps {
  children: ReactNode;
}

export default async function AuthGuard({ children }: ProvidersProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    redirect("/login"); // Redirect if not authenticated
  }

  return <>{children}</>;
}
