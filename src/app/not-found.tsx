import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 p-8">
      <Logo />
      <h1 className="font-display text-3xl">This aisle is empty</h1>
      <p className="text-maroon-600">The craft you are looking for has wandered back to its village.</p>
      <Link href="/" className="px-5 py-2 rounded-full bg-maroon-700 text-cream-50">Return to INDIVA</Link>
    </div>
  );
}
