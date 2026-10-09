import { ArrowRight, Check, ListOrdered, Lock, LockKeyhole, Play, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import courseFallback from "@/assets/images/landing/course/course-main.png";
import logo from "@/assets/images/logo/logo.png";
import { formatTotalDuration } from "@/lib/helper/landing-text";
import { formatScheduleDate } from "@/lib/helper/schedule-date";
import type { FeedbackImage } from "@/components/landing-page/feedback-images";
import type { CourseCurriculumItem, CourseLandingPage } from "@/types/course-landing";
import { FeedbackScreenshots } from "./feedback-screenshots";
import { LandingCountdown } from "./landing-countdown";
import { LandingPrice, PayableAmount, PriceCountdown, PricingSteps } from "./landing-price";
import { Txt, WhenOffer, WhenPhaseText } from "./landing-text";
import { TrailerPlayer } from "./trailer-player";

type Page = CourseLandingPage;

// Content can be incomplete (e.g. saved before a field existed), so every read below is optional.
const hasText = (value?: string | null) => (value ?? "").trim().length > 0;

/**
 * Draws an emoji in a fixed square so every icon looks the same size. Symbols such as ⏱ or ♾ default
 * to a small text glyph; the U+FE0F selector asks for the colour emoji instead.
 */
function EmojiIcon({ icon }: { icon?: string | null }) {
  const value = (icon ?? "").trim();
  if (!value) return null;
  const codePoints = [...value];
  const needsEmojiStyle = codePoints.length === 1 && (codePoints[0].codePointAt(0) ?? 0) < 0x1f000;

  return (
    <span className="lp-emoji" aria-hidden="true">
      {needsEmojiStyle ? `${value}\uFE0F` : value}
    </span>
  );
}

/** Where "Enroll" goes: the existing course page with its Razorpay checkout (login first if needed). */
export const getCheckoutHref = (courseId: string) =>
  `/login?returnTo=${encodeURIComponent(`/course/enrolled/${courseId}`)}`;

function SectionHeading({
  eyebrow,
  title,
  text,
  id,
}: {
  eyebrow?: string;
  title?: string;
  text?: string;
  id?: string;
}) {
  return (
    <>
      {hasText(eyebrow) && (
        <p className="lp-eyebrow">
          <Txt text={eyebrow} />
        </p>
      )}
      {hasText(title) && (
        <h2 id={id}>
          <Txt text={title} />
        </h2>
      )}
      {hasText(text) && (
        <p className="lp-lead">
          <Txt text={text} />
        </p>
      )}
    </>
  );
}

export function LandingAnnouncement({ page }: { page: Page }) {
  return (
    <WhenPhaseText value={page?.content?.announcement}>
      <div className="lp-ann" role="region" aria-label="Course announcement">
        <Txt phase={page?.content?.announcement} />
      </div>
    </WhenPhaseText>
  );
}

/** Links to the sections this page actually shows, in page order. */
const getSectionLinks = (page: Page) => {
  const content = page?.content;
  const testimonials = content?.testimonials;
  return [
    page?.trailer?.hlsUrl ? { href: "#trailer", label: "Trailer" } : null,
    (page?.curriculum?.length ?? 0) > 0 ? { href: "#curriculum", label: "What's inside" } : null,
    { href: "#buy", label: "Pricing" },
    hasText(content?.instructor?.bio) || hasText(content?.instructor?.title)
      ? { href: "#teacher", label: "Teacher" }
      : null,
    testimonials?.showScreenshots || (testimonials?.quotes?.length ?? 0) > 0 || (page?.reviews?.length ?? 0) > 0
      ? { href: "#reviews", label: "Reviews" }
      : null,
    (content?.faq?.items?.length ?? 0) > 0 ? { href: "#faq", label: "FAQ" } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);
};

/** Same logo and brand as the site navbar, with links to this page's sections. */
export function LandingNav({ page }: { page: Page }) {
  const links = getSectionLinks(page);

  return (
    <header className="lp-nav">
      <div className="kratika-yoga-container lp-nav-inner">
        <Link className="landing-brand" href="/" aria-label="Kratika Yoga home">
          <Image src={logo} alt="" width={52} height={52} className="landing-brand-mark" />
          <span>KratikaYoga</span>
        </Link>
        <nav className="lp-nav-links" aria-label="Course sections">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="lp-btn lp-nav-cta" href="#buy">
          Enroll now
        </a>
      </div>
    </header>
  );
}

/** "At a glance" tiles in the hero's left column, 3 per row (2 on small phones). */
function HeroStats({ stats }: { stats?: Page["content"]["stats"] }) {
  if (!stats?.length) return null;

  return (
    <div className="lp-stats" aria-label="Course at a glance" role="group">
      {stats.map((stat, index) => (
        <div key={index}>
          <EmojiIcon icon={stat?.icon} />
          <strong>
            <Txt text={stat?.title} />
          </strong>
          {stat?.text && (
            <span>
              <Txt text={stat.text} />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function LandingHero({ page }: { page: Page }) {
  const hero = page?.content?.hero;
  const courseTitle = page?.course?.title ?? "";
  const coverImage = hero?.coverImageUrl || page?.course?.thumbnailUrl || courseFallback;

  return (
    <header className="lp-hero">
      <div className="kratika-yoga-container lp-hero-grid">
        <div>
          <WhenPhaseText value={hero?.badge}>
            <span className="lp-badge">
              <Txt phase={hero?.badge} />
            </span>
          </WhenPhaseText>
          <h1>
            <Txt text={hasText(hero?.title) ? hero?.title : courseTitle} />
          </h1>
          {hasText(hero?.subtitle) && (
            <p className="lp-sub">
              <Txt text={hero?.subtitle} />
            </p>
          )}
          <LandingCountdown label={hero?.countdownLabel ?? ""} />
          <div className="lp-cta">
            <a className="lp-btn" href="#buy">
              <Txt text={hasText(hero?.primaryButton) ? hero?.primaryButton : "Enroll now · {price}"} />
            </a>
            {hasText(hero?.secondaryButton) && (
              <a className="lp-btn lp-ghost" href="#curriculum">
                <Txt text={hero?.secondaryButton} />
              </a>
            )}
          </div>
          <HeroStats stats={page?.content?.stats} />
        </div>
        <div className="lp-media">
          {hero?.chips?.[0] && (
            <span className="lp-chip lp-chip-a">
              <Txt text={hero?.chips?.[0]} />
            </span>
          )}
          <Image src={coverImage} alt={courseTitle} fill priority sizes="(max-width: 820px) 100vw, 45vw" />
          {hero?.chips?.[1] && (
            <span className="lp-chip lp-chip-b">
              <Txt text={hero?.chips?.[1]} />
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

/** The course trailer in its own 16:9 section under the hero. Hidden until a trailer is ready. */
export function LandingTrailer({ page }: { page: Page }) {
  const trailer = page?.trailer;
  if (!trailer?.hlsUrl) return null;

  const section = page?.content?.trailerSection;
  const courseTitle = page?.course?.title ?? "";

  return (
    <section className="lp-section lp-trailer-section" id="trailer" aria-labelledby="lp-trailer-title">
      <div className="kratika-yoga-container lp-center">
        <SectionHeading
          eyebrow={section?.eyebrow}
          id="lp-trailer-title"
          text={section?.text}
          title={hasText(section?.title) ? section?.title : `Watch the ${courseTitle} trailer`}
        />
        <div className="lp-trailer-frame lp-rv">
          <TrailerPlayer trailer={trailer} title={courseTitle} />
        </div>
      </div>
    </section>
  );
}

export function LandingPainPoints({ page }: { page: Page }) {
  const painPoints = page?.content?.painPoints;
  const items = painPoints?.items ?? [];
  if (items.length === 0) return null;

  return (
    <section className="lp-section" aria-labelledby="lp-pain-title">
      <div className="kratika-yoga-container">
        <SectionHeading eyebrow={painPoints?.eyebrow} id="lp-pain-title" title={painPoints?.title} />
        <div className="lp-cards">
          {items.map((item, index) => (
            <div className="lp-card lp-rv" key={index}>
              {item?.icon && (
                <div className="lp-ic">
                  <EmojiIcon icon={item.icon} />
                </div>
              )}
              <h3>
                <Txt text={item?.title} />
              </h3>
              {item?.text && (
                <p>
                  <Txt text={item.text} />
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingHowItWorks({ page }: { page: Page }) {
  const howItWorks = page?.content?.howItWorks;
  const steps = howItWorks?.steps ?? [];
  if (steps.length === 0) return null;

  return (
    <section className="lp-section" aria-labelledby="lp-how-title">
      <div className="kratika-yoga-container lp-rv">
        <SectionHeading eyebrow={howItWorks?.eyebrow} id="lp-how-title" title={howItWorks?.title} />
        <div className="lp-steps">
          {steps.map((step, index) => (
            <div key={index}>
              <h3>
                <Txt text={step?.title} />
              </h3>
              {step?.text && (
                <p>
                  <Txt text={step.text} />
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingBenefits({ page }: { page: Page }) {
  const benefits = page?.content?.benefits;
  const items = benefits?.items ?? [];
  if (items.length === 0 && !hasText(benefits?.title)) return null;

  return (
    <section className="lp-section lp-deep" aria-labelledby="lp-gain-title">
      <div className="kratika-yoga-container lp-two lp-rv">
        <div>
          <SectionHeading
            eyebrow={benefits?.eyebrow}
            id="lp-gain-title"
            text={benefits?.text}
            title={benefits?.title}
          />
        </div>
        {items.length > 0 && (
          <ul className="lp-tick">
            {items.map((item, index) => (
              <li key={index}>
                <Txt text={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/** "11:24" or "1:02:05". */
const formatLessonDuration = (seconds?: number | null) => {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = String(total % 60).padStart(2, "0");
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, "0")}:${rest}` : `${minutes}:${rest}`;
};

const lessonCountLabel = (count: number) => `${count} ${count === 1 ? "lesson" : "lessons"}`;

// Without groups, long lists show this many lessons and a "Show all" toggle for the rest.
const FLAT_LESSONS_SHOWN = 6;

function LessonRow({ lesson }: { lesson: CourseCurriculumItem }) {
  return (
    <div className={`lp-lesson${lesson?.isUpcoming ? " is-upcoming" : ""}`}>
      <span className="lp-lesson-icon" aria-hidden="true">
        {lesson?.isUpcoming ? <Lock size={15} strokeWidth={1.8} /> : <Play size={14} fill="currentColor" />}
      </span>
      <span className="lp-lesson-copy">
        <span className="lp-lesson-no">Lesson {String(lesson?.lessonNumber ?? "").padStart(2, "0")}</span>
        <span className="lp-lesson-title">{lesson?.title}</span>
        {lesson?.isUpcoming && lesson?.releaseDate && (
          <span className="lp-lesson-soon">Opens {formatScheduleDate(lesson.releaseDate)}</span>
        )}
      </span>
      <span className="lp-lesson-time">{formatLessonDuration(lesson?.durationSeconds)}</span>
    </div>
  );
}

/** Lessons by week when the admin grouped them (each week opens and closes); otherwise one list. */
function LessonList({ lessons, groups }: { lessons: CourseCurriculumItem[]; groups: Page["groups"] }) {
  if ((groups?.length ?? 0) > 0) {
    return (
      <div className="lp-lessons">
        {groups.map((group, index) => {
          const groupLessons = group?.videos ?? [];
          const first = groupLessons[0]?.lessonNumber;
          const last = groupLessons[groupLessons.length - 1]?.lessonNumber;
          const seconds = groupLessons.reduce((total, lesson) => total + (Number(lesson?.durationSeconds) || 0), 0);
          return (
            <details className="lp-week" key={group?.id ?? "other"} open={index === 0}>
              <summary>
                <span className="lp-week-copy">
                  <span className="lp-lesson-no">
                    {first === last ? `Lesson ${first}` : `Lessons ${first}–${last}`}
                  </span>
                  <span className="lp-week-title">{group?.title}</span>
                  {group?.description && <span className="lp-week-focus">{group.description}</span>}
                </span>
                <span className="lp-lesson-time">
                  {lessonCountLabel(groupLessons.length)} · {formatTotalDuration(seconds)}
                </span>
              </summary>
              {groupLessons.map((lesson) => (
                <LessonRow key={lesson?.id} lesson={lesson} />
              ))}
            </details>
          );
        })}
      </div>
    );
  }

  const shown = lessons.length > FLAT_LESSONS_SHOWN + 2 ? lessons.slice(0, FLAT_LESSONS_SHOWN) : lessons;
  const rest = lessons.slice(shown.length);

  return (
    <div className="lp-lessons">
      {shown.map((lesson) => (
        <LessonRow key={lesson?.id} lesson={lesson} />
      ))}
      {rest.length > 0 && (
        <details className="lp-more">
          <summary>
            <span className="lp-more-closed">Show all {lessons.length} lessons</span>
            <span className="lp-more-open">Show fewer lessons</span>
          </summary>
          {rest.map((lesson) => (
            <LessonRow key={lesson?.id} lesson={lesson} />
          ))}
        </details>
      )}
    </div>
  );
}

/** Text, rating and students on the left; the lessons in a card on the right. */
export function LandingCurriculum({ page }: { page: Page }) {
  const curriculum = page?.content?.curriculum;
  const lessons = page?.curriculum ?? [];
  if (lessons.length === 0) return null;

  const rating = page?.stats?.totalReviews ? Number(page.stats.averageRating) || 0 : 0;
  const students = Number(page?.stats?.totalStudents) || 0;

  return (
    <section className="lp-section lp-inside" id="curriculum" aria-labelledby="lp-curriculum-title">
      <div className="kratika-yoga-container lp-inside-grid">
        <div className="lp-inside-copy">
          <SectionHeading
            eyebrow={curriculum?.eyebrow}
            id="lp-curriculum-title"
            text={curriculum?.text}
            title={hasText(curriculum?.title) ? curriculum?.title : "{lessonCount} lessons. *{totalDuration} total.*"}
          />
          {page?.course?.sequentialUnlock && (
            <p className="lp-inside-note">
              <ListOrdered aria-hidden="true" size={18} strokeWidth={1.8} /> Videos unlock in order, one after another.
            </p>
          )}
          {(rating > 0 || students > 0) && (
            <div className="lp-inside-stats">
              {rating > 0 && (
                <div className="lp-inside-rating">
                  <strong>{rating.toFixed(1)}</strong>
                  <span>course rating</span>
                </div>
              )}
              {students > 0 && (
                <div className="lp-inside-students">
                  <strong>{students.toLocaleString("en-IN")}</strong>
                  <span>{students === 1 ? "student enrolled" : "students enrolled"}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="lp-rv">
          <LessonList groups={page?.groups ?? []} lessons={lessons} />
        </div>
      </div>
    </section>
  );
}

/** One card: offer badge and countdown, the price, the steps, everything included and the Enroll button. */
export function LandingPricing({ page }: { page: Page }) {
  const pricing = page?.content?.pricing;
  const includes = pricing?.includes ?? [];

  return (
    <section className="lp-section lp-buy" id="buy" aria-labelledby="lp-buy-title">
      <div className="kratika-yoga-container lp-center">
        <SectionHeading eyebrow={pricing?.eyebrow} id="lp-buy-title" title={pricing?.title} />
        <WhenPhaseText value={pricing?.text}>
          <p className="lp-lead">
            <Txt phase={pricing?.text} />
          </p>
        </WhenPhaseText>
      </div>
      <div className="kratika-yoga-container">
        <div className="lp-price lp-rv">
          <div className="lp-price-top">
            <WhenOffer>
              <WhenPhaseText value={pricing?.badge}>
                <span className="lp-offer">
                  <Tag aria-hidden="true" size={14} strokeWidth={2} />
                  <Txt phase={pricing?.badge} />
                </span>
              </WhenPhaseText>
            </WhenOffer>
            <PriceCountdown />
          </div>
          <LandingPrice />
          {hasText(pricing?.note) && (
            <p className="lp-price-note">
              <Txt text={pricing?.note} />
            </p>
          )}
          <PricingSteps steps={pricing?.steps} title={pricing?.stepsTitle} />
          {includes.length > 0 && (
            <div className="lp-included">
              <p className="lp-card-label">Everything included</p>
              <ul>
                {includes.map((item, index) => (
                  <li key={index}>
                    <span className="lp-check" aria-hidden="true">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span>
                      <Txt text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <a className="lp-btn lp-price-btn" href={getCheckoutHref(page?.course?.id ?? "")}>
            <span>
              <Txt text={hasText(pricing?.button) ? pricing?.button : "Enroll in the course"} />
            </span>
            <span className="lp-price-btn-end">
              <PayableAmount />
              <i aria-hidden="true">
                <ArrowRight size={15} strokeWidth={2} />
              </i>
            </span>
          </a>
          <p className="lp-secure">
            <LockKeyhole aria-hidden="true" size={14} strokeWidth={1.8} /> Secure payment
            <span>UPI</span>
            <span>Cards</span>
            <span>Netbanking</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/** Teacher card: photo on the left; name, bio and a few figures (e.g. "8 yrs · of practice") on the right. */
export function LandingInstructor({ page }: { page: Page }) {
  const instructor = page?.content?.instructor;
  const figures = instructor?.stats ?? [];
  if (!hasText(instructor?.bio) && !hasText(instructor?.title)) return null;

  return (
    <section className="lp-section" id="teacher" aria-labelledby="lp-instructor-title">
      <div className="kratika-yoga-container">
        <div className={`lp-teacher lp-rv${instructor?.imageUrl ? "" : " lp-teacher-no-photo"}`}>
          {instructor?.imageUrl && (
            <div className="lp-teacher-photo">
              <Image
                src={instructor.imageUrl}
                alt={instructor?.title?.replace(/\*/g, "") || "Instructor"}
                fill
                sizes="(max-width: 820px) 100vw, 40vw"
              />
            </div>
          )}
          <div className="lp-teacher-copy">
            {hasText(instructor?.eyebrow) && (
              <p className="lp-eyebrow">
                <Txt text={instructor?.eyebrow} />
              </p>
            )}
            {hasText(instructor?.title) && (
              <h2 id="lp-instructor-title">
                <Txt text={instructor?.title} />
              </h2>
            )}
            {hasText(instructor?.bio) && (
              <p className="lp-teacher-bio">
                <Txt text={instructor?.bio} />
              </p>
            )}
            {figures.length > 0 && (
              <dl className="lp-teacher-stats">
                {figures.map((stat, index) => (
                  <div key={index}>
                    <dt>{stat?.value}</dt>
                    {stat?.label && <dd>{stat.label}</dd>}
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** `feedbackImages`: the admin's feedback screenshots (or the built-in ones), shown when switched on. */
export function LandingTestimonials({ page, feedbackImages }: { page: Page; feedbackImages: FeedbackImage[] }) {
  const testimonials = page?.content?.testimonials;
  const adminQuotes = testimonials?.quotes ?? [];
  const reviews = page?.reviews ?? [];
  const showScreenshots = testimonials?.showScreenshots === true;
  if (!showScreenshots && adminQuotes.length === 0 && reviews.length === 0) return null;

  // Admin quotes first; real course reviews fill in when there are none.
  const quotes =
    adminQuotes.length > 0
      ? adminQuotes
      : reviews.slice(0, 3).map((review) => ({ text: review?.comment ?? "", name: review?.userName ?? "" }));

  return (
    <section className="lp-section lp-alt" id="reviews" aria-labelledby="lp-love-title">
      <div className="kratika-yoga-container">
        <SectionHeading
          eyebrow={testimonials?.eyebrow}
          id="lp-love-title"
          title={hasText(testimonials?.title) ? testimonials?.title : "What students say"}
        />
        {showScreenshots && <FeedbackScreenshots images={feedbackImages} />}
        {quotes.length > 0 && (
          <div className="lp-quotes">
            {quotes.map((quote, index) => (
              <blockquote key={index}>
                “<Txt text={quote?.text} />”{quote?.name && <cite>{quote.name}</cite>}
              </blockquote>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function LandingFaq({ page }: { page: Page }) {
  const faq = page?.content?.faq;
  const questions = faq?.items ?? [];
  if (questions.length === 0) return null;

  return (
    <section className="lp-section" id="faq" aria-labelledby="lp-faq-title">
      <div className="kratika-yoga-container">
        <div className="lp-narrow">
          <SectionHeading
            eyebrow={faq?.eyebrow}
            id="lp-faq-title"
            title={hasText(faq?.title) ? faq?.title : "Questions before you begin?"}
          />
          {questions.map((item, index) => (
            <details className="lp-details lp-rv" key={index}>
              <summary>
                <Txt text={item?.question} />
              </summary>
              <div className="lp-details-body lp-answer">
                <Txt text={item?.answer} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingFinalCta({ page }: { page: Page }) {
  const finalCta = page?.content?.finalCta;

  return (
    <section className="lp-section lp-deep lp-final" aria-labelledby="lp-final-title">
      <div className="kratika-yoga-container">
        <h2 id="lp-final-title">
          <Txt text={hasText(finalCta?.title) ? finalCta?.title : `Start ${page?.course?.title ?? "today"}.`} />
        </h2>
        {hasText(finalCta?.text) && (
          <p className="lp-lead">
            <Txt text={finalCta?.text} />
          </p>
        )}
        <div className="lp-cta">
          <a className="lp-btn" href="#buy">
            <Txt text={hasText(finalCta?.button) ? finalCta?.button : "Enroll now"} />
          </a>
        </div>
      </div>
    </section>
  );
}
