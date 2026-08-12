import type { Course, CourseVideo } from "@/types/course";
import { Clock3, Infinity, Play, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fallbackImage = "/images/auth/login-yoga.png";

export function CourseDetailHero({ course }: { course: Course }) {
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
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <div className="detail-price">
          <del>₹{course.totalPayableAmount.toLocaleString("en-IN")}</del>
          <span className="discount">{course.discount}% off</span>
          <strong>₹{course.price.toLocaleString("en-IN")}</strong>
        </div>
        <small className="payment-copy">One-time payment · Lifetime access</small>
        <div className="detail-stats">
          <span><Play size={18} /> {course.videoCount} lessons</span>
          <span><Clock3 size={18} /> {formatDuration(totalSeconds)} total</span>
          <span><Infinity size={20} /> Lifetime access</span>
        </div>
        <button className="detail-primary">Buy course</button>
        <div className="secure-payment">
          <ShieldCheck size={16} /> Secure payment via Razorpay
        </div>
      </div>
    </section>
  );
}

export function CourseVideoCard({ video, courseId }: { video: CourseVideo; courseId: string }) {
  return (
    <Link href={`/my-courses/${courseId}/videos/${video.id}`} className="course-video-card-link"><article className="course-video-card">
      <div className="video-thumbnail">
        <Image
          src={video.thumbnailUrl || fallbackImage}
          alt={video.title}
          fill
          sizes="(max-width: 700px) 100vw, 25vw"
          className="aspect-video"
        />

        <span className="video-play">
          <Play size={20} fill="currentColor" />
        </span>
        <b>{formatVideoDuration(video.durationSeconds)}</b>
      </div>
      <div className="video-copy">
        <small>Lesson {video.sortOrder}</small>
        <h3>{video.title}</h3>
        <p>{video.description}</p>
      </div>
    </article></Link>
  );
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
          <CourseVideoCard key={video.id} video={video} courseId={course.id} />
        ))}
      </div>
    </section>
  );
}

function formatVideoDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}
