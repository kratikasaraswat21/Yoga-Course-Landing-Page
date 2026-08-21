import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { loginYoga } from "@/assets/image-assets";
import Image from "next/image";
import Link from "next/link";

export type Course = {
  id: string;
  title: string;
  description: string;
  lessons: string;
  completed: string;
  progress: number;
  href: string;
  imageUrl?: string;
  imagePosition?: string;
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="course-card">
      <div className="course-image-wrap">
        <Image
          src={course.imageUrl || loginYoga}
          alt="Yoga practice in warm natural light"
          fill
          sizes="(max-width: 700px) 100vw, 340px"
          className="course-image"
          style={{ objectPosition: course.imagePosition ?? "center" }}
        />
        <span className="purchased-badge">{course.progress >= 100 ? "Completed" : "Purchased"}</span>
      </div>
      <div className="course-card-body">
        <h3 className="title-case">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        <div className="progress-meta">
          <span>{course.progress}%</span>
          <span>
            {course.completed} of {course.lessons} lessons
          </span>
        </div>
        <div className="progress-track">
          <span style={{ width: `${course.progress}%` }} />
        </div>
        <Link className="primary-action" href={course.href}>
          Continue course
        </Link>
      </div>
    </article>
  );
}

export function PdfCard({
  title,
  kind,
  pages,
  tone,
  href,
  imageUrl,
}: {
  title: string;
  kind: string;
  pages: string;
  tone: "clay" | "sage";
  href: string;
  imageUrl?: string;
}) {
  return (
    <article className="pdf-card">
      <div className={`pdf-cover ${tone}`}>
        {imageUrl ? <Image src={imageUrl} alt={`${title} cover`} fill sizes="112px" className="pdf-cover-image" /> : <><span>{title}</span><small>{kind}</small></>}
      </div>
      <div className="pdf-details">
        <h3>{title}</h3>
        <span className="soft-badge">{kind}</span>
        <p>{pages}</p>
        <Link className="primary-action" href={href}>
          Open PDF
        </Link>
        <div className="pdf-purchased">
          <BookOpen size={17} /> Purchased
        </div>
      </div>
    </article>
  );
}

export function ProductCard({
  title,
  imagePosition = "center",
  imageUrl,
  href,
  description,
  buttonTitle = "View product",
}: {
  title: string;
  imagePosition?: string;
  imageUrl?: string;
  href?: string;
  description?: string;
  buttonTitle?: string;
}) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Image
          src={imageUrl || loginYoga}
          alt={title}
          fill
          sizes="300px"
          className="product-image"
          style={{ objectPosition: imagePosition }}
        />
        <span className="affiliate-badge">Affiliate</span>
      </div>
      <div className="product-info">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        {href && (
          <Link className="product-action" href={href} target="_blank" rel="noreferrer">
            {buttonTitle} <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </article>
  );
}

export function ExploreRow({
  title,
  lessons,
  basePrice,
  discount,
  price,
  imagePosition,
  imageUrl,
  href,
}: {
  title: string;
  lessons: string;
  basePrice: string;
  discount: string;
  price: string;
  imagePosition?: string;
  imageUrl?: string;
  href: string;
}) {
  return (
    <article className="explore-row">
      <div className="explore-image">
        <Image
          src={imageUrl || loginYoga}
          alt={`${title} course`}
          fill
          sizes="220px"
          className="course-image"
          style={{ objectPosition: imagePosition ?? "center" }}
        />
      </div>
      <div className="explore-copy">
        <h3>{title}</h3>
        <span>{lessons} lessons</span>
        <div className="explore-pricing">
          {basePrice && <del>{basePrice}</del>}
          {discount && <em>{discount} off</em>}
          <strong>{price}</strong>
        </div>
        <Link href={href}>
          View course <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

export function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="stat">
      <span className="stat-icon">{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </div>
  );
}

export const completedIcon = <CheckCircle2 size={19} strokeWidth={1.5} />;
