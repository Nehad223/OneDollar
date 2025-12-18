import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  const { email, password } = await req.json();

  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || admin.password !== password) {
    return NextResponse.json(
      { error: "Wrong email or password" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("admin_token", "LOGGED_IN", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
