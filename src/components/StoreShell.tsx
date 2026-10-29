import Header from "./Header";
import Footer from "./Footer";
import MobileTabBar from "./MobileTabBar";
import { getSession, sidFromCookies } from "@/lib/auth";
import { one } from "@/lib/db";

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
  return (
    <div id="top" className="min-h-dvh flex flex-col">
      <Header user={user} cartCount={cartCount} />
      <main className="flex-1 pb-tab">{children}</main>
      <Footer />
      <MobileTabBar cartCount={cartCount} />
    </div>
  );
}
