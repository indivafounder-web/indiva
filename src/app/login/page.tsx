"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Filigree } from "@/components/Ornament";

function Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const d = await r.json();
    if (!r.ok) setErr(d.error || "Unable to sign in");
    else {
      const dest =
        d.user?.role === "admin" && next === "/"
          ? "/admin"
          : d.user?.role === "seller" && next === "/"
            ? "/seller"
            : next;
      router.push(dest);
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="relative w-full max-w-[400px] bg-cream-50/95 border border-gold-200 rounded-3xl p-8 shadow-lift gold-frame">
      <Filigree className="absolute -top-16 -right-16 w-40 opacity-30 pointer-events-none" />
      <div className="flex justify-center mb-4"><Logo size={34} /></div>
      <p className="text-center font-script italic text-gold-600 mb-1">Welcome to the house</p>
      <h1 className="font-display text-3xl text-center mb-6">Sign in</h1>
      {err ? <p className="text-red-800 text-sm mb-3 text-center">{err}</p> : null}
      <label className="text-sm font-medium block text-maroon-800">Email
        <input autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border border-maroon-200 rounded-xl px-3 py-2.5 bg-white" required />
      </label>
      <label className="text-sm font-medium block mt-4 text-maroon-800">Password
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border border-maroon-200 rounded-xl px-3 py-2.5 bg-white" required />
      </label>
      <button className="mt-6 w-full py-2.5 rounded-full bg-maroon-700 text-gold-200 font-medium tracking-wide hover:bg-maroon-800 transition">
        Enter INDIVA
      </button>
      <p className="text-[11px] text-maroon-600 mt-4 text-center leading-relaxed">
        70–80% of every purchase is credited to the artisan. By continuing you agree to INDIVA’s Conditions of Use.
      </p>
      <p className="text-center text-sm mt-5">New to INDIVA? <Link href="/register" className="text-maroon-800 underline decoration-gold-400 underline-offset-4">Create your account</Link></p>
    </form>
  );
}

export default function Login() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-12 mandala-bg relative overflow-hidden">
      <Filigree className="absolute -left-20 top-10 w-72 opacity-25 spin-slow" />
      <Suspense fallback={<p className="text-maroon-700">Loading…</p>}><Form /></Suspense>
    </div>
  );
}
