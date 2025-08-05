// app/api/auth/delete/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  // delete all tasks first (if your schema doesn’t cascade)
  await prisma.task.deleteMany({ where: { userId } });
  // then delete the user
  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ ok: true });
}