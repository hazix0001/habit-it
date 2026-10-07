"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import type { Task } from "@/types/index";
import { useTasks } from "@/store/tasks";
import { groupTasks } from "@/lib/tasks";
import { todayKey } from "@/lib/habit-logic";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskRow } from "@/components/tasks/TaskRow";
import {
  CelebrationToast,
  type Celebration,
} from "@/components/dashboard/CelebrationToast";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";

const SECTIONS = [
  { key: "overdue", title: "OVERDUE" },
  { key: "today", title: "TODAY" },
  { key: "upcoming", title: "UPCOMING" },
  { key: "done", title: "DONE" },
] as const;

export default function TasksPage() {
  const { ready, tasks, removeTask, toggleTask } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [toast, setToast] = useState<Celebration>(null);
  const toastKey = useRef(0);

  if (!ready) {
    return (
      <PixelCard title="TASKS">
        <p className="font-pixel animate-pulse text-xs">LOADING…</p>
      </PixelCard>
    );
  }

  const grouped = groupTasks(tasks, todayKey());
  const open = tasks.filter((t) => !t.done).length;

  function toggle(task: Task) {
    const result = toggleTask(task.id);
    if (result.done) {
      setToast({ key: ++toastKey.current, name: task.title, xp: result.xp });
    }
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-pixel text-[0.65rem] opacity-70">HABIT IT</p>
          <h1 className="text-2xl font-extrabold">Tasks</h1>
          <p className="text-sm font-bold opacity-70">
            {open === 0
              ? "All clear — nice work! 🎉"
              : `${open} open task${open === 1 ? "" : "s"}`}
          </p>
        </div>
        <PixelButton variant="secondary" onClick={() => setShowForm(true)}>
          <Plus size={16} strokeWidth={3} aria-hidden="true" />
          ADD TASK
        </PixelButton>
      </div>

      {tasks.length === 0 ? (
        <PixelCard className="text-center">
          <p className="mb-3 text-4xl">📋</p>
          <p className="font-pixel mb-2 text-xs">NO TASKS YET</p>
          <p className="mb-5 text-sm font-bold opacity-70">
            One-time to-dos live here. Habits build streaks — tasks get things
            done!
          </p>
          <PixelButton variant="primary" onClick={() => setShowForm(true)}>
            <Plus size={16} strokeWidth={3} aria-hidden="true" />
            CREATE TASK
          </PixelButton>
        </PixelCard>
      ) : (
        <div className="flex flex-col gap-5">
          {SECTIONS.map((section) => {
            const list = grouped[section.key];
            if (list.length === 0) return null;
            return (
              <PixelCard key={section.key} title={`${section.title} (${list.length})`}>
                <ul className="flex flex-col gap-3">
                  {list.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      bucket={section.key}
                      onToggle={() => toggle(task)}
                      onEdit={() => setEditing(task)}
                      onDelete={() => removeTask(task.id)}
                    />
                  ))}
                </ul>
              </PixelCard>
            );
          })}
        </div>
      )}

      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
      {editing && (
        <TaskForm initial={editing} onClose={() => setEditing(null)} />
      )}
      <CelebrationToast toast={toast} onDone={() => setToast(null)} />
    </>
  );
}
