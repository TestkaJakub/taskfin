import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

interface TaskResponse {
  id: number;
  title: string;
  description: string | null;
  importance: number;
  enjoyment: number;
  practicalValue: number;
  createdAt: string;
  due: string | null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  const out: TaskResponse[] = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    importance: t.importance,
    enjoyment: t.enjoyment,
    practicalValue: t.practicalValue,
    createdAt: t.createdAt.toISOString(),
    due: t.due ? t.due.toISOString() : null,
  }));
  return NextResponse.json(out);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const {
    title,
    description,
    due,
    importance,
    enjoyment,
    practicalValue,
  } = await req.json();

  if (due) {
    const dueDate = new Date(due);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dueDate < today) {
      return NextResponse.json(
        { error: "Due date cannot be in the past." },
        { status: 400 }
      );
    }
  }

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  const imp = Number(importance) || 0;
  const enj = Number(enjoyment) || 0;
  const prl = Number(practicalValue) || 0;

  const t = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      due: due ? new Date(due) : null,
      importance: Math.min(10, Math.max(0, imp)),
      enjoyment: Math.min(10, Math.max(0, enj)),
      practicalValue: Math.min(10, Math.max(0, prl)),
      userId: session.user.id,
    },
  });

  const out: TaskResponse = {
    id: t.id,
    title: t.title,
    description: t.description,
    importance: t.importance,
    enjoyment: t.enjoyment,
    practicalValue: t.practicalValue,
    createdAt: t.createdAt.toISOString(),
    due: t.due ? t.due.toISOString() : null,
  };
  return NextResponse.json(out, { status: 201 });
}