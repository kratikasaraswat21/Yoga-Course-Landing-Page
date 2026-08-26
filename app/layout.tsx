import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toast";
import { metaImage } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Kratika Yoga | Come back to yourself",
    template: "%s | Kratika Yoga",
  },
  description: "Thoughtful yoga practices designed to help you move better, breathe deeper, and reconnect with yourself.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Kratika Yoga",
    title: "Kratika Yoga | Come back to yourself",
    description: "Thoughtful yoga practices designed to help you move better, breathe deeper, and reconnect with yourself.",
    images: [{ url: metaImage, width: 1201, height: 600, alt: "Kratika Yoga" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kratika Yoga | Come back to yourself",
    description: "Thoughtful yoga practices designed to help you move better, breathe deeper, and reconnect with yourself.",
    images: [metaImage],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
