import type {
  EssentialProduct,
  FooterColumn,
  FreeCourse,
  NavLink,
  Testimonial,
} from "@/types/landing-content";

export const landingNavLinks: NavLink[] = [
  { label: "Explore all courses", href: "/courses" },
  { label: "Explore all PDF courses", href: "/pdf-courses" },
  { label: "Affiliate products", href: "/affiliate-products" },
  { label: "FAQ", href: "/#faq" },
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
      { label: "FAQ", href: "/#faq" },
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
    image: "course-main",
    title: "10-Minute Gentle Morning Flow",
    description: "Wake up your body with simple movement, energy and calm.",
    metadata: "10 minutes · Beginner",
  },
  {
    image: "lesson-warrior",
    title: "Yoga Foundations for Beginners",
    description: "Learn essential breathing, alignment and movement principles.",
    metadata: "4 lessons · 35 minutes",
  },
  {
    image: "lesson-meditation",
    title: "Release Neck and Shoulder Tension",
    description: "Ease stiffness caused by prolonged sitting and everyday stress.",
    metadata: "15 minutes · All levels",
  },
  {
    image: "lesson-rest",
    title: "Introduction to Breathwork",
    description: "Discover the power of breath to calm the mind and body.",
    metadata: "12 minutes · Beginner",
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
