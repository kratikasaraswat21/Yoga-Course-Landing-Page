import CourseAboutUsImage from "@/assets/images/landing/about-us-image.webp";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { aboutPrinciples } from "@/data/landing-page";

export function AboutSection() {
  return (
    <section className="landing-about" id="about">
      <div className="kratika-yoga-container">
        <div className="landing-about-grid">
          <div className="landing-about-image-wrap">
            <Image
              src={CourseAboutUsImage}
              alt="Kratika practicing yoga in nature"
              fill
              className="landing-about-image w-full! h-full! object-cover! rounded-lg! md:rounded-xl! lg:rounded-2xl!"
            />
          </div>
          <div className="landing-about-copy">
            <h2 className="mt-0!">
              Yoga that meets you
              <br />
              where you are.
            </h2>
            <p>
              Kratika Yoga is a welcoming space for mindful movement, deeper breathing and meaningful connection. Every
              practice is designed to support your body—not force it into perfection.
            </p>
            <p>
              Whether you’re beginning your journey or returning to your practice, you’ll be guided with clarity,
              patience and care.
            </p>
            <div className="landing-about-footer">
              <a className="landing-button landing-button-dark" href="#classes">
                Discover our approach <ArrowRight aria-hidden="true" size={19} />
              </a>
            </div>
          </div>
        </div>
        <div className="landing-principles">
          {aboutPrinciples.map(([number, title, body]) => (
            <article key={number} className="landing-principle">
              <div>
                <strong>{number}</strong>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
