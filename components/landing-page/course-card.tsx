"use client";

import courseFallback from "@/assets/images/landing/course/course-main.png";
import { ArrowRight, Check, Clock3, Share2, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CourseRatingStars } from "@/components/landing-page/course-rating-stars";
import { getCheckoutHref, getLandingCourseHref, isPrelaunchPriceActive, type LandingCourse } from "@/types/landing-course";

const formatRupees = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/**
 * Red diagonal "50% off" ribbon across the top-left corner of a card image (the image needs
 * `position: relative; overflow: hidden`). With `label`, a small first line such as "Prelaunch".
 */
export function DiscountRibbon({ discount, label }: { discount: number; label?: string }) {
  if (!(discount > 0)) return null;

  return (
    <span className="discount-ribbon">
      <span>
        {label && <small>{label}</small>}
        {discount}% off
      </span>
    </span>
  );
}

/** Course card used on the home page carousel and on /courses. */
export function CourseCard({ course }: { course: LandingCourse }) {
  const [isCopied, setIsCopied] = useState(false);
  const thumbnail = course.thumbnail || courseFallback.src;

  const copyCourseLink = async () => {
    try {
      const coursePath = course.landingPageEnabled && course.slug ? `/courses/${course.slug}` : "/#course-library";
      await navigator.clipboard.writeText(`${window.location.origin}${coursePath}`);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <article className="home-course-card">
      <div className="home-course-card-media">
        <DiscountRibbon discount={course.discount} label={isPrelaunchPriceActive(course) ? "Prelaunch" : undefined} />
        <Image
          src={thumbnail}
          alt={`${course.title} course thumbnail`}
          width={1280}
          height={720}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 32vw"
        />
        <div className="home-course-card-meta">
          <span>
            <Video size={17} aria-hidden="true" />
            {plural(course.totalVideos, "video")}
          </span>
          <span>
            <Clock3 size={17} aria-hidden="true" />
            {course.totalHours} hours
          </span>
        </div>
      </div>

      <div className="home-course-card-body">
        <h3 className="line-clamp-2 capitalize">{course.title}</h3>
        <div
          className="home-course-card-description rich-text-description line-clamp-2"
          dangerouslySetInnerHTML={{ __html: course.description }}
        />
        <div className="home-course-card-rating">
          <b>{course.rating.toFixed(1)}</b>
          <CourseRatingStars rating={course.rating} />
          <small>· {plural(course.totalStudents, "student")}</small>
        </div>
        <div className="home-course-card-price">
          <div className="home-course-card-offer">
            {course.discount > 0 && <del>{formatRupees(course.price)}</del>}
          </div>
          <strong>{formatRupees(course.discount > 0 ? course.totalPayableAmount : course.price)}</strong>
        </div>
        <div className="home-course-card-actions">
          <div className="home-course-card-buttons">
            <Link className="home-course-card-button home-course-card-button-outline" href={getLandingCourseHref(course)}>
              View course
            </Link>
            <Link className="home-course-card-button" href={getCheckoutHref(course.courseId)}>
              Buy course <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <button
            type="button"
            className="home-course-card-share"
            aria-label={isCopied ? "Course link copied" : "Copy course link"}
            title={isCopied ? "Link copied" : "Copy course link"}
            onClick={copyCourseLink}>
            {isCopied ? <Check size={18} /> : <Share2 size={18} />}
          </button>
        </div>
      </div>
    </article>
  );
}
