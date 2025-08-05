"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { computePriority } from "@/lib/prioritization";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/TaskCard";

interface Task {
  id: number;
  title: string;
  description: string | null;
  importance: number;
  enjoyment: number;
  practicalValue: number;
  createdAt: string;
  due: string | null;
}

export default function TasksPage() {
  const x = 1;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("");
  const [importance, setImportance] = useState(0);
  const [enjoyment, setEnjoyment] = useState(0);
  const [practicalValue, setPracticalValue] = useState(0);

  // Redirect if not auth’d
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/login");
  }, [status, router]);

  // Fetch tasks
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/tasks")
        .then((r) => r.json())
        .then(setTasks);
    }
  }, [status]);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        due,
        importance,
        enjoyment,
        practicalValue,
      }),
    });
    if (res.ok) {
      const newTask: Task = await res.json();
      setTasks((ts) => [newTask, ...ts]);
      // reset form
      setTitle("");
      setDescription("");
      setDue("");
      setImportance(0);
      setEnjoyment(0);
      setPracticalValue(0);
    } else {
      alert((await res.json()).error);
    }
  }

  async function deleteTask(id: number) {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.status === 204) {
      setTasks((ts) => ts.filter((t) => t.id !== id));
    } else {
      alert("Failed to delete task");
    }
  }

  if (status !== "authenticated") {
    return <div className="p-8">Loading…</div>;
  }

  return (
    <div className="flex flex-col space-y-6 p-8 px-16 justify-center text-center">
      {/* Add Task Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={addTask} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details…"
              />
            </div>
            <div>
              <Label htmlFor="due">Due Date (optional)</Label>
              <Input
                id="due"
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="importance">Importance: {importance}</Label>
                <input
                  id="importance"
                  type="range"
                  min="0"
                  max="10"
                  value={importance}
                  onChange={(e) =>
                    setImportance(Number(e.target.value))
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="enjoyment">Enjoyment: {enjoyment}</Label>
                <input
                  id="enjoyment"
                  type="range"
                  min="0"
                  max="10"
                  value={enjoyment}
                  onChange={(e) =>
                    setEnjoyment(Number(e.target.value))
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="practicalValue">
                  Practical Value: {practicalValue}
                </Label>
                <input
                  id="practicalValue"
                  type="range"
                  min="0"
                  max="10"
                  value={practicalValue}
                  onChange={(e) =>
                    setPracticalValue(Number(e.target.value))
                  }
                  className="w-full"
                />
              </div>
            </div>
            <Button type="submit">Add Task</Button>
          </form>
        </CardContent>
      </Card>

      {/* Task list */}
      <p>Below is the list of all your tasks. If you feel overwhelmed go to the {" "}
        <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Top 3 view
        </a>
      </p>
      <div className="grid gap-4">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} onDelete={deleteTask} />
        ))}
      </div>
    </div>
  );
}