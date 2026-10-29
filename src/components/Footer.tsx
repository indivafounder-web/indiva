import Link from "next/link";
import Logo from "./Logo";
import { Lotus } from "./Ornament";

export default function Footer() {
  return (
    <footer className="mt-16 bg-maroon-900 text-cream-100">
      <div className="gold-line" />
      <div className="max-w-7xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Logo light />
          <p className="mt-4 font-script italic text-xl text-gold-200">One India. One Store. One Experience.</p>
          <p className="mt-3 text-cream-200/80 text-sm leading-relaxed">
            Authentic crafts from every Indian state. GI tagged. Plastic-free packing. 70–80% to the maker.
          </p>
          <Lotus className="w-16 mt-5 opacity-80" />
        </div>
        <div>
          <h4 className="font-display tracking-[0.2em] text-gold-200 mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-cream-100/85">
            <li><Link href="/shop?category=fashion" className="hover:text-gold-200">Fashion & Textiles</Link></li>
            <li><Link href="/shop?category=decor" className="hover:text-gold-200">Home & Décor</Link></li>
            <li><Link href="/shop?category=gourmet" className="hover:text-gold-200">Gourmet</Link></li>
            <li><Link href="/shop?category=wellness" className="hover:text-gold-200">Wellness</Link></li>
            <li><Link href="/shop?category=lifestyle" className="hover:text-gold-200">Jewelry</Link></li>
            <li><Link href="/states" className="hover:text-gold-200">Shop by State</Link></li>
            <li><Link href="/hampers" className="hover:text-gold-200">Gift hampers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display tracking-[0.2em] text-gold-200 mb-4">Help</h4>
          <ul className="space-y-2 text-sm text-cream-100/85">
            <li><Link href="/tracking" className="hover:text-gold-200">Track a parcel</Link></li>
            <li><Link href="/orders" className="hover:text-gold-200">Your orders</Link></li>
            <li><Link href="/account" className="hover:text-gold-200">Your account</Link></li>
            <li><Link href="/about" className="hover:text-gold-200">Our story</Link></li>
            <li><Link href="/impact" className="hover:text-gold-200">Sustainability</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display tracking-[0.2em] text-gold-200 mb-4">Trust</h4>
          <ul className="space-y-2 text-sm text-cream-100/85">
            <li>GI-tagged authenticity</li>
            <li>Artisan story on every piece</li>
            <li>70–80% to the maker</li>
            <li>Plastic-free packaging</li>
            <li>Easy returns on unused goods</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold-400/20 py-5 text-center text-xs tracking-[0.2em] uppercase text-gold-200/80">
        © {new Date().getFullYear()} INDIVA · Essence of Every State
      </div>
    </footer>
  );
}
