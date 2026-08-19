"use client";

import { VideoPlaybackSkeleton } from "@/components/course/course-skeletons";
import { toast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/useDebounce";
import { multipleApiHandler } from "@/lib/api/multiple.api";
import { formatDuration, formatTime } from "@/lib/utils";
import type { Course, VideoPlayback } from "@/types/course";
import Hls from "hls.js";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";

export default function VideoPlaybackPage() {
  const { courseId, videoId } = useParams<{ courseId: string; videoId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [video, setVideo] = useState<VideoPlayback | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLVideoElement>(null);
  const playerWrapRef = useRef<HTMLDivElement>(null);
  const completionRequestRef = useRef(false);

  const loadPlayback = useDebounce(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await multipleApiHandler([
        { endPoint: `/courses/${courseId}/videos/${videoId}/others`, method: "GET", protected: true },
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

  const playbackUrl = video?.hlsUrl;

  useEffect(() => {
    if (!playbackUrl || !playerRef.current) return;
    const player = playerRef.current;
    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.attachMedia(player);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls?.loadSource(playbackUrl);
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
      player.src = playbackUrl;
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
  }, [playbackUrl]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const currentIndex = useMemo(
    () => course?.courseVideos.findIndex((item) => item.id === videoId) ?? -1,
    [course, videoId],
  );
  const previousVideo = currentIndex > 0 ? course?.courseVideos[currentIndex - 1] : undefined;
  const nextVideo = course && currentIndex >= 0 ? course.courseVideos[currentIndex + 1] : undefined;
  const currentVideoThumbnail =
    course?.courseVideos.find((item) => item.id === videoId)?.thumbnailUrl || course?.thumbnailUrl;

  const submitRating = async () => {
    if (!rating) return;

    setIsRatingSubmitting(true);
    const response = await multipleApiHandler([
      {
        endPoint: `/courses/${courseId}/videos/${videoId}/rating`,
        method: "POST",
        protected: true,
        data: { rating, review: "" },
      },
    ]);

    setIsRatingSubmitting(false);
    if (!response[0]?.data?.success) {
      toast.add({
        title: "Rating could not be submitted",
        description: response[0]?.data?.message ?? "Please try again later.",
        type: "error",
      });
      return;
    }

    setIsRatingSubmitted(true);
    toast.add({
      title: "Thank you for your feedback",
      description: `You rated this lesson ${rating} out of 5 stars.`,
      type: "success",
    });
  };

  const completeVideo = useDebounce(async () => {
    if (!video || video.isCompleted || completionRequestRef.current) return;

    completionRequestRef.current = true;
    const response = await multipleApiHandler([
      { endPoint: `/courses/${courseId}/videos/${videoId}/complete`, method: "POST", protected: true },
    ]);

    if (response[0]?.data?.success) {
      setVideo((currentVideo) => (currentVideo ? { ...currentVideo, isCompleted: true } : currentVideo));
      return;
    }

    completionRequestRef.current = false;
    toast.add({
      title: "Lesson completion could not be saved",
      description: response[0]?.data?.message ?? "Please try again later.",
      type: "error",
    });
  }, 100);

  const handleVideoEnded = () => {
    completeVideo();
    setIsPlaying(false);
    setShowEndPopup(video?.hasReviewed !== true);
  };

  const togglePlay = async () => {
    const player = playerRef.current;
    if (!player) return;

    if (player.paused) {
      await player.play();
    } else {
      player.pause();
    }
  };

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;

    player.muted = !player.muted;
    setIsMuted(player.muted);
  };

  const changeVolume = (value: number) => {
    const player = playerRef.current;
    if (!player) return;

    player.volume = value;
    player.muted = value === 0;
    setVolume(value);
    setIsMuted(player.muted);
  };

  console.log(video)

  const toggleFullscreen = async () => {
    if (!playerWrapRef.current) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await playerWrapRef.current.requestFullscreen();
    }
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
        <Link href="/course/enrolled">Courses</Link>
        <ChevronRight size={16} />
        <Link className="title-case" href={`/course/enrolled/${course.id}`}>
          {course.title}
        </Link>
        <ChevronRight size={16} />
        <span className="title-case">{video.title}</span>
      </nav>
      <div className="playback-layout">
        <main className="playback-main">
          <div
            ref={playerWrapRef}
            className={`playback-player-wrap${isPlaying ? " is-playing" : ""}`}
            onDoubleClick={() => void toggleFullscreen()}>
            <video
              ref={playerRef}
              className="playback-player"
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
              poster={currentVideoThumbnail}
              onClick={() => void togglePlay()}
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleVideoEnded}>
              Your browser does not support video playback.
            </video>
            <div className="playback-controls" aria-label="Video controls">
              <button
                type="button"
                className="playback-control-button"
                onClick={() => void togglePlay()}
                aria-label={isPlaying ? "Pause video" : "Play video"}>
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              </button>
              <span className="playback-time">{formatTime(currentTime)}</span>
              <input
                className="playback-progress"
                style={{ "--progress": `${duration ? (currentTime / duration) * 100 : 0}%` } as CSSProperties}
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={Math.min(currentTime, duration || 0)}
                onChange={(event) => {
                  const nextTime = Number(event.target.value);
                  if (playerRef.current) playerRef.current.currentTime = nextTime;
                  setCurrentTime(nextTime);
                }}
                aria-label="Video progress"
              />
              <span className="playback-time">{formatTime(duration)}</span>
              <div className="playback-volume">
                <button
                  type="button"
                  className="playback-control-button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}>
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  className="playback-volume-range"
                  style={{ "--progress": `${(isMuted ? 0 : volume) * 100}%` } as CSSProperties}
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(event) => changeVolume(Number(event.target.value))}
                  aria-label="Volume"
                />
              </div>
              <button
                type="button"
                className="playback-control-button"
                onClick={() => void toggleFullscreen()}
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
          <div className="playback-lesson-heading">
            <div>
              <small>
                Lesson {currentIndex + 1} of {course.videoCount}
              </small>
              <h1 className="title-case">{video.title}</h1>
              <p>{course.description}</p>
            </div>
          </div>
          <div className="playback-navigation">
            <Link
              className={!previousVideo ? "disabled" : ""}
              href={previousVideo ? `/course/enrolled/${course.id}/videos/${previousVideo.id}` : "#"}>
              <ChevronLeft size={17} /> Previous lesson
            </Link>
            <Link
              className={!nextVideo ? "disabled" : ""}
              href={nextVideo ? `/course/enrolled/${course.id}/videos/${nextVideo.id}` : "#"}>
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
                href={`/course/enrolled/${course.id}/videos/${item.id}`}>
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
                    <span
                      className="rating-star-visual"
                      style={{
                        background: `linear-gradient(90deg, #d97745 ${rating >= star ? "100%" : rating >= star - 0.5 ? "50%" : "0%"}, #d8d8d0 ${rating >= star ? "100%" : rating >= star - 0.5 ? "50%" : "0%"})`,
                      }}>
                      ★
                    </span>
                    <button
                      type="button"
                      className="rating-half rating-half-left"
                      aria-label={`${star - 0.5} stars`}
                      aria-pressed={rating === star - 0.5}
                      onClick={() => {
                        setRating(star - 0.5);
                        setIsRatingSubmitted(false);
                      }}
                    />
                    <button
                      type="button"
                      className="rating-half rating-half-right"
                      aria-label={`${star} stars`}
                      aria-pressed={rating === star}
                      onClick={() => {
                        setRating(star);
                        setIsRatingSubmitted(false);
                      }}
                    />
                  </span>
                ))}
              </div>
              {rating > 0 && <small className="rating-value">{rating} / 5</small>}
            </div>
            <div className="video-ended-actions">
              {!isRatingSubmitted && (
                <button
                  className="detail-primary rating-submit"
                  disabled={!rating || isRatingSubmitting}
                  onClick={() => void submitRating()}>
                  {isRatingSubmitting ? "Submitting..." : "Submit response"}
                </button>
              )}
            </div>
            <div className="video-ended-actions">
              <button
                className="detail-secondary"
                onClick={() => {
                  setShowEndPopup(false);
                  void playerRef.current?.play();
                }}>
                Watch again
              </button>
              {nextVideo ? (
                <Link className="detail-primary" href={`/course/enrolled/${course.id}/videos/${nextVideo.id}`}>
                  Next lesson <ChevronRight size={17} />
                </Link>
              ) : (
                <button className="detail-primary" onClick={() => setShowEndPopup(false)}>
                  Back to course
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
