import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="landing-hero" id="top" aria-label="Kratika Yoga introduction">
      <video className="landing-hero-video" autoPlay muted loop playsInline aria-hidden="true">
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="landing-hero-overlay" />
      <div className="kratika-yoga-container landing-hero-inner">
        <div className="landing-hero-content">
          <p className="landing-eyebrow">
            Move <span>•</span> Breathe <span>•</span> Reconnect
          </p>
          <h1>
            Come back
            <br />
            <i>to yourself.</i>
          </h1>
          <p className="landing-hero-copy">
            Thoughtful yoga practices designed to help you move better, breathe deeper, and reconnect with yourself.
          </p>
          <div className="landing-hero-actions">
            <a className="landing-button landing-button-light" href="/login">
              Begin your journey <ArrowRight aria-hidden="true" size={19} />
            </a>
            <a className="landing-button landing-button-outline" href="/courses">
              <span className="landing-play">
                <Play aria-hidden="true" size={14} fill="currentColor" />
              </span>{" "}
              Explore the library
            </a>
          </div>
          <p className="landing-hero-meta">
            Beginner-friendly <span>•</span> Practice anywhere <span>•</span> Move at your pace
          </p>
        </div>
      </div>
    </section>
  );
}
