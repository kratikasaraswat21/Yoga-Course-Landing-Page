"use client";

import { toast } from "@/components/ui/toast";
import { VideoPlaybackSkeleton } from "@/components/course/course-skeletons";
import { useDebounce } from "@/hooks/useDebounce";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import type { Course, VideoPlayback } from "@/types/course";
import Hls from "hls.js";
import { ChevronLeft, ChevronRight, CircleCheck, Play } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export default function VideoPlaybackPage() {
  const { courseId, videoId } = useParams<{ courseId: string; videoId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [video, setVideo] = useState<VideoPlayback | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const playerRef = useRef<HTMLVideoElement>(null);

  const loadPlayback = useDebounce(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await multipleApiHandler([
        { endPoint: `/courses/${courseId}/videos/${videoId}/others`, method: "GET" },
        { endPoint: `/courses/${courseId}/videos/${videoId}/playback`, method: "GET", protected: true },
      ]);
      const courseRes = response[0];
      const playbackRes = response[1];
      if (!courseRes?.data?.success) {
        const message = courseRes?.data?.message ?? "Course could not be loaded.";
        setError(message);
        toast.add({ title: "Course could not be loaded", description: message, type: "error" });
        return;
      }
      if (!playbackRes?.data?.success) {
        const message = playbackRes?.data?.message ?? "Video could not be loaded.";
        setError(message);
        toast.add({ title: "Video could not be loaded", description: message, type: "error" });
        return;
      }
      setCourse(courseRes.data.data.course);
      setVideo(playbackRes.data.data?.playback);
    } catch {
      const message = "Video could not be loaded. Please try again.";
      setError(message);
      toast.add({ title: "Video could not be loaded", description: message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    loadPlayback();
  }, [loadPlayback]);

  useEffect(() => {
    if (!video?.hlsUrl || !playerRef.current) return;
    const player = playerRef.current;
    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.attachMedia(player);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls?.loadSource(video.hlsUrl);
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          console.error("HLS playback error", data);
          toast.add({
            title: "Video playback failed",
            description: `${data.details}. The signed stream could not be played.`,
            type: "error",
          });
        }
      });
    } else if (player.canPlayType("application/vnd.apple.mpegurl")) {
      player.src = video.hlsUrl;
    } else {
      toast.add({
        title: "Playback not supported",
        description: "This browser does not support HLS video playback.",
        type: "error",
      });
    }

    return () => {
      hls?.destroy();
      player.removeAttribute("src");
      player.load();
    };
  }, [video]);

  const currentIndex = useMemo(
    () => course?.courseVideos.findIndex((item) => item.id === videoId) ?? -1,
    [course, videoId],
  );
  const previousVideo = currentIndex > 0 ? course?.courseVideos[currentIndex - 1] : undefined;
  const nextVideo = course && currentIndex >= 0 ? course.courseVideos[currentIndex + 1] : undefined;
  const currentVideoThumbnail = course?.courseVideos.find((item) => item.id === videoId)?.thumbnailUrl || course?.thumbnailUrl;

  const submitRating = () => {
    if (!rating) return;
    setIsRatingSubmitted(true);
    toast.add({ title: "Thank you for your feedback", description: `You rated this lesson ${rating} out of 5 stars.`, type: "success" });
  };

  if (isLoading) return <VideoPlaybackSkeleton />;
  if (error || !course || !video)
    return (
      <div className="courses-status courses-error">
        <p>{error || "Video not found."}</p>
        <button onClick={loadPlayback}>Try again</button>
      </div>
    );

  return (
    <div className="playback-page">
      <nav className="course-breadcrumb">
        <Link href="/my-courses">Courses</Link>
        <ChevronRight size={16} />
        <Link href={`/my-courses/${course.id}`}>{course.title}</Link>
        <ChevronRight size={16} />
        <span>{video.title}</span>
      </nav>
      <div className="playback-layout">
        <main className="playback-main">
          <div className="playback-player-wrap">
            <video
              ref={playerRef}
              className="playback-player"
              controls
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
              poster={currentVideoThumbnail}
              onEnded={() => {
                setShowEndPopup(true);
              }}>
              Your browser does not support video playback.
            </video>
          </div>
          <div className="playback-lesson-heading">
            <div>
              <small>
                Lesson {currentIndex + 1} of {course.videoCount}
              </small>
              <h1>{video.title}</h1>
              <p>{course.description}</p>
            </div>
          </div>
          <div className="playback-navigation">
            <Link
              className={!previousVideo ? "disabled" : ""}
              href={previousVideo ? `/my-courses/${course.id}/videos/${previousVideo.id}` : "#"}>
              <ChevronLeft size={17} /> Previous lesson
            </Link>
            <Link
              className={!nextVideo ? "disabled" : ""}
              href={nextVideo ? `/my-courses/${course.id}/videos/${nextVideo.id}` : "#"}>
              Next lesson <ChevronRight size={17} />
            </Link>
          </div>
        </main>
        <aside className="playback-sidebar">
          <h2>Course videos</h2>
          <p>
            {currentIndex + 1} of {course.videoCount} lessons
          </p>
          <div className="lesson-list">
            {course.courseVideos.map((item, index) => (
              <Link
                className={item.id === videoId ? "current" : ""}
                key={item.id}
                href={`/my-courses/${course.id}/videos/${item.id}`}>
                <span>{item.id === videoId ? <Play size={14} fill="currentColor" /> : <CircleCheck size={16} />}</span>
                <strong>{index + 1}.</strong>
                <b>{item.title}</b>
                <small>{formatDuration(item.durationSeconds)}</small>
              </Link>
            ))}
          </div>
        </aside>
      </div>
      {showEndPopup && (
        <div className="video-ended-overlay" role="dialog" aria-modal="true" aria-labelledby="video-ended-title">
          <div className="video-ended-popup">
            <CircleCheck size={42} />
            <h2 id="video-ended-title">Lesson complete</h2>
            <p>You finished “{video.title}”.</p>
            <div className="lesson-rating" aria-label="Rate this lesson">
              <span>How was this lesson?</span>
              <div className="rating-stars" aria-label={`Rating: ${rating || 0} out of 5`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span className="rating-star" key={star}>
                    <span className="rating-star-visual" style={{ background: `linear-gradient(90deg, #d97745 ${rating >= star ? "100%" : rating >= star - 0.5 ? "50%" : "0%"}, #d8d8d0 ${rating >= star ? "100%" : rating >= star - 0.5 ? "50%" : "0%"})` }}>★</span>
                    <button type="button" className="rating-half rating-half-left" aria-label={`${star - 0.5} stars`} aria-pressed={rating === star - 0.5} onClick={() => { setRating(star - 0.5); setIsRatingSubmitted(false); }} />
                    <button type="button" className="rating-half rating-half-right" aria-label={`${star} stars`} aria-pressed={rating === star} onClick={() => { setRating(star); setIsRatingSubmitted(false); }} />
                  </span>
                ))}
              </div>
              {rating > 0 && <small className="rating-value">{rating} / 5</small>}
            </div>
            <div className="video-ended-actions">
              {!isRatingSubmitted && <button className="detail-primary rating-submit" disabled={!rating} onClick={submitRating}>Submit response</button>}
            </div>
            <div className="video-ended-actions">
              <button className="detail-secondary" onClick={() => { setShowEndPopup(false); void playerRef.current?.play(); }}>Watch again</button>
              {nextVideo ? <Link className="detail-primary" href={`/my-courses/${course.id}/videos/${nextVideo.id}`}>Next lesson <ChevronRight size={17} /></Link> : <button className="detail-primary" onClick={() => setShowEndPopup(false)}>Back to course</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
