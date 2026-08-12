import { ArrowRight, FileText, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type LibraryEmptyStateProps = {
  type: "courses" | "pdfs";
};

export function LibraryEmptyState({ type }: LibraryEmptyStateProps) {
  if (type === "pdfs") {
    return (
      <div className="library-empty-state pdf-empty-state">
        <div className="empty-pdf-illustration">
          <FileText size={48} strokeWidth={1.15} />
          <Leaf size={27} strokeWidth={1.15} />
        </div>
        <div className="empty-state-copy">
          <h3>No PDF courses yet</h3>
          <p>
            Discover in-depth guides, workbooks,
            <br />
            and practice resources.
          </p>
          <Link href="#pdf-catalog">
            Browse PDF courses <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="library-empty-state course-empty-state">
      <Image
        className="course-empty-image"
        src="/images/course-empty-screen-img.png"
        alt="Yoga journey illustration"
        width={200}
        height={200}
      />
      <div className="empty-state-copy">
        <h3>Your yoga journey starts here</h3>
        <p>
          You haven&apos;t purchased a course yet. Explore our
          <br />
          guided practices and find the right place to begin.
        </p>
        <Link href="#course-catalog">
          Explore courses <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
