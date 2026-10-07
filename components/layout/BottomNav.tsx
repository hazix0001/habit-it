import Link from "next/link";
import { MOBILE_NAV } from "@/lib/constants";

export function BottomNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-10 border-t-4 border-[var(--color-ink)] bg-[#fffdf6] dark:bg-[var(--color-night-card)] dark:border-black"
    >
      <ul className="grid grid-cols-4">
        {MOBILE_NAV.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold focus-visible:outline-3 focus-visible:outline-[var(--color-sunny)]"
            >
              <item.icon size={20} aria-hidden="true" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
