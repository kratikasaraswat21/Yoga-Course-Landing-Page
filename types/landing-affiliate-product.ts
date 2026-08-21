export interface LandingAffiliateProduct {
  id: string;
  title: string;
  description: string;
  productsLink: string;
  buttonTitle: string;
  thumbnailUrl: string;
  sortOrder: number;
}

export interface LandingAffiliateProductsResponse {
  success: boolean;
  data?: { products?: LandingAffiliateProduct[] };
}
