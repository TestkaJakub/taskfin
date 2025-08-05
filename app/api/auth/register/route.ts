// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password required" },
      { status: 400 }
    );
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json(
      { message: "Email already in use" },
      { status: 409 }
    );
  }
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, hash } });
  return NextResponse.json({ ok: true }, { status: 201 });
}