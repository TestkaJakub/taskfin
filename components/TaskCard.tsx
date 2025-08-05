"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { computePriority } from "@/lib/prioritization";
import { Check, Trash2 } from "lucide-react";
import type { TaskDTO } from "@/shared/types";

interface TaskCardProps {
  task: TaskDTO;
  x?: number;
  onDelete?: (id: number) => void;
  onComplete?: (id: number) => void;
}

export function TaskCard({
  task,
  x = 1,
  onDelete,
  onComplete,
}: TaskCardProps) {
  const {
    id,
    title,
    description,
    importance,
    enjoyment,
    practicalValue,
    due,
  } = task;

  const priority = computePriority(
    importance,
    enjoyment,
    practicalValue,
    due,
    x
  );

  return (
    <Card className="relative">
      <CardContent className="space-y-2">
        <div className="flex flex-col gap-4 justify-between">
          <div>
            <div className="flex place-items-center gap-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              {due && (
                <div className="text-xs text-gray-500">
                  Due {new Date(due).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="flex gap-4 text-sm">
              <span>Imp: {importance}</span>
              <span>Enjoy: {enjoyment}</span>
              <span>Value: {practicalValue}</span>
            </div>
          </div>
          <div className="place-items-center flex">
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
            
          </div>
          <div className="text-sm font-medium flex place-items-center">
            <div className="pr-8">
              Priority: {priority.toFixed(2)}
            </div>
            {onComplete ? (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-green-600"
                onClick={() => onComplete(id)}
                aria-label="Mark complete"
              >
                <Check />
              </Button>
            ) : onDelete ? (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => onDelete(id)}
                aria-label="Delete"
              >
                <Trash2 />
              </Button>
            ) : null}
          </div>
        </div>
        
      </CardContent>
    </Card>
  );
}