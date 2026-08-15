"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AffiliateProductsSkeleton } from "@/components/affiliate/affiliate-products-skeleton";
import { LibraryEmptyState } from "@/components/shared/library-empty-state";
import { toast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/useDebounce";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import type { AffiliateProduct, AffiliateProductsResponse } from "@/types/affiliate-product";

const fallbackImage = "/images/auth/login-yoga.png";

export default function AffiliateProductsPage() {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useDebounce(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await multipleApiHandler([{ endPoint: "/affiliate-products", method: "GET" }]);
      const result = response[0]?.data as AffiliateProductsResponse | undefined;
      if (!response[0]?.ok || !result?.success) throw new Error(result?.message ?? "Affiliate products could not be loaded.");
      setProducts((result.data?.products ?? []).sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Affiliate products could not be loaded.";
      setError(message);
      toast.add({ title: "Affiliate products could not be loaded", description: message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) return <AffiliateProductsSkeleton />;

  return (
    <div className="courses-page affiliate-products-page">
      <div className="courses-hero">
        <div>
          <span className="eyebrow">CURATED FOR YOUR PRACTICE</span>
          <h1>Affiliate products</h1>
          <p>Thoughtfully selected products to support your yoga journey.</p>
        </div>
        <div className="courses-hero-art"><ShoppingBag size={54} strokeWidth={1} /></div>
      </div>

      {error ? (
        <div className="courses-status courses-error"><p>{error}</p><button onClick={fetchProducts}>Try again</button></div>
      ) : products.length ? (
        <div className="product-grid affiliate-product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image-wrap">
                <Image src={product.thumbnailUrl || fallbackImage} alt={product.title} fill sizes="(max-width: 700px) 100vw, 33vw" className="product-image" />
                <span className="affiliate-badge">Affiliate</span>
              </div>
              <div className="product-info">
                <h3 className="title-case">{product.title}</h3>
                <p>{product.description}</p>
                <Link className="product-action" href={product.productsLink} target="_blank" rel="noreferrer">
                  {product.buttonTitle} <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <LibraryEmptyState type="courses" title="No affiliate products yet" description="New recommendations will appear here soon." showButton={false} showBorder={false} />
      )}
    </div>
  );
}
