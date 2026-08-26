import { AffiliateProductListing } from "@/components/landing-page/affiliate-product-listing";
import { Footer } from "@/components/landing-page/footer";
import { Navbar } from "@/components/landing-page/navbar";
import { getLandingAffiliateProducts } from "@/lib/api/landing-affiliate-products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yoga essentials and recommendations",
  description: "Discover thoughtfully selected yoga essentials and wellness products recommended by Kratika Yoga.",
};

export const revalidate = 600;

export default async function AffiliateProductsPage() {
  const { products, error } = await getLandingAffiliateProducts();

  return (
    <div className="landing-page">
      <Navbar />
      <AffiliateProductListing products={products} error={error} />
      <Footer />
    </div>
  );
}
