"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, ShoppingCart, UserRound } from "lucide-react";

export default function MobileTabBar({ cartCount = 0 }: { cartCount?: number }) {
  const path = usePathname() || "/";
  if (path.startsWith("/admin") || path.startsWith("/seller") || path.startsWith("/login") || path.startsWith("/register")) {
    return null;
  }
  const tabs = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/shop", icon: Compass, label: "Explore" },
    { href: "/cart", icon: ShoppingCart, label: "Cart", badge: cartCount },
    { href: "/account", icon: UserRound, label: "Account" },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream-50/95 backdrop-blur border-t border-maroon-100">
      <ul className="grid grid-cols-4 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {tabs.map((t) => {
          const on = t.href === "/" ? path === "/" : path.startsWith(t.href);
          const Icon = t.icon;
          return (
            <li key={t.href}>
              <Link href={t.href} className={`flex flex-col items-center gap-0.5 text-[11px] ${on ? "text-maroon-700" : "text-maroon-400"}`}>
                <span className="relative">
                  <Icon size={22} strokeWidth={on ? 2.4 : 1.8} />
                  {t.badge ? (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-maroon-700 text-white text-[10px] flex items-center justify-center">
                      {t.badge}
                    </span>
                  ) : null}
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
