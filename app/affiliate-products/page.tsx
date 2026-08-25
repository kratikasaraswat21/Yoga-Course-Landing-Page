import { AffiliateProductListing } from "@/components/landing-page/affiliate-product-listing";
import { Footer } from "@/components/landing-page/footer";
import { Navbar } from "@/components/landing-page/navbar";
import { getLandingAffiliateProducts } from "@/lib/api/landing-affiliate-products";

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
