import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toast";
import { metaImage, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
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
      <head>
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TCSK5L5R');`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TCSK5L5R"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
