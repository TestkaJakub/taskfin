// components/TaskCardWrapper.tsx
"use client";

import { useRouter } from "next/navigation";
import { TaskCard } from "./TaskCard";
import type { TaskDTO } from "@/shared/types";

export default function TaskCardWrapper({ task }: { task: TaskDTO }) {
  const router = useRouter();

  async function handleComplete() {
    const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    if (res.ok) {
      // refresh this segment to re-run the server component
      router.refresh();
    } else {
      alert("Failed to complete task");
    }
  }

  return (
    <TaskCard
      task={task}
      onComplete={handleComplete}  // now defined inside the client component
    />
  );
}