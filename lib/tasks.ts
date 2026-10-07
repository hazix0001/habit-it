import type { Task } from "@/types/index";

export type TaskBucket = "done" | "overdue" | "today" | "upcoming";

/**
 * done            -> done (regardless of deadline)
 * deadline past   -> overdue
 * deadline today
 *   or no date    -> today (anytime tasks live here)
 * deadline future -> upcoming
 */
export function bucketTask(task: Task, today: string): TaskBucket {
  if (task.done) return "done";
  if (!task.deadline) return "today";
  if (task.deadline < today) return "overdue";
  if (task.deadline === today) return "today";
  return "upcoming";
}

export type GroupedTasks = Record<TaskBucket, Task[]>;

export function groupTasks(tasks: Task[], today: string): GroupedTasks {
  const grouped: GroupedTasks = { done: [], overdue: [], today: [], upcoming: [] };
  for (const task of tasks) {
    grouped[bucketTask(task, today)].push(task);
  }
  const byDeadline = (a: Task, b: Task) =>
    (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999");
  grouped.overdue.sort(byDeadline);
  grouped.today.sort(byDeadline);
  grouped.upcoming.sort(byDeadline);
  return grouped;
}
