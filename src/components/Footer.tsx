import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-16 bg-maroon-900 text-cream-200">
      <a href="#top" className="block text-center py-3 bg-maroon-800 text-sm hover:bg-maroon-700">
        Back to top
      </a>
      <div className="max-w-7xl mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
        <div>
          <Logo light />
          <p className="font-script italic text-lg text-gold-200 mt-3">One India. One Store. One Experience.</p>
          <p className="mt-3 text-cream-300/80 leading-relaxed">
            A luxury house for crafts from all 29 states. Direct from artisans. Plastic-free. Export-ready.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Shop</h4>
          <ul className="space-y-2 text-cream-300/90">
            <li><Link href="/shop?category=fashion">Fashion & Textiles</Link></li>
            <li><Link href="/shop?category=decor">Home & Décor</Link></li>
            <li><Link href="/shop?category=gourmet">Gourmet Foods</Link></li>
            <li><Link href="/shop?category=wellness">Wellness</Link></li>
            <li><Link href="/shop?category=lifestyle">Jewelry & Lifestyle</Link></li>
            <li><Link href="/states">Shop by State</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">INDIVA</h4>
          <ul className="space-y-2 text-cream-300/90">
            <li><Link href="/about">Our movement</Link></li>
            <li><Link href="/export">Export desk</Link></li>
            <li><Link href="/seller">Artisan seller app</Link></li>
            <li><Link href="/login">Sign in</Link></li>
            <li><Link href="/register">Create account</Link></li>
            <li><Link href="/admin">Super Admin</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Trust</h4>
          <ul className="space-y-2 text-cream-300/90">
            <li>GI-tagged authenticity</li>
            <li>Product digital passport (QR)</li>
            <li>70–80% to the maker</li>
            <li>EU Green Deal packaging</li>
            <li>No child labour · Women SHGs first</li>
            <li>IEC · EPCH · MSME Udyam</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-cream-300/70">
        © {new Date().getFullYear()} INDIVA · Essence of Every State. Elegance for the World.
      </div>
    </footer>
  );
}
