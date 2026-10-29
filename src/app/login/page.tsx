"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

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
    <form onSubmit={submit} className="w-full max-w-[350px] bg-white border border-gray-300 rounded p-6">
      <div className="flex justify-center mb-4"><Logo /></div>
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      {err ? <p className="text-red-700 text-sm mb-3">{err}</p> : null}
      <label className="text-sm font-bold block">Email
        <input autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border border-gray-400 rounded px-3 py-2" required />
      </label>
      <label className="text-sm font-bold block mt-3">Password
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border border-gray-400 rounded px-3 py-2" required />
      </label>
      <button className="mt-5 w-full py-2 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] font-medium">Continue</button>
      <p className="text-[11px] text-gray-600 mt-3">By continuing you agree to INDIVA’s Conditions of Use and Privacy Notice. 70–80% of every purchase is credited to the artisan.</p>
      <p className="text-center text-sm mt-5">New to INDIVA? <Link href="/register" className="text-[#0066c0] hover:underline">Create your account</Link></p>
    </form>
  );
}

export default function Login() {
  return (
    <div className="min-h-dvh flex flex-col items-center pt-10 px-4 bg-white">
      <Suspense fallback={<p>Loading…</p>}><Form /></Suspense>
    </div>
  );
}
