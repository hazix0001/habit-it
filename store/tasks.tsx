"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Task } from "@/types/index";
import { TASK_XP, loadTasks, saveTasks, seedTasks } from "@/lib/task-storage";

export type TaskInput = {
  title: string;
  deadline: string; // "" = none
};

type TasksContextValue = {
  ready: boolean;
  tasks: Task[];
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, input: TaskInput) => void;
  removeTask: (id: string) => void;
  /** Toggle completion. Returns the new state. */
  toggleTask: (id: string) => { done: boolean; xp: number };
};

const TasksContext = createContext<TasksContextValue | null>(null);

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `t-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  /* eslint-disable react-hooks/set-state-in-effect -- mount-only
     localStorage hydration (client-only data), same pattern as habits. */
  useEffect(() => {
    setTasks(loadTasks() ?? seedTasks());
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (ready) saveTasks(tasks);
  }, [ready, tasks]);

  const addTask = useCallback((input: TaskInput) => {
    const task: Task = {
      id: newId(),
      title: input.title.trim(),
      done: false,
      deadline: input.deadline || undefined,
      xpReward: TASK_XP,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, input: TaskInput) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title: input.title.trim(),
              deadline: input.deadline || undefined,
            }
          : t
      )
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return { done: false, xp: 0 };
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      );
      return { done: !task.done, xp: task.xpReward };
    },
    [tasks]
  );

  const value = useMemo(
    () => ({ ready, tasks, addTask, updateTask, removeTask, toggleTask }),
    [ready, tasks, addTask, updateTask, removeTask, toggleTask]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used inside TasksProvider");
  return ctx;
}
