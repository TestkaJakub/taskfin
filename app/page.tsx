// app/page.tsx  (Server Component)
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { computePriority } from "@/lib/prioritization";
import type { TaskDTO } from "@/shared/types";
import TaskCardWrapper from "@/components/TaskCardWrapper";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login");

  const raw = await prisma.task.findMany({ where: { userId: session.user.id } });
  const dtos: TaskDTO[] = raw.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    importance: t.importance,
    enjoyment: t.enjoyment,
    practicalValue: t.practicalValue,
    due: t.due?.toISOString() ?? null,
    createdAt: t.createdAt.toISOString(),
    userId: t.userId,
  }));

  dtos.sort(
    (a, b) =>
      computePriority(
        b.importance,
        b.enjoyment,
        b.practicalValue,
        b.due,
        1
      ) -
      computePriority(
        a.importance,
        a.enjoyment,
        a.practicalValue,
        a.due,
        1
      )
  );

  const topThree = dtos.slice(0, 3);

  return (
    <div className="flex flex-col space-y-6 p-8 justify-center text-center">
      <h1 className="text-xl font-bold">Welcome {session.user.email},</h1>
      <h2 className="text-2xl font-bold">here are your top 3 Tasks</h2>
      {topThree.length === 0 ? (
        <p className="text-[var(--muted-foreground)]">
          No tasks yet.{" "}
          <a href="/tasks" className="text-blue-600 dark:text-blue-400 hover:underline">
            Add one
          </a>
        </p>
      ) : (
        <div className="grid gap-4 px-8">
          {topThree.map((t) => (
            <TaskCardWrapper key={t.id} task={t} />
          ))}
          <a href="/tasks" className="text-blue-600 dark:text-blue-400 hover:underline">
            Create task
          </a>
        </div>
      )}
    </div>
  );
}