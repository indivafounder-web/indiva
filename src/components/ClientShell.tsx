"use client";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileTabBar from "./MobileTabBar";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState(0);
  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user));
    fetch("/api/cart").then((r) => r.json()).then((d) => setCart((d.items || []).reduce((a: number, i: any) => a + i.qty, 0)));
  }, []);
  return (
    <div className="min-h-dvh flex flex-col">
      <Header user={user} cartCount={cart} />
      <main className="flex-1 pb-tab">{children}</main>
      <Footer />
      <MobileTabBar cartCount={cart} />
    </div>
  );
}
