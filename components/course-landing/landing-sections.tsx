import { ArrowRight, Check, Clock, ListOrdered, Lock, LockKeyhole, Plus, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import courseFallback from "@/assets/images/landing/course/course-main.png";
import logo from "@/assets/images/logo/logo.png";
import { formatTotalDuration } from "@/lib/helper/landing-text";
import { formatScheduleDate } from "@/lib/helper/schedule-date";
import type { FeedbackImage } from "@/components/landing-page/feedback-images";
import type { CourseCurriculumItem, CourseLandingPage } from "@/types/course-landing";
import { getCheckoutHref } from "@/types/landing-course";
import { COMMON_BORDER_RADIUS, COMMON_SECTION_PADDING } from "@/lib/constants/layout";
import { cn } from "@/lib/utils";
import { FeedbackScreenshots } from "./feedback-screenshots";
import { LandingCountdown } from "./landing-countdown";
import { LandingPrice, PriceCountdown, PricingSteps } from "./landing-price";
import { AnnouncementText, Txt, WhenOffer, WhenPhaseText } from "./landing-text";
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

/** The uploaded icon when there is one (it wins over the emoji), otherwise the emoji. */
function ItemIcon({ icon, iconUrl, className }: { icon?: string | null; iconUrl?: string | null; className: string }) {
  if (iconUrl) {
    // Plain <img>: admin-uploaded icons are often SVG, which next/image blocks by default.
    return <img alt="" aria-hidden="true" className={className} height={32} src={iconUrl} width={32} />;
  }
  return <EmojiIcon icon={icon} />;
}

/** Section title and its description, always centred. */
function SectionHeading({ title, text, id }: { title?: string; text?: string; id?: string }) {
  return (
    <div className="lp-center">
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
    </div>
  );
}

export function LandingAnnouncement({ page }: { page: Page }) {
  return (
    <WhenPhaseText value={page?.content?.announcement}>
      <div className="lp-ann" role="region" aria-label="Course announcement">
        <AnnouncementText value={page?.content?.announcement} />
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

/** "Course at a glance" card below the hero grid: one row on desktop, 3 per row on tablets, 2 on large phones, 1 on small phones. */
function HeroStats({ title, stats }: { title?: string; stats?: Page["content"]["stats"] }) {
  if (!stats?.length) return null;
  const showTitle = hasText(title);

  return (
    <section
      className={cn("lp-stats", COMMON_BORDER_RADIUS)}
      aria-label={showTitle ? undefined : "Course at a glance"}
      aria-labelledby={showTitle ? "lp-stats-title" : undefined}>
      {showTitle && (
        <p className="lp-stats-title" id="lp-stats-title">
          <Txt text={title} />
        </p>
      )}
      <div className="lp-stats-grid">
        {stats.map((stat, index) => (
          <div className="lp-stat" key={index}>
            <ItemIcon className="lp-stat-icon" icon={stat?.icon} iconUrl={stat?.iconUrl} />
            <strong>
              <Txt text={stat?.title} />
            </strong>
            {stat?.text && (
              <span className="lp-stat-text">
                <Txt text={stat.text} />
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function LandingHero({ page }: { page: Page }) {
  const hero = page?.content?.hero;
  const courseTitle = page?.course?.title ?? "";
  const coverImage = hero?.coverImageUrl || page?.course?.thumbnailUrl || courseFallback;

  return (
    <header className={cn("lp-hero", COMMON_SECTION_PADDING)}>
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
        </div>
        <div className={cn("lp-media", COMMON_BORDER_RADIUS)}>
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
      <div className="kratika-yoga-container">
        <HeroStats stats={page?.content?.stats} title={page?.content?.statsTitle} />
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
    <section className={cn("lp-section lp-trailer-section", COMMON_SECTION_PADDING)} id="trailer" aria-labelledby="lp-trailer-title">
      <div className="kratika-yoga-container lp-center">
        <SectionHeading
          id="lp-trailer-title"
          text={section?.text}
          title={hasText(section?.title) ? section?.title : `Watch the ${courseTitle} trailer`}
        />
        <div className={cn("lp-trailer-frame lp-rv", COMMON_BORDER_RADIUS)}>
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
    <section className={cn("lp-section", COMMON_SECTION_PADDING)} aria-labelledby="lp-pain-title">
      <div className="kratika-yoga-container">
        <SectionHeading id="lp-pain-title" text={painPoints?.text} title={painPoints?.title} />
        <div className="lp-cards">
          {items.map((item, index) => (
            <div className={cn("lp-card lp-rv", COMMON_BORDER_RADIUS)} key={index}>
              {(item?.iconUrl || item?.icon) && (
                <div className="lp-ic">
                  <ItemIcon className="lp-ic-img" icon={item.icon} iconUrl={item.iconUrl} />
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
    <section className={cn("lp-section", COMMON_SECTION_PADDING)} aria-labelledby="lp-how-title">
      <div className="kratika-yoga-container lp-rv">
        <SectionHeading id="lp-how-title" text={howItWorks?.text} title={howItWorks?.title} />
        <div className="lp-steps">
          {steps.map((step, index) => (
            <div className={COMMON_BORDER_RADIUS} key={index}>
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
    <section className={cn("lp-section lp-gain", COMMON_SECTION_PADDING)} aria-labelledby="lp-gain-title">
      <div className="kratika-yoga-container lp-rv">
        <p className="lp-gain-eyebrow">What you&apos;ll get</p>
        <SectionHeading id="lp-gain-title" text={benefits?.text} title={benefits?.title} />
        {items.length > 0 && (
          <ul className="lp-gain-list">
            {items.map((item, index) => (
              <li key={index}>
                <Check aria-hidden="true" size={20} strokeWidth={2.25} />
                <span>
                  <Txt text={item} />
                </span>
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

// Without groups, long lists show this many lessons and a "Show all" toggle for the rest.
const FLAT_LESSONS_SHOWN = 6;

function LessonRow({ lesson }: { lesson: CourseCurriculumItem }) {
  return (
    <div className={`lp-lesson${lesson?.isUpcoming ? " is-upcoming" : ""}`}>
      <span className="lp-lesson-no">Lesson {lesson?.lessonNumber}</span>
      <span className="lp-lesson-copy">
        <span className="lp-lesson-title">{lesson?.title}</span>
        {lesson?.isUpcoming && lesson?.releaseDate && (
          <span className="lp-lesson-soon">Opens {formatScheduleDate(lesson.releaseDate)}</span>
        )}
      </span>
      <span className="lp-lesson-time">
        {lesson?.isUpcoming && <Lock aria-label="Not open yet" size={13} strokeWidth={1.8} />}
        {formatLessonDuration(lesson?.durationSeconds)}
      </span>
    </div>
  );
}

/** Lessons by week when the admin grouped them (each week is a card that opens and closes); otherwise one list. */
function LessonList({ lessons, groups }: { lessons: CourseCurriculumItem[]; groups: Page["groups"] }) {
  if ((groups?.length ?? 0) > 0) {
    return (
      <div className="lp-weeks">
        {groups.map((group, index) => {
          const groupLessons = group?.videos ?? [];
          const first = groupLessons[0]?.lessonNumber;
          const last = groupLessons[groupLessons.length - 1]?.lessonNumber;
          const seconds = groupLessons.reduce((total, lesson) => total + (Number(lesson?.durationSeconds) || 0), 0);
          return (
            <details className={cn("lp-week", COMMON_BORDER_RADIUS)} key={group?.id ?? "other"}>
              <summary>
                <span className="lp-week-badge" aria-hidden="true">
                  W{index + 1}
                </span>
                <span className="lp-week-copy">
                  <span className="lp-week-title">{group?.title}</span>
                  <span className="lp-week-meta">
                    {first === last ? `Lesson ${first}` : `Lessons ${first}–${last}`} · {formatTotalDuration(seconds)}
                    {group?.description && ` · ${group.description}`}
                  </span>
                </span>
              </summary>
              <div className="lp-week-body">
                {groupLessons.map((lesson) => (
                  <LessonRow key={lesson?.id} lesson={lesson} />
                ))}
              </div>
            </details>
          );
        })}
      </div>
    );
  }

  const shown = lessons.length > FLAT_LESSONS_SHOWN + 2 ? lessons.slice(0, FLAT_LESSONS_SHOWN) : lessons;
  const rest = lessons.slice(shown.length);

  return (
    <div className={cn("lp-lessons", COMMON_BORDER_RADIUS)}>
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

/** Title and text on top, then the weeks (or lessons) as a column of cards. */
export function LandingCurriculum({ page }: { page: Page }) {
  const curriculum = page?.content?.curriculum;
  const lessons = page?.curriculum ?? [];
  if (lessons.length === 0) return null;

  return (
    <section className={cn("lp-section lp-inside", COMMON_SECTION_PADDING)} id="curriculum" aria-labelledby="lp-curriculum-title">
      <div className="kratika-yoga-container">
        <div className="lp-inside-wrap">
          <SectionHeading
            id="lp-curriculum-title"
            text={curriculum?.text}
            title={hasText(curriculum?.title) ? curriculum?.title : "{lessonCount} lessons. *{totalDuration} total.*"}
          />
          {page?.course?.sequentialUnlock && (
            <p className="lp-inside-note">
              <ListOrdered aria-hidden="true" size={16} strokeWidth={1.8} /> Videos unlock in order, one after another.
            </p>
          )}
          <div className="lp-inside-list lp-rv">
            <LessonList groups={page?.groups ?? []} lessons={lessons} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** One card: offer badge and countdown, the price, the steps and the Enroll button. */
export function LandingPricing({ page }: { page: Page }) {
  const pricing = page?.content?.pricing;

  return (
    <section className={cn("lp-section lp-buy", COMMON_SECTION_PADDING)} id="buy" aria-labelledby="lp-buy-title">
      <div className="kratika-yoga-container lp-center">
        <SectionHeading id="lp-buy-title" title={pricing?.title} />
        <WhenPhaseText value={pricing?.text}>
          <p className="lp-lead">
            <Txt phase={pricing?.text} />
          </p>
        </WhenPhaseText>
      </div>
      <div className="kratika-yoga-container">
        <div className={cn("lp-price lp-rv", COMMON_BORDER_RADIUS)}>
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
          <a className="lp-btn lp-price-btn" href={getCheckoutHref(page?.course?.id ?? "")}>
            <Txt text={hasText(pricing?.button) ? pricing?.button : "Enroll in the course"} />
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

// Same rule the backend checks; anything else (e.g. "javascript:") never becomes a link.
const SAFE_LINK = /^(https?:\/\/|\/(?!\/)|#|mailto:|tel:)/i;

type TeacherButton = { label?: string | null; url?: string | null } | null | undefined;

const getTeacherLink = (button: TeacherButton) => {
  const label = (button?.label ?? "").trim();
  const url = (button?.url ?? "").trim();
  if (!label || !SAFE_LINK.test(url)) return null;
  return { label, url, isExternal: /^https?:\/\//i.test(url) };
};

// Outside links (e.g. a booking page) open in a new tab; links on this site don't.
function TeacherLink({
  link,
  className,
  children,
}: {
  link: { url: string; isExternal: boolean };
  className: string;
  children: ReactNode;
}) {
  return (
    <a className={className} href={link.url} {...(link.isExternal && { target: "_blank", rel: "noopener noreferrer" })}>
      {children}
    </a>
  );
}

/**
 * Teacher card: 4:5 photo (with an optional availability label) on the left; name, bio, figures,
 * "She teaches" tags, a quote and up to two buttons on the right. Every part hides when it is empty.
 */
export function LandingInstructor({ page }: { page: Page }) {
  const instructor = page?.content?.instructor;
  const figures = instructor?.stats ?? [];
  const teaches = (instructor?.teaches ?? []).filter(hasText);
  const primaryLink = getTeacherLink(instructor?.primaryButton);
  const secondaryLink = getTeacherLink(instructor?.secondaryButton);
  // The page adds the quote marks and the dash, so ones typed by the admin are removed to avoid doubles.
  const quoteText = (instructor?.quote?.text ?? "")
    .trim()
    .replace(/^["“”'‘’]+|["“”'‘’]+$/g, "")
    .trim();
  const quoteAuthor = (instructor?.quote?.author ?? "").trim().replace(/^[—–-]+\s*/, "");
  if (!hasText(instructor?.bio) && !hasText(instructor?.title)) return null;

  return (
    <section className={cn("lp-section", COMMON_SECTION_PADDING)} id="teacher" aria-labelledby="lp-instructor-title">
      <div className="kratika-yoga-container">
        <div className={cn("lp-teacher lp-rv", !instructor?.imageUrl && "lp-teacher-no-photo", COMMON_BORDER_RADIUS)}>
          {instructor?.imageUrl && (
            <div className="lp-teacher-photo">
              <Image
                src={instructor.imageUrl}
                alt={instructor?.title?.replace(/\*/g, "") || "Instructor"}
                fill
                sizes="(max-width: 820px) 100vw, 40vw"
              />
              {hasText(instructor?.availability) && (
                <span className="lp-teacher-availability">
                  <span className="lp-teacher-availability-dot" aria-hidden="true" />
                  {instructor?.availability}
                </span>
              )}
            </div>
          )}
          <div className="lp-teacher-copy">
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
            {teaches.length > 0 && (
              <div className="lp-teacher-teaches">
                {hasText(instructor?.teachesLabel) && (
                  <p className="lp-teacher-teaches-label">{instructor?.teachesLabel}</p>
                )}
                <ul>
                  {teaches.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {hasText(quoteText) && (
              <figure className="lp-teacher-quote">
                <blockquote>“{quoteText}”</blockquote>
                {hasText(quoteAuthor) && <figcaption>— {quoteAuthor}</figcaption>}
              </figure>
            )}
            {(primaryLink || secondaryLink || hasText(instructor?.buttonNote)) && (
              <div className="lp-teacher-actions">
                {primaryLink && (
                  <TeacherLink className="lp-teacher-btn" link={primaryLink}>
                    {primaryLink.label} <ArrowRight size={18} aria-hidden="true" />
                  </TeacherLink>
                )}
                {secondaryLink && (
                  <TeacherLink className="lp-teacher-btn lp-teacher-btn-outline" link={secondaryLink}>
                    {secondaryLink.label}
                  </TeacherLink>
                )}
                {hasText(instructor?.buttonNote) && (
                  <span className="lp-teacher-note">
                    <Clock size={17} aria-hidden="true" /> {instructor?.buttonNote}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** `feedbackImages`: the admin's feedback screenshots (or the built-in ones), shown when switched on. */
// With at least this many written reviews, the course shows them instead of the admin's quotes.
const REAL_REVIEWS_NEEDED = 3;
// How many reviews are shown (the newest first).
const REVIEWS_SHOWN = 3;

export function LandingTestimonials({ page, feedbackImages }: { page: Page; feedbackImages: FeedbackImage[] }) {
  const testimonials = page?.content?.testimonials;
  const adminQuotes = testimonials?.quotes ?? [];
  const reviews = page?.reviews ?? [];
  const showScreenshots = testimonials?.showScreenshots === true;
  if (!showScreenshots && adminQuotes.length === 0 && reviews.length === 0) return null;

  // Real reviews win once the course has enough of them; until then the admin's quotes show
  // (or whatever real reviews there are, when the admin added no quotes).
  const useReviews = reviews.length >= REAL_REVIEWS_NEEDED || adminQuotes.length === 0;
  const quotes = useReviews
    ? reviews.slice(0, REVIEWS_SHOWN).map((review) => ({
        text: review?.comment ?? "",
        name: review?.userName ?? "",
      }))
    : adminQuotes;

  return (
    <section className={cn("lp-section lp-alt", COMMON_SECTION_PADDING)} id="reviews" aria-labelledby="lp-love-title">
      <div className="kratika-yoga-container">
        <SectionHeading
          id="lp-love-title"
          title={hasText(testimonials?.title) ? testimonials?.title : "What students say"}
        />
        {showScreenshots && <FeedbackScreenshots images={feedbackImages} />}
        {quotes.length > 0 && (
          <div className="lp-quotes">
            {quotes.map((quote, index) => (
              <blockquote className={COMMON_BORDER_RADIUS} key={index}>
                “<Txt text={quote?.text} />”{quote?.name && <cite>{quote.name}</cite>}
              </blockquote>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Same layout as the home page FAQ: title on the left (sticky), questions that open with a "+" on the right. */
export function LandingFaq({ page }: { page: Page }) {
  const faq = page?.content?.faq;
  const questions = faq?.items ?? [];
  if (questions.length === 0) return null;

  return (
    <section className={cn("platform-faq lp-faq", COMMON_SECTION_PADDING)} id="faq" aria-labelledby="lp-faq-title">
      <div className="kratika-yoga-container platform-faq-grid">
        <div className="platform-section-intro">
          <h2 id="lp-faq-title">
            <Txt text={hasText(faq?.title) ? faq?.title : "Questions before you begin?"} />
          </h2>
          <p className="lp-lead">
            <Txt text={hasText(faq?.text) ? faq?.text : "A few helpful answers to make your first step feel simple."} />
          </p>
        </div>
        <div className="platform-faq-list">
          {questions.map((item, index) => (
            <details key={index}>
              <summary>
                <Txt text={item?.question} />
                <Plus size={21} aria-hidden="true" />
              </summary>
              <div className="platform-faq-answer">
                <div>
                  <p>
                    <Txt text={item?.answer} />
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

export function LandingFinalCta({ page }: { page: Page }) {
  const finalCta = page?.content?.finalCta;

  return (
    <section className={cn("lp-section lp-deep lp-final", COMMON_SECTION_PADDING)} aria-labelledby="lp-final-title">
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
