// components/Providers.tsx
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { getServerSession, NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { axiosInstance, GetAxiosWithAuth } from "./lib/axios-instance";
import { SessionUser } from "@type/next-auth";

interface DecodedJWT extends JwtPayload {
  username: string;
}

// Define the type for authOptions
export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        token: { label: "Token", type: "text", optional: true },
        username: { label: "Username", type: "text", optional: true },
        password: { label: "Password", type: "password", optional: true },
      },
      async authorize(credentials) {
        if (credentials?.token) {
          const token = credentials?.token;
          if (!token) return null;

          return loginWithToken(token);
        } else if (credentials?.username && credentials?.password) {
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Missing credentials");
          }

          return loginWithCredentials(
            credentials.username,
            credentials.password
          );
        } else {
          throw new Error("Missing credentials");
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
      const accessToken = token.accessToken as string;
      const axios = await GetAxiosWithAuth(accessToken);
      const { data } = await axios.get<SessionUser>("user");

      session.user = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        image: data.image,
        subscription: {
          planType: data.subscription.planType,
          status: data.subscription.status,
          interval: data.subscription.interval,
          currentPeriodEnd: data.subscription.currentPeriodEnd,
          cancelAtPeriodEnd: data.subscription.cancelAtPeriodEnd,
          features: data.subscription.features,
        },
      };
      session.accessToken = token.accessToken as string;
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

function loginWithToken(token: string) {
  // OPTIONAL: Validate the token with your backend
  // const res = await axiosInstance("https://your-backend.com/api/auth/validate", {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // if (!res.ok) return null;
  // const user = await res.json();

  try {
    const decoded = jwtDecode<DecodedJWT>(token);
    const user: User | AdapterUser = {
      id: decoded.username,
      accessToken: token,
      username: decoded.username,
    };

    return user;
  } catch (error) {
    console.error("Error decoding token:", error);
    throw new Error("Invalid token");
  }
}

async function loginWithCredentials(username: string, password: string) {
  try {
    const response = await axiosInstance.post(`auth/login`, {
      username: username,
      password: password,
    });

    const decoded = jwtDecode<DecodedJWT>(response.data.accessToken);

    const user: User | AdapterUser = {
      id: username,
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
}
