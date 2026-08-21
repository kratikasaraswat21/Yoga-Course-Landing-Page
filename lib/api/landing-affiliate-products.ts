import { EnvConfig } from "@/lib/config/envConfig";
import type { LandingAffiliateProduct, LandingAffiliateProductsResponse } from "@/types/landing-affiliate-product";

const AFFILIATE_PRODUCTS_URL = EnvConfig.API_BASE_URL.endsWith("/app/api/v1")
  ? `${EnvConfig.API_BASE_URL}/affiliate-products`
  : `${EnvConfig.API_BASE_URL}/app/api/v1/affiliate-products`;

const fallbackProduct = (product: Partial<LandingAffiliateProduct>): LandingAffiliateProduct => ({
  id: product.id ?? "",
  title: product.title ?? "Recommended product",
  description: product.description ?? "No description available",
  productsLink: product.productsLink ?? "",
  buttonTitle: product.buttonTitle ?? "View product",
  thumbnailUrl: product.thumbnailUrl ?? "",
  sortOrder: Number.isFinite(product.sortOrder) ? Number(product.sortOrder) : 0,
});

export async function getLandingAffiliateProducts(): Promise<{
  products: LandingAffiliateProduct[];
  error?: string;
}> {
  if (!EnvConfig.API_BASE_URL) return { products: [], error: "Affiliate product service is not configured." };

  try {
    const response = await fetch(AFFILIATE_PRODUCTS_URL, { next: { revalidate: 600 } });
    if (!response.ok) return { products: [], error: `Unable to load affiliate products (${response.status}).` };

    const payload = (await response.json()) as LandingAffiliateProductsResponse;
    if (!payload.success) return { products: [], error: "Unable to load affiliate products right now." };

    return { products: (payload.data?.products ?? []).map(fallbackProduct) };
  } catch {
    return { products: [], error: "Unable to connect to the affiliate product service." };
  }
}
