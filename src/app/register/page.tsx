"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer", city: "", state: "", craft: "" });
  const [err, setErr] = useState("");
  const router = useRouter();
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await r.json();
    if (!r.ok) setErr(d.error);
    else router.push(form.role === "seller" ? "/seller" : "/");
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white border border-maroon-100 rounded-3xl p-8 shadow-soft">
        <div className="flex justify-center mb-4"><Logo /></div>
        <h1 className="font-display text-2xl text-center">Create account</h1>
        {err ? <p className="text-red-700 text-sm mt-3">{err}</p> : null}
        {["name", "email", "password", "city", "state"].map((k) => (
          <label key={k} className="text-sm block mt-3 capitalize">{k}
            <input type={k === "password" ? "password" : "text"} required={k !== "city" && k !== "state"} value={(form as any)[k]} onChange={(e) => set(k, e.target.value)} className="mt-1 w-full border border-maroon-200 rounded-lg px-3 py-2 bg-cream-50" />
          </label>
        ))}
        <label className="text-sm block mt-3">I am a
          <select value={form.role} onChange={(e) => set("role", e.target.value)} className="mt-1 w-full border border-maroon-200 rounded-lg px-3 py-2 bg-cream-50">
            <option value="customer">Customer</option>
            <option value="seller">Artisan / Seller</option>
          </select>
        </label>
        {form.role === "seller" ? (
          <label className="text-sm block mt-3">Craft
            <input value={form.craft} onChange={(e) => set("craft", e.target.value)} className="mt-1 w-full border border-maroon-200 rounded-lg px-3 py-2 bg-cream-50" />
          </label>
        ) : null}
        <button className="mt-5 w-full py-2.5 rounded-full bg-gold-400 text-maroon-900 font-semibold">Create INDIVA account</button>
        <p className="text-center text-sm mt-4"><Link href="/login" className="underline">Already have an account?</Link></p>
      </form>
    </div>
  );
}
