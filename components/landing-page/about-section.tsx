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
            <h2 className="mt-0!">Meet your instructor, and the courses she's built for you.</h2>
            <p className="text-justify">
              I'm Kratika — a certified 500-Hour Yoga Teacher Training (YTT) graduate and Half Primary Ashtanga yoga
              coach. I've been practicing yoga for 8 years and teaching for the last 5, and every course here comes from
              lessons I've learned on my own mat first.
            </p>
            <p className="text-justify">
              My approach to teaching yoga is simple: your practice should support your body, not force it into someone
              else's idea of perfect. Each online yoga course is designed to build slowly — clear instruction, honest
              pacing, and room to move at whatever speed feels right for you today. Whether you're just starting out or
              coming back after time away, you'll be guided with the same care I'd want for myself.
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
