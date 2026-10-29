import Header from "./Header";
import Footer from "./Footer";
import MobileTabBar from "./MobileTabBar";
import Experience from "./Experience";
import { getSession, sidFromCookies } from "@/lib/auth";
import { one, getSettings } from "@/lib/db";

export default async function StoreShell({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  const sid = sidFromCookies();
  let cartCount = 0;
  try {
    const row = user
      ? await one<any>("SELECT COALESCE(SUM(qty),0) AS c FROM cart_items WHERE user_id=?", [user.id])
      : await one<any>("SELECT COALESCE(SUM(qty),0) AS c FROM cart_items WHERE session_id=?", [sid]);
    cartCount = Number(row?.c || 0);
  } catch {
    cartCount = 0;
  }
  const settings = await getSettings().catch(() => ({} as Record<string, string>));
  return (
    <div id="top" className="min-h-dvh flex flex-col">
      <Header user={user} cartCount={cartCount} />
      {settings.freeze_store === "1" ? (
        <div className="bg-[#b12704] text-white text-center text-sm py-2 px-4">
          Checkout is paused for a short while. You can still browse the collection.
        </div>
      ) : settings.announcement ? (
        <div className="bg-[#232f3e] text-[#febd69] text-center text-sm py-2 px-4">{settings.announcement}</div>
      ) : null}
      <main className="flex-1 pb-tab">{children}</main>
      <Footer />
      <MobileTabBar cartCount={cartCount} />
      <Experience />
    </div>
  );
}
