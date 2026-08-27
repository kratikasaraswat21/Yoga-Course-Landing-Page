import courseEmptyScreen from "@/assets/images/course-empty-screen-img.webp";
import { ArrowRight, FileText, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type LibraryEmptyStateProps = {
  type: "courses" | "pdfs" | "products";
  title?: string;
  description?: ReactNode;
  showButton?: boolean;
  showBorder?: boolean;
  buttonHref?: string;
  buttonLabel?: string;
};

export function LibraryEmptyState({
  type,
  title,
  description,
  showButton = true,
  showBorder = true,
  buttonHref = "#course-catalog",
  buttonLabel = "Explore courses",
}: LibraryEmptyStateProps) {
  if (type === "pdfs") {
    return (
      <div className={`library-empty-state pdf-empty-state${showBorder ? "" : " library-empty-state-no-border"}`}>
        <div className="empty-pdf-illustration">
          <FileText size={48} strokeWidth={1.15} />
          <Leaf size={27} strokeWidth={1.15} />
        </div>
        <div className="empty-state-copy">
          <h3>{title ?? "No PDF courses yet"}</h3>
          <p>
            {description ?? (
              <>
                Discover in-depth guides, workbooks,
                <br />
                and practice resources.
              </>
            )}
          </p>
          {showButton && (
            <Link href="#pdf-catalog">
              Browse PDF courses <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`library-empty-state course-empty-state${showBorder ? "" : " library-empty-state-no-border"}`}>
      <Image
        className="course-empty-image"
        src={courseEmptyScreen}
        alt={type === "products" ? "Yoga essentials illustration" : "Yoga journey illustration"}
        width={200}
        height={200}
      />
      <div className="empty-state-copy">
          <h3>{title ?? (type === "products" ? "No recommendations yet" : "Your yoga journey starts here")}</h3>
          <p>
            {description ?? (
              type === "products" ? "New yoga essentials and recommendations will appear here soon." : (
                <>
                  You haven&apos;t purchased a course yet. Explore our
                  <br />
                  guided practices and find the right place to begin.
                </>
              )
            )}
          </p>
          {showButton && (
            <Link href={type === "products" ? "/affiliate-products" : buttonHref}>
              {type === "products" ? "Browse products" : buttonLabel} <ArrowRight size={15} />
            </Link>
          )}
      </div>
    </div>
  );
}
