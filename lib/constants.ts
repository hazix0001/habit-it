import { Calendar, CheckSquare, Home, ListTodo, Settings, Trophy, BarChart3 } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/habits", label: "Habits", icon: CheckSquare },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export const MOBILE_NAV = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/habits", label: "Habits", icon: CheckSquare },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export const CATEGORIES = [
  "Health",
  "Fitness",
  "Mind",
  "Learning",
  "Work",
  "Home",
  "Other",
] as const;

export const COLOR_CHOICES = [
  { name: "Grape", value: "#6C5CE7" },
  { name: "Sunny", value: "#FFB347" },
  { name: "Mint", value: "#54B654" },
  { name: "Berry", value: "#FF6B6B" },
] as const;

export const ICON_CHOICES = [
  "💧", "🚶", "📖", "💪", "🧘", "🏃",
  "🥗", "😴", "🎨", "💻", "🧹", "📝",
] as const;

export const XP_CHOICES = [
  { label: "Easy", xp: 5 },
  { label: "Normal", xp: 10 },
  { label: "Hard", xp: 20 },
] as const;

export const WEEKDAY_SHORT = ["S", "M", "T", "W", "T", "F", "S"] as const;
// Monday-first order for the week dots.
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

export type MockHabit = {
  id: string;
  icon: string;
  name: string;
  xp: number;
  done: boolean;
};

// Static mock data for Phase 1 skeleton only.
// Real habit logic (storage, streaks, XP) lands in Phase 4+.
export const MOCK_HABITS: MockHabit[] = [
  { id: "h1", icon: "💧", name: "Drink Water", xp: 10, done: true },
  { id: "h2", icon: "🚶", name: "Morning Walk", xp: 15, done: true },
  { id: "h3", icon: "📖", name: "Read 10 Pages", xp: 10, done: false },
  { id: "h4", icon: "💪", name: "Workout", xp: 20, done: false },
  { id: "h5", icon: "🧘", name: "Meditate", xp: 15, done: false },
];
