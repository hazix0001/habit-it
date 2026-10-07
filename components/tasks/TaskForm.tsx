"use client";

import { useState } from "react";
import type { Task } from "@/types/index";
import { useTasks, type TaskInput } from "@/store/tasks";
import { PixelModal } from "@/components/ui/PixelModal";
import { PixelField } from "@/components/ui/PixelField";
import { PixelButton } from "@/components/ui/PixelButton";
import { TASK_XP } from "@/lib/task-storage";

type Props = {
  initial?: Task | null;
  onClose: () => void;
};

export function TaskForm({ initial, onClose }: Props) {
  const { addTask, updateTask } = useTasks();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [deadline, setDeadline] = useState(initial?.deadline ?? "");
  const [error, setError] = useState("");

  function submit() {
    if (title.trim().length === 0) {
      setError("Give your task a title first 🌱");
      return;
    }
    const input: TaskInput = { title, deadline };
    if (initial) updateTask(initial.id, input);
    else addTask(input);
    onClose();
  }

  return (
    <PixelModal title={initial ? "EDIT TASK" : "NEW TASK"} onClose={onClose}>
      <PixelField label="TASK TITLE">
        <input
          className="pixel-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Buy groceries"
          maxLength={80}
        />
      </PixelField>

      <PixelField label="DEADLINE (OPTIONAL)">
        <input
          type="date"
          className="pixel-input"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </PixelField>

      <p className="mb-4 text-sm font-extrabold text-[var(--color-primary-dark)]">
        Completing this task earns +{TASK_XP} XP
      </p>

      {error ? (
        <p role="alert" className="mb-3 text-sm font-extrabold">
          {error}
        </p>
      ) : null}

      <PixelButton variant="primary" onClick={submit} className="w-full">
        {initial ? "SAVE CHANGES" : "CREATE TASK"}
      </PixelButton>
    </PixelModal>
  );
}
