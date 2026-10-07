import type { Metadata, Viewport } from "next";
import { Press_Start_2P, Nunito } from "next/font/google";
import "./globals.css";
import { HabitsProvider } from "@/store/habits";
import { TasksProvider } from "@/store/tasks";
import { SettingsProvider } from "@/store/settings";
import { RegisterSw } from "@/components/pwa/RegisterSw";

const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

const bodyFont = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit It — Build Better Habits",
  description:
    "Track habits, build streaks and grow your pixel companion. Small habits. Big changes.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "Habit It",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#6C5CE7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${pixelFont.variable} ${bodyFont.variable} h-full`}
    >
      <body className="min-h-full">
        <RegisterSw />
        <HabitsProvider>
          <TasksProvider>
            <SettingsProvider>{children}</SettingsProvider>
          </TasksProvider>
        </HabitsProvider>
      </body>
    </html>
  );
}
