import { ArrowRight, Play, Plus } from "lucide-react";

import { essentialProducts, faqQuestions } from "@/data/landing-page";
import type { LandingCourse } from "@/types/landing-course";
import type { LandingPdfCourse } from "@/types/landing-pdf-course";

import { CourseCarousel } from "./course-carousel";
import { FreeCourseSwiper } from "./free-course-swiper";
import { PdfCourseCarousel } from "./pdf-course-carousel";
import { SectionIntro } from "./section-intro";
import { TestimonialSwiper } from "./testimonial-swiper";

function CategoryHighlights() {
  return (
    <section className="platform-categories" id="classes">
      <div className="kratika-yoga-container">
        <SectionIntro
          title="Everything you need to build a practice that lasts."
          description="Choose the kind of support that works for you—from guided video sessions and downloadable programs to thoughtfully selected yoga essentials."
        />
        <div className="platform-category-grid">
          <article className="platform-category platform-category-video">
            <div className="platform-category-image platform-category-image-video">
              <span className="platform-round-play">
                <Play size={18} fill="currentColor" />
              </span>
              <div className="platform-category-overlay">
                <h3>Guided Video Courses</h3>
                <p>Follow clear, structured sessions and practise whenever it suits you.</p>
                <a href="#course-library">
                  Explore video courses <ArrowRight size={17} />
                </a>
              </div>
            </div>
          </article>
          <article className="platform-category platform-category-pdf">
            <div className="platform-category-image platform-category-image-pdf">
              <div className="platform-category-overlay">
                <h3>PDF Yoga Programs</h3>
                <p>Download practical routines and structured plans you can follow anywhere.</p>
                <a href="/pdf-courses">
                  Browse PDF programs <ArrowRight size={17} />
                </a>
              </div>
            </div>
          </article>
          <article className="platform-category platform-category-products">
            <div className="platform-category-image platform-category-image-products">
              <div className="platform-category-overlay">
                <h3>Recommended Essentials</h3>
                <p>Thoughtfully selected products for a more comfortable practice.</p>
                <a href="/affiliate-products">
                  View recommendations <ArrowRight size={17} />
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Essentials() {
  return (
    <section className="platform-essentials" id="essentials">
      <div className="kratika-yoga-container">
        <SectionIntro
          title="Essentials for a calmer, more comfortable practice."
          description="Thoughtfully selected yoga mats, props and wellness essentials to support your home practice."
        />
        <div className="platform-products-grid">
          {essentialProducts.map(({ title, description, action }, index) => (
            <article key={title}>
              <div className={`platform-product-image platform-product-image-${index + 1}`} />
              <div className="platform-product-content">
                <h3>{title}</h3>
                <p>{description}</p>
                <a className="platform-product-button" href="#start">
                  {action} <ArrowRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
        <a className="landing-button landing-button-dark platform-essentials-cta" href="#start">
          Explore recommended essentials <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="platform-faq" id="faq">
      <div className="kratika-yoga-container platform-faq-grid">
        <SectionIntro
          title="Questions before you begin?"
          description="A few helpful answers to make your first step feel simple."
        />
        <div className="platform-faq-list">
          {faqQuestions.map((question) => (
            <details key={question}>
              <summary>
                {question}
                <Plus size={21} />
              </summary>
              <div className="platform-faq-answer">
                <div>
                  <p>
                    Yes. Kratika Yoga is designed to be clear, welcoming and flexible, with guidance available whenever
                    you need it.
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="platform-final-cta">
      <div className="kratika-yoga-container">
        <h2>
          Your practice doesn’t need to be perfect.
          <br />
          <i>It just needs to begin.</i>
        </h2>
        <p>Choose a course, take your first gentle step and build a yoga practice that grows with you.</p>
        <div>
          <a className="landing-button landing-button-light" href="/courses">
            Explore all courses <ArrowRight size={18} />
          </a>
          <a className="landing-button landing-button-secondary" href="#free-practice">
            Start with a free practice <ArrowRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function PlatformSections({
  topCourses,
  topPdfCourses,
  error,
  pdfError,
}: {
  topCourses: LandingCourse[];
  topPdfCourses: LandingPdfCourse[];
  error?: string;
  pdfError?: string;
}) {
  return (
    <>
      <CategoryHighlights />
      <FreeCourseSwiper />
      <CourseCarousel courses={topCourses} error={error} />
      <PdfCourseCarousel courses={topPdfCourses} error={pdfError} />
      <TestimonialSwiper />
      <Essentials />
      <Faq />
      <div className="w-full px-4 bg-white">
        <FinalCta />
      </div>
    </>
  );
}
