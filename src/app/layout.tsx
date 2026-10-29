import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INDIVA — One India. One Store. One Experience.",
  description:
    "Luxury marketplace curating authentic crafts, textiles, gourmet foods and wellness from all 29 Indian states. Direct from 10,000+ artisans.",
  applicationName: "INDIVA",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "INDIVA", statusBarStyle: "black-translucent" },
  icons: { icon: "/icons/icon-192.svg", apple: "/icons/icon-192.svg" },
};

export const viewport: Viewport = {
  themeColor: "#6b2c1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="mandala-bg antialiased">{children}</body>
    </html>
  );
}
