import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function Sidebar() {
  return (
    <aside
      className="hidden lg:flex w-60 shrink-0 flex-col border-r-4 border-[var(--color-ink)] bg-[#fffdf6] dark:bg-[var(--color-night-card)] dark:border-black p-5"
      aria-label="Main navigation"
    >
      <Link href="/dashboard" className="font-pixel text-sm leading-relaxed mb-1">
        HABIT IT
      </Link>
      <p className="text-xs font-bold opacity-70 mb-6">
        Small habits. Big changes.
      </p>
      <nav aria-label="Sections">
        <ul className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold border-[3px] border-transparent hover:border-[var(--color-ink)] hover:bg-[var(--color-cream)] dark:hover:bg-[#100e18] focus-visible:outline-3 focus-visible:outline-[var(--color-sunny)]"
              >
                <item.icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-6">
        <LogoutButton />
      </div>
    </aside>
  );
}
