import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-10 bg-[#232f3e] text-gray-200 text-sm">
      <a href="#top" className="block text-center py-3 bg-[#37475a] hover:bg-[#485769] text-white text-sm">
        Back to top
      </a>
      <div className="max-w-[1500px] mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <Logo light />
          <p className="mt-3 text-[#febd69] italic">One India. One Store. One Experience.</p>
          <p className="mt-2 text-gray-400">Authentic crafts from every Indian state. GI tagged. Plastic-free packing.</p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-3">Shop</h4>
          <ul className="space-y-1">
            <li><Link href="/shop?category=fashion">Fashion & Textiles</Link></li>
            <li><Link href="/shop?category=decor">Home & Décor</Link></li>
            <li><Link href="/shop?category=gourmet">Gourmet</Link></li>
            <li><Link href="/shop?category=wellness">Wellness</Link></li>
            <li><Link href="/shop?category=lifestyle">Jewelry</Link></li>
            <li><Link href="/states">Shop by State</Link></li>
            <li><Link href="/hampers">Gift hampers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-3">Help</h4>
          <ul className="space-y-1">
            <li><Link href="/tracking">Track a parcel</Link></li>
            <li><Link href="/orders">Your orders</Link></li>
            <li><Link href="/account">Your account</Link></li>
            <li><Link href="/about">Our story</Link></li>
            <li><Link href="/impact">Sustainability</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-3">Trust</h4>
          <ul className="space-y-1 text-gray-300">
            <li>GI-tagged authenticity</li>
            <li>Artisan story on every piece</li>
            <li>70–80% to the maker</li>
            <li>Plastic-free packaging</li>
            <li>Easy returns on unused goods</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} INDIVA
      </div>
    </footer>
  );
}
