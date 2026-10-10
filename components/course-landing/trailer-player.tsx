"use client";

import Hls from "hls.js";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { CourseTrailer } from "@/types/course-landing";

/**
 * Course trailer: a thumbnail with a play button. Once started, the only controls are Play, Pause and
 * Restart (no seeking, no download menu).
 */
export function TrailerPlayer({ trailer, title }: { trailer: CourseTrailer; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Attach the HLS stream only after the visitor presses play, so the page loads no video data before.
  // Same order as the lesson player: attach the video, then load the playlist, then play once it's parsed.
  useEffect(() => {
    const video = videoRef.current;
    if (!hasStarted || !video) return;

    const playNow = () => void video.play().catch(() => setIsPlaying(false));

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = trailer.hlsUrl;
      playNow();
    } else if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hlsRef.current = hls;
      hls.on(Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(trailer.hlsUrl));
      hls.on(Hls.Events.MANIFEST_PARSED, playNow);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        // Recover from network hiccups and decoding errors instead of freezing the player.
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
        else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        else setHasError(true);
      });
      hls.attachMedia(video);
    } else {
      return; // Not supported; `start` already showed the message.
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
      video.removeAttribute("src");
      video.load();
    };
  }, [hasStarted, trailer.hlsUrl]);

  const start = () => {
    const canPlayNatively = document.createElement("video").canPlayType("application/vnd.apple.mpegurl") !== "";
    if (!canPlayNatively && !Hls.isSupported()) setHasError(true);
    setHasStarted(true);
  };

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    // After the trailer has finished, Play starts it again from the beginning.
    if (video.ended) restartFromBeginning(video);
    void video.play().catch(() => setIsPlaying(false));
  };
  const pause = () => videoRef.current?.pause();
  const restartFromBeginning = (video: HTMLVideoElement) => {
    video.currentTime = 0;
    // Make sure the stream is (re)loading from the start, e.g. after it ended or stalled.
    hlsRef.current?.startLoad(0);
  };
  const restart = () => {
    const video = videoRef.current;
    if (!video) return;
    restartFromBeginning(video);
    void video.play().catch(() => setIsPlaying(false));
  };

  if (!hasStarted) {
    return (
      <button
        type="button"
        className={trailer.posterUrl ? "lp-trailer-poster" : "lp-trailer-poster lp-trailer-poster-empty"}
        onClick={start}
        aria-label={`Play the ${title} trailer`}>
        {trailer.posterUrl && (
          // A background image never shows a broken-image icon if the thumbnail fails to load.
          <span
            className="lp-trailer-thumb"
            style={{ backgroundImage: `url("${encodeURI(trailer.posterUrl)}")` }}
            aria-hidden="true"
          />
        )}
        <span className="lp-play-button" aria-hidden="true">
          <Play size={28} fill="currentColor" />
        </span>
        <span className="lp-trailer-label">Watch the trailer</span>
      </button>
    );
  }

  return (
    <div className="lp-trailer-player">
      <video
        ref={videoRef}
        playsInline
        poster={trailer.posterUrl ?? undefined}
        controls={false}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        onContextMenu={(event) => event.preventDefault()}
        onPlay={() => setIsPlaying(true)}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onClick={() => (isPlaying ? pause() : play())}
      />
      {hasError && <p className="lp-trailer-error">The trailer couldn&apos;t be played in this browser.</p>}
      <div className="lp-trailer-controls">
        {isPlaying ? (
          <button type="button" onClick={pause} aria-label="Pause trailer">
            <Pause size={18} fill="currentColor" /> Pause
          </button>
        ) : (
          <button type="button" onClick={play} aria-label="Play trailer">
            <Play size={18} fill="currentColor" /> Play
          </button>
        )}
        <button type="button" onClick={restart} aria-label="Restart trailer">
          <RotateCcw size={18} /> Restart
        </button>
      </div>
    </div>
  );
}
