// app/api/tasks/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

// Use the type NextRequest from next/server, which includes params
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  // Access params directly from the NextRequest object
  const id = req.nextUrl.pathname.split("/").pop(); // Gets the last part of the URL path

  if (!id) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthenticated" },
      { status: 401 }
    );
  }

  const taskId = parseInt(id, 10);
  if (isNaN(taskId)) {
    return NextResponse.json({ error: "Invalid task ID format" }, { status: 400 });
  }

  // Delete only if it belongs to this user
  await prisma.task.deleteMany({
    where: { id: taskId, userId: session.user.id },
  });

  // 204 No Content must have no body
  return new NextResponse(null, { status: 204 });
}