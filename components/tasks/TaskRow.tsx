"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/types/index";
import type { TaskBucket } from "@/lib/tasks";
import { PixelCheckbox } from "@/components/ui/PixelCheckbox";
import { PixelBadge } from "@/components/ui/PixelBadge";

type Props = {
  task: Task;
  bucket: TaskBucket;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function formatDeadline(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function TaskRow({ task, bucket, onToggle, onEdit, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="flex items-center gap-3 border-[3px] border-[var(--color-ink)] bg-white p-3 dark:border-black dark:bg-[#100e18]">
      <PixelCheckbox
        checked={task.done}
        onChange={onToggle}
        label={task.done ? `Mark ${task.title} as not done` : `Complete ${task.title}`}
      />
      <div className="min-w-0 flex-1">
        <p
          className={
            task.done
              ? "truncate font-bold line-through opacity-60"
              : "truncate font-bold"
          }
        >
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {task.deadline ? (
            <PixelBadge>
              📅 {formatDeadline(task.deadline)}
              {bucket === "overdue" ? " · OVERDUE" : ""}
              {bucket === "today" ? " · TODAY" : ""}
            </PixelBadge>
          ) : (
            <PixelBadge>ANYTIME</PixelBadge>
          )}
          {bucket === "overdue" && !task.done ? (
            <span className="text-xs font-extrabold opacity-70">
              Small steps still count 🌱
            </span>
          ) : null}
        </div>
      </div>
      <PixelBadge>+{task.xpReward} XP</PixelBadge>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${task.title}`}
        className="pixel-option p-2"
      >
        <Pencil size={14} aria-hidden="true" />
      </button>
      {confirming ? (
        <button
          type="button"
          onClick={onDelete}
          className="pixel-option bg-[#ff6b6b] p-2 text-xs font-black text-white"
        >
          Sure?
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          aria-label={`Delete ${task.title}`}
          className="pixel-option p-2"
        >
          <Trash2 size={14} aria-hidden="true" />
        </button>
      )}
    </li>
  );
}
