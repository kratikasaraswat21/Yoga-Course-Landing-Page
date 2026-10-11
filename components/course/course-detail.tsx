"use client";

import loginYoga from "@/assets/images/auth/login-yoga.webp";
import { StarRating } from "@/components/course/star-rating";
import { toast } from "@/components/ui/toast";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import { formatDuration, formatVideoDuration } from "@/lib/utils";
import type { Course, CourseVideo } from "@/types/course";
import { useNow } from "@/hooks/useNow";
import { formatCountdown, getCurrentPricing } from "@/lib/helper/course-pricing";
import { formatScheduleDate } from "@/lib/helper/schedule-date";
import {
  ArrowRight,
  Award,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Infinity,
  ListOrdered,
  Lock,
  Play,
  Share2,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const fallbackImage = loginYoga;

export function CourseDetailHero({
  course,
  paymentStatus = "idle",
  onBuyCourse,
}: {
  course: Course;
  paymentStatus?: "idle" | "opening" | "confirming";
  onBuyCourse?: () => void;
}) {
  const totalSeconds = course.courseVideos.reduce((total, video) => total + video.durationSeconds, 0);
  const [isCopied, setIsCopied] = useState(false);
  const now = useNow();
  // Re-check the offer in the browser so the price switches at midnight without a reload.
  const pricing = course.pricing && now !== null ? getCurrentPricing(course.pricing, now) : course.pricing;
  const price = pricing?.price ?? course.price;
  const discount = pricing?.discountPercent ?? course.discount;
  const payableAmount = pricing?.payableAmount ?? course.totalPayableAmount;
  const prelaunch = pricing?.offerType === "PRELAUNCH" ? pricing.prelaunch : null;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast.add({ title: "Course link copied", description: "You can share it with anyone.", type: "success" });
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.add({ title: "Could not copy link", description: "Please copy the URL from your browser.", type: "error" });
    }
  };

  return (
    <section className="course-detail-hero">
      <div className="detail-cover">
        <Image
          src={course.thumbnailUrl || fallbackImage}
          alt={course.title}
          fill
          sizes="(max-width: 900px) 100vw, 55vw"
        />
      </div>
      <div className="detail-summary">
        <div className="detail-title-row">
          <h1 className="title-case">{course.title}</h1>
          <button
            type="button"
            className="course-share-button"
            aria-label={isCopied ? "Course link copied" : "Copy course link"}
            title={isCopied ? "Copied" : "Copy course link"}
            onClick={() => void handleShare()}>
            <Share2 size={18} />
          </button>
        </div>
        {!course.isPurchased && prelaunch && <span className="course-card-prelaunch-chip">Prelaunch price</span>}
        <div className="detail-price">
          {discount > 0 && (
            <>
              <del className="font-montserrat">₹{price.toLocaleString("en-IN")}</del>
              <span className="discount">{discount}% off</span>
            </>
          )}
          <strong className="font-montserrat">₹{(discount > 0 ? payableAmount : price).toLocaleString("en-IN")}</strong>
        </div>
        <small className="payment-copy">
          One-time payment · Lifetime access
          {!course.isPurchased && prelaunch && now !== null
            ? ` · Prelaunch offer ends in ${formatCountdown(Date.parse(prelaunch.endsAt) - now)}`
            : ""}
        </small>
        {course.isPurchased && course.upcomingReleaseDate && (
          <p className="course-release-notice">
            <CalendarClock size={17} aria-hidden="true" />
            {course.courseVideos.some((video) => !video.isLocked)
              ? `New lessons unlock on their release dates. Next one: ${formatScheduleDate(course.upcomingReleaseDate, true)}.`
              : `Your course unlocks on ${formatScheduleDate(course.upcomingReleaseDate, true)}.`}
          </p>
        )}
        <div className="detail-stats">
          <span>
            <Play size={18} /> {course.videoCount} lessons
          </span>
          <span>
            <Clock3 size={18} /> {formatDuration(totalSeconds)} total
          </span>
          <span>
            <Infinity size={20} /> Lifetime access
          </span>
        </div>
        {course.isAccessRevoked ? (
          <div className="course-access-revoked" role="alert">
            <Lock size={18} aria-hidden="true" />
            You no longer have access to this course.
          </div>
        ) : (
          !course.isPurchased &&
          paymentStatus !== "confirming" && (
            <button className="detail-primary" disabled={paymentStatus !== "idle"} onClick={onBuyCourse}>
              {paymentStatus === "opening" ? "Processing..." : "Buy course"}
            </button>
          )
        )}
        {!course.isAccessRevoked && (
          <div className="secure-payment">
            <ShieldCheck size={16} /> Secure payment via Razorpay
          </div>
        )}
      </div>
    </section>
  );
}

