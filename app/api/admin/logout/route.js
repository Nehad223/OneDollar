import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function GET() {
  const res = NextResponse.redirect("/admin/login");
  res.cookies.set("admin_token", "", { maxAge: 0 });
  return res;
}
