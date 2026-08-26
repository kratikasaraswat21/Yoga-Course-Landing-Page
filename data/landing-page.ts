import type { EssentialProduct, FooterColumn, FreeCourse, NavLink, Testimonial } from "@/types/landing-content";

export const landingNavLinks: NavLink[] = [
  { label: "Explore all courses", href: "/courses" },
  { label: "Explore all PDF courses", href: "/pdf-courses" },
  { label: "Affiliate products", href: "/affiliate-products" },
  { label: "FAQ", href: "/faq" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Explore",
    links: [
      { label: "Our method", href: "/#about" },
      { label: "Explore classes", href: "/#classes" },
      { label: "Free practice", href: "/#free-courses" },
      { label: "Testimonials", href: "/#testimonials" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Courses", href: "/courses" },
      { label: "PDF programs", href: "/pdf-courses" },
      { label: "Recommended essentials", href: "/#essentials" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Kratika Yoga", href: "/#about" },
      { label: "Contact", href: "mailto:hello@kratikayoga.com" },
      { label: "Sitemap", href: "/sitemap" },
      { label: "Privacy policy", href: "/privacy-policy" },
    ],
  },
  {
    title: "Start here",
    links: [
      { label: "Find your course", href: "/#course-library" },
      { label: "Try a free practice", href: "/#free-courses" },
    ],
  },
];

export const aboutPrinciples = [
  ["01", "Move with awareness", "Understand your body and move with greater confidence."],
  ["02", "Progress without pressure", "Follow a pace that feels sustainable and supportive."],
  ["03", "Practice with purpose", "Build a meaningful practice that fits into your life."],
] as const;

export const freeCourses: FreeCourse[] = [
  {
    image: "/free-course/1.webp",
    title: "12 Min. Mobility Routine for Hips & Spine",
    description:
      "Feeling stiff after sitting all day? This 12-minute mobility routine for hips & spine helps release tension and stretch tight muscles — no mat, no equipment needed. A gentle at-home yoga flow to unlock stiffness in your hips and spine, leaving you loose, mobile, and relaxed. Perfect for morning wake-ups, work breaks, or winding down before bed.",
    metadata: "Release Tension & Stretch Tight Muscles",
    link: "https://www.youtube.com/watch?v=pVKsAwkGCv0",
  },
  {
    image: "/free-course/2.webp",
    title: "10 Min. Morning Mobility Routine for All Levels",
    description: `Morning Mobility Routine | Daily Stretch for Flexibility | Full Body Mobility Flow | At Home Yoga for All Levels

Start your day with this 10 minute morning mobility routine specially designed for beginners to improve flexibility, mobility, posture, and body awareness. This daily stretch for flexibility includes gentle full body stretching, at home yoga, mobility exercises, and relaxing movement to help release tension in the neck, shoulders, spine, hips, hamstrings, and lower back.

This all levels mobility flow is perfect for your morning yoga routine, daily movement practice, or full body stretch at home. Breathe deeply, move mindfully, and enjoy this quick mobility workout to feel more open, energized, and refreshed.`,
    metadata: "Daily Stretch for Flexibility",
    link: "https://www.youtube.com/watch?v=UlCFj6vIT40",
  },
  {
    image: "/free-course/3.webp",
    title: "15 Minute Lower Body Stretch Routine ",
    description: `This 15-minute lower body stretch routine is designed to release tension from your hips, hamstrings, glutes, and lower back — a relaxing at-home yoga flow for flexibility and recovery.

Whether you're stretching after a workout, unwinding after a long day of sitting, or just want to improve your hip mobility and lower body flexibility, this gentle yoga stretch routine will help you feel looser, calmer, and more relaxed in just 15 minutes.

This flow includes deep hip openers, hamstring stretches, glute stretches, and gentle twists to release stiffness and improve range of motion — perfect as a post-workout stretch, an evening wind-down routine, or a way to ease tightness from sitting all day.`,
    metadata: "Release Tension from Hips, Hamstrings & Glutes at Home",
    link: "https://www.youtube.com/watch?v=Kesu6nARTX4",
  },
  {
    image: "/free-course/4.webp",
    title: "Morning Full Body Stretch for Flexibility & Mobility",
    description: `15 Min Yoga for Women | Morning Full Body Stretch for Flexibility & Mobility
Start your morning the right way! This 15-minute yoga routine for women is designed to gently stretch and awaken your entire body — improving flexibility, relieving stiffness, and boosting mobility from head to toe. Whether you're in your 20s, 30s, 40s, or 50s+, this full body morning stretch is perfect for all fitness levels. No equipment needed — just your mat and 15 minutes!
Do this every morning and feel the difference in how your body moves, feels, and flows throughout the day.`,
    metadata: "20 Mins Yoga for WOMEN",
    link: "https://www.youtube.com/watch?v=PPLmMWaDPvo",
  },
  {
    image: "/free-course/5.webp",
    title: "20 Minute Gentle Neck & Shoulder Stretching Routine",
    description: `15 Min Yoga for Women | Morning Full Body Stretch for Flexibility & Mobility
Start your morning the right way! This 15-minute yoga routine for women is designed to gently stretch and awaken your entire body — improving flexibility, relieving stiffness, and boosting mobility from head to toe. Whether you're in your 20s, 30s, 40s, or 50s+, this full body morning stretch is perfect for all fitness levels. No equipment needed — just your mat and 15 minutes!
Do this every morning and feel the difference in how your body moves, feels, and flows throughout the day.`,
    metadata: "Release Tension & Feel Better",
    link: "https://www.youtube.com/watch?v=dOuHTNk6x8Q",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Ananya Sharma",
    course: "Yoga Foundations for Beginners",
    rating: 5,
    content:
      "The sessions made yoga feel approachable and helped me build a practice I can actually stay consistent with.",
  },
  {
    name: "Rohan Mehta",
    course: "Morning Mobility Flow",
    rating: 4,
    content:
      "Clear guidance, thoughtful pacing and just the right amount of challenge. I feel more open every morning.",
  },
  {
    name: "Meera Kapoor",
    course: "Flexibility and Balance",
    rating: 5,
    content:
      "I stopped worrying about doing every pose perfectly. The course helped me move with much more confidence.",
  },
  {
    name: "Priya Nair",
    course: "Restorative Yoga",
    rating: 5,
    content: "The gentle guidance helped me slow down, breathe more deeply and make space for a consistent practice.",
  },
  {
    name: "Arjun Malhotra",
    course: "Morning Mobility Flow",
    rating: 4,
    content: "The sessions are easy to follow and fit naturally into my mornings. I feel more mobile every week.",
  },
];

export const essentialProducts: EssentialProduct[] = [
  { title: "Yoga Mat", description: "A supportive non-slip mat for daily home practice.", action: "View on Amazon" },
  {
    title: "Yoga Blocks",
    description: "Helpful support for flexibility, balance and beginner-friendly alignment.",
    action: "View on Flipkart",
  },
  {
    title: "Meditation Cushion",
    description: "Comfortable seating for breathing, reflection and slower practices.",
    action: "View on Amazon",
  },
  {
    title: "Resistance Band",
    description: "Simple support for mobility, warmups and gentle strength work.",
    action: "View on Flipkart",
  },
];

export const faqQuestions = [
  "Are the courses suitable for complete beginners?",
  "How long will I have access to a purchased course?",
  "Can I practise using my phone, tablet or television?",
  "Can I download the course videos?",
  "How do I access a purchased PDF?",
  "Do I need yoga equipment?",
  "Are the recommended products sold by Kratika Yoga?",
  "What is the refund policy?",
];
