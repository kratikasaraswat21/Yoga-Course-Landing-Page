export interface AffiliateProduct {
  id: string;
  title: string;
  description: string;
  productsLink: string;
  buttonTitle: string;
  thumbnailUrl: string;
  sortOrder: number;
  createdAt: string;
}

export interface AffiliateProductsResponse {
  success: boolean;
  message: string;
  data?: { products?: AffiliateProduct[] };
}
