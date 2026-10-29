"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ClientShell from "@/components/ClientShell";
import { Package, Heart, MapPin, Shield, Store, LogOut } from "lucide-react";

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      setUser(d.user);
      setLoaded(true);
      if (!d.user) router.replace("/login?next=/account");
    });
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (!loaded || !user) return <ClientShell><div className="p-12 text-center">Loading…</div></ClientShell>;

  const cards = [
    { href: "/orders", icon: Package, t: "Your Orders", d: "Track, return or buy again" },
    { href: "/wishlist", icon: Heart, t: "Wishlist", d: "Saved heirlooms" },
    { href: "/shop", icon: Store, t: "Keep shopping", d: "29 states, one cart" },
    { href: "/export", icon: MapPin, t: "Export desk", d: "Ship outside India" },
  ];
  if (user.role === "admin") cards.push({ href: "/admin", icon: Shield, t: "CEO command", d: "Takeover, people, finance, crisis" });
  if (user.role === "seller" || user.role === "admin") cards.push({ href: "/seller", icon: Store, t: "Maker desk", d: "Income, listings, SOS" });

  return (
    <ClientShell>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="font-display text-3xl">Hello, {user.name}</h1>
        <p className="text-maroon-600">{user.email} · {user.role}</p>
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="flex gap-4 bg-white border border-maroon-100 rounded-2xl p-5 hover:shadow-soft">
              <c.icon className="text-maroon-700" />
              <div>
                <p className="font-semibold">{c.t}</p>
                <p className="text-sm text-maroon-600">{c.d}</p>
              </div>
            </Link>
          ))}
        </div>
        <button onClick={logout} className="mt-8 inline-flex items-center gap-2 text-sm text-maroon-700">
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </ClientShell>
  );
}
