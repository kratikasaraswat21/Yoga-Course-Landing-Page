"use client";

import type { Course, CourseVideo } from "@/types/course";
import { StarRating } from "@/components/course/star-rating";
import { formatDuration, formatVideoDuration } from "@/lib/utils";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import { toast } from "@/components/ui/toast";
import { Award, CheckCircle2, Clock3, Infinity, Lock, Play, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const fallbackImage = "/images/auth/login-yoga.png";

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
        <h1 className="title-case">{course.title}</h1>
        <p>{course.description}</p>
        <div className="detail-price">
          {course.discount > 0 && (
            <>
              <del>₹{course.totalPayableAmount.toLocaleString("en-IN")}</del>
              <span className="discount">{course.discount}% off</span>
            </>
          )}
          <strong>₹{course.price.toLocaleString("en-IN")}</strong>
        </div>
        <small className="payment-copy">One-time payment · Lifetime access</small>
        <div className="detail-stats">
          <span><Play size={18} /> {course.videoCount} lessons</span>
          <span><Clock3 size={18} /> {formatDuration(totalSeconds)} total</span>
          <span><Infinity size={20} /> Lifetime access</span>
        </div>
        {!course.isPurchased && paymentStatus !== "confirming" && (
          <button className="detail-primary" disabled={paymentStatus !== "idle"} onClick={onBuyCourse}>
            {paymentStatus === "opening" ? "Processing..." : "Buy course"}
          </button>
        )}
        <div className="secure-payment">
          <ShieldCheck size={16} /> Secure payment via Razorpay
        </div>
      </div>
    </section>
  );
}

export function CourseVideoCard({ video, courseId, isPurchased }: { video: CourseVideo; courseId: string; isPurchased: boolean }) {
  const card = (
    <article className={`course-video-card${isPurchased ? "" : " course-video-card-locked"}`}>
      <div className="video-thumbnail">
        <Image
          src={video.thumbnailUrl || fallbackImage}
          alt={video.title}
          fill
          sizes="(max-width: 700px) 100vw, 25vw"
          className="aspect-video"
        />

        {isPurchased ? (
          <span className="video-play">
            <Play size={20} fill="currentColor" />
          </span>
        ) : (
          <span className="video-lock" title="Purchase this course to watch">
            <Lock size={15} />
          </span>
        )}
        <b>{formatVideoDuration(video.durationSeconds)}</b>
      </div>
      <div className="video-copy">
        <small>Lesson {video.sortOrder}</small>
        <h3 className="title-case">{video.title}</h3>
        <p>{video.description}</p>
      </div>
    </article>
  );

  return isPurchased ? (
    <Link href={`/course/enrolled/${courseId}/videos/${video.id}`} className="course-video-card-link">
      {card}
    </Link>
  ) : card;
}

export function CourseVideoSection({ course }: { course: Course }) {
  return (
    <section className="course-video-section">
      <div className="course-section-heading">
        <div>
          <h2>Course videos</h2>
          <p>{course.videoCount} guided video lessons</p>
        </div>
      </div>
      <div className="course-video-grid">
        {course.courseVideos.map((video) => (
          <CourseVideoCard key={video.id} video={video} courseId={course.id} isPurchased={course.isPurchased} />
        ))}
      </div>
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

  if (course.isCourseCompleted !== true) return null;

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
    toast.add({ title: "Thank you for your review", description: "Your course feedback has been saved.", type: "success" });
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
              <p>{averageRating > 0 ? `${averageRating.toFixed(1)} average rating · ${totalReviews} reviews` : "No reviews yet"}</p>
            </div>
          </div>
          <div className="course-review-rating"><StarRating value={rating} onChange={setRating} label="Choose a course rating" />{rating > 0 && <span>{rating}/5</span>}</div>
          <label className="course-review-label" htmlFor="course-review-comment">Your review <span>(optional)</span></label>
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