export function CourseAboutSection({ course }: { course: Course }) {
  return (
    <section className="course-about-section" aria-labelledby="course-about-title">
      <h2 id="course-about-title">About this course</h2>
      <div className="rich-text-description" dangerouslySetInnerHTML={{ __html: course.description }} />
    </section>
  );
}

export function CourseVideoCard({
  video,
  courseId,
  isPurchased,
  isAccessRevoked = false,
  isNext = false,
}: {
  video: CourseVideo;
  courseId: string;
  isPurchased: boolean;
  isAccessRevoked?: boolean;
  /** The buyer's next video when the course locks videos in order. */
  isNext?: boolean;
}) {
  // Locked until the previous video is completed (courses that lock videos in order).
  const isSequentiallyLocked = video.isLocked === true && video.lockReason === "SEQUENTIAL";
  // A video with a future release date stays locked even for buyers until its day.
  const isScheduled = video.isLocked === true && !isSequentiallyLocked;
  const canAccessVideo = isPurchased && !isAccessRevoked && video.isLocked !== true;
  const lockTitle = isAccessRevoked
    ? "Access to this course has been revoked"
    : isSequentiallyLocked
      ? "Complete the previous video to unlock"
      : isScheduled
        ? `Available on ${formatScheduleDate(video.releaseDate, true)}`
        : "Purchase this course to watch";
  const card = (
    <article
      className={`course-video-card${canAccessVideo ? "" : " course-video-card-locked"}${isAccessRevoked ? " course-video-card-revoked" : ""}`}>
      <div className="video-thumbnail">
        <Image
          src={video.thumbnailUrl || fallbackImage}
          alt={video.title}
          fill
          sizes="(max-width: 700px) 100vw, 25vw"
          className="aspect-video"
        />

        {canAccessVideo ? (
          <span className="video-play">
            <Play size={20} fill="currentColor" />
          </span>
        ) : (
          <span className="video-lock" title={lockTitle}>
            <Lock size={15} />
          </span>
        )}
        <b>{formatVideoDuration(video.durationSeconds)}</b>
      </div>
      <div className="video-copy">
        <small>
          Lesson {video.sortOrder}
          {isScheduled && video.releaseDate && (
            <span className="video-release-badge">
              {isPurchased ? "Available on" : "Coming"} {formatScheduleDate(video.releaseDate)}
            </span>
          )}
          {isSequentiallyLocked && !isAccessRevoked && (
            <span className="video-release-badge video-order-badge">
              <Lock size={11} aria-hidden="true" /> Complete the previous video to unlock
            </span>
          )}
          {isNext && canAccessVideo && <span className="video-next-badge">Up next</span>}
        </small>
        <h3 className="title-case">{video.title}</h3>
        <div className="rich-text-description line-clamp-4!" dangerouslySetInnerHTML={{ __html: video.description }} />
      </div>
    </article>
  );

  return canAccessVideo ? (
    <Link href={`/course/enrolled/${courseId}/videos/${video.id}`} className="course-video-card-link">
      {card}
    </Link>
  ) : (
    card
  );
}

