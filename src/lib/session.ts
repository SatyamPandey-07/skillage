import { getIronSession, IronSessionData } from "iron-session";
import { cookies } from "next/headers";

declare module "iron-session" {
  interface IronSessionData {
    nonce?: string;
    walletAddress?: string;
    authMethod?: "privy" | "siwe";
  }
}

const SESSION_OPTIONS = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "skillage-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 24h
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<IronSessionData>(cookieStore, SESSION_OPTIONS);
}
