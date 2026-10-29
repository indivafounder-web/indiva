"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Suspense } from "react";

function Form() {
  const [email, setEmail] = useState("customer@indiva.in");
  const [password, setPassword] = useState("Customer@2026");
  const [err, setErr] = useState("");
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const d = await r.json();
    if (!r.ok) setErr(d.error);
    else {
      const dest = d.user?.role === "admin" && next === "/" ? "/admin" : d.user?.role === "seller" && next === "/" ? "/seller" : next;
      router.push(dest);
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md bg-white border border-maroon-100 rounded-3xl p-8 shadow-soft">
      <div className="flex justify-center mb-4"><Logo /></div>
      <h1 className="font-display text-2xl text-center">Sign in</h1>
      <p className="text-center text-sm text-maroon-600 mb-6">One India. One Store. One Experience.</p>
      {err ? <p className="text-red-700 text-sm mb-3">{err}</p> : null}
      <label className="text-sm block">Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border border-maroon-200 rounded-lg px-3 py-2 bg-cream-50" />
      </label>
      <label className="text-sm block mt-3">Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border border-maroon-200 rounded-lg px-3 py-2 bg-cream-50" />
      </label>
      <button className="mt-5 w-full py-2.5 rounded-full bg-gold-400 text-maroon-900 font-semibold">Continue</button>
      <div className="mt-6 text-xs text-maroon-600 space-y-1 bg-cream-200 rounded-xl p-3">
        <p className="font-medium text-ink">Demo accounts</p>
        <p>Super Admin · admin@indiva.in · Indiva@2026</p>
        <p>Seller · seller@indiva.in · Seller@2026</p>
        <p>Customer · customer@indiva.in · Customer@2026</p>
      </div>
      <p className="text-center text-sm mt-4">New to INDIVA? <Link href="/register" className="underline">Create an account</Link></p>
    </form>
  );
}

export default function Login() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6 mandala-bg">
      <Suspense><Form /></Suspense>
    </div>
  );
}