export function CourseVideoSection({ course }: { course: Course }) {
  const groups = course.groups ?? [];
  // The buyer's next video: from the API when the course locks videos in order, else the first unfinished one.
  const nextVideo =
    course.courseVideos.find((video) => video.id === course.nextVideoId) ??
    course.courseVideos.find((video) => !video.isLocked && !video.isCompleted);
  const showsOrder = course.isPurchased && !course.isAccessRevoked && course.sequentialUnlock === true;
  const renderCards = (videos: CourseVideo[]) => (
    <div className="course-video-grid">
      {videos.map((video) => (
        <CourseVideoCard
          key={video.id}
          video={video}
          courseId={course.id}
          isPurchased={course.isPurchased}
          isAccessRevoked={course.isAccessRevoked}
          isNext={showsOrder && video.id === nextVideo?.id}
        />
      ))}
    </div>
  );

  // The week with the buyer's next unfinished video opens by default (the first week otherwise).
  const openGroupIndex = Math.max(
    0,
    groups.findIndex((group) => group.videos.some((video) => video.id === nextVideo?.id)),
  );

  return (
    <section className="course-video-section">
      <div className="course-section-heading">
        <div>
          <h2>Course videos</h2>
          <p>
            {course.videoCount} guided video lessons
            {groups.length > 0 ? ` · ${groups.length} ${groups.length === 1 ? "section" : "sections"}` : ""}
          </p>
          {showsOrder && (
            <p className="course-order-note">
              <ListOrdered size={16} aria-hidden="true" /> Videos unlock in order: complete each one to open the next.
            </p>
          )}
        </div>
        {showsOrder && nextVideo && (
          <Link className="course-continue-link" href={`/course/enrolled/${course.id}/videos/${nextVideo.id}`}>
            Continue: Lesson {nextVideo.sortOrder} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
      {groups.length === 0
        ? renderCards(course.courseVideos)
        : groups.map((group, index) => {
            const completed = group.videos.filter((video) => video.isCompleted).length;
            return (
              <details className="course-video-group" key={group.id ?? "other"} open={index === openGroupIndex}>
                <summary>
                  <span>
                    <strong>{group.title}</strong>
                    <small>
                      {group.videoCount} {group.videoCount === 1 ? "video" : "videos"}
                      {group.totalDurationSeconds > 0 ? ` · ${formatDuration(group.totalDurationSeconds)}` : ""}
                      {course.isPurchased ? ` · ${completed} of ${group.videoCount} completed` : ""}
                    </small>
                  </span>
                </summary>
                {group.description && <p className="course-video-group-description">{group.description}</p>}
                {renderCards(group.videos)}
              </details>
            );
          })}
    </section>
  );
}

export function CourseCompletionSection({ course }: { course: Course }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(course.hasReviewed === true);
  const averageRating = course.averageRating ?? 0;
  const totalReviews = course.totalReviews ?? course.reviewCount ?? 0;

  if (course.isCourseCompleted !== true || course.isAccessRevoked) return null;

  const submitReview = async () => {
    if (!rating || isSubmitting) return;

    setIsSubmitting(true);
    const response = await multipleApiHandler([
      {
        endPoint: `/courses/${course.id}/review`,
        method: "POST",
        protected: true,
        data: { rating, comment: review.trim() },
      },
    ]);
    setIsSubmitting(false);

    if (!response[0]?.data?.success) {
      toast.add({
        title: "Review could not be submitted",
        description: response[0]?.data?.message ?? "Please try again later.",
        type: "error",
      });
      return;
    }

    setIsSubmitted(true);
    toast.add({
      title: "Thank you for your review",
      description: "Your course feedback has been saved.",
      type: "success",
    });
  };

  return (
    <section className="course-completion-section" aria-labelledby="course-completion-title">
      <div className="course-completion-summary">
        <div className="course-completion-icon" aria-hidden="true">
          <Award size={25} />
        </div>
        <div className="course-completion-copy">
          <div className="course-completion-eyebrow">
            <CheckCircle2 size={15} /> Course complete
          </div>
          <h2 id="course-completion-title">You completed this course</h2>
          <p>Beautiful work. You finished all {course.videoCount} lessons in this practice.</p>
        </div>
        <div className="course-completion-badge">Completed</div>
      </div>
      {!isSubmitted ? (
        <div className="course-review-form">
          <div className="course-review-heading">
            <h3>Rate this course</h3>
            <div className="course-review-average">
              {averageRating > 0 && <StarRating value={averageRating} readOnly label="Course average rating" />}
              <p>
                {averageRating > 0
                  ? `${averageRating.toFixed(1)} average rating · ${totalReviews} reviews`
                  : "No reviews yet"}
              </p>
            </div>
          </div>
          <div className="course-review-rating">
            <StarRating value={rating} onChange={setRating} label="Choose a course rating" />
            {rating > 0 && <span>{rating}/5</span>}
          </div>
          <label className="course-review-label" htmlFor="course-review-comment">
            Your review <span>(optional)</span>
          </label>
          <textarea
            id="course-review-comment"
            value={review}
            onChange={(event) => setReview(event.target.value)}
            placeholder="Write your review here..."
            maxLength={1000}
            aria-label="Course review"
          />
          <div className="course-review-footer">
            <small>{review.length}/1000</small>
            <button
              type="button"
              className="detail-primary course-review-submit"
              disabled={!rating || isSubmitting}
              onClick={() => void submitReview()}>
              {isSubmitting ? "Submitting..." : "Submit review"}
            </button>
          </div>
        </div>
      ) : (
        <div className="course-review-success">
          <CheckCircle2 size={19} />
          {course.hasReviewed ? "You have already reviewed this course." : "Thanks for sharing your experience."}
        </div>
      )}
    </section>
  );
}
