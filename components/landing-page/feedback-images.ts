import type { StaticImageData } from "next/image";

import feedback1 from "@/assets/images/insta-feed-back/insta-feed-back-1.webp";
import feedback2 from "@/assets/images/insta-feed-back/insta-feed-back-2.webp";
import feedback3 from "@/assets/images/insta-feed-back/insta-feed-back-3.webp";
import feedback4 from "@/assets/images/insta-feed-back/insta-feed-back-4.webp";
import feedback5 from "@/assets/images/insta-feed-back/insta-feed-back-5.webp";
import feedback6 from "@/assets/images/insta-feed-back/insta-feed-back-6.webp";
import feedback7 from "@/assets/images/insta-feed-back/insta-feed-back-7.webp";
import { getInstagramFeedbackImages } from "@/lib/api/landing-instagram-feedback";

export interface FeedbackImage {
  key: string;
  src: string | StaticImageData;
  alt: string;
}

// Built-in screenshots, shown until the admin uploads some in the admin panel (Instagram Feedback).
const BUILT_IN_FEEDBACK_IMAGES: FeedbackImage[] = [
  feedback1,
  feedback2,
  feedback3,
  feedback4,
  feedback5,
  feedback6,
  feedback7,
].map((image, index) => ({ key: image.src, src: image, alt: `Student feedback ${index + 1}` }));

/** The admin's feedback screenshots, or the built-in ones when none are uploaded (or the API is down). */
export async function getFeedbackImages(): Promise<FeedbackImage[]> {
  const images = await getInstagramFeedbackImages();
  if (images.length === 0) return BUILT_IN_FEEDBACK_IMAGES;

  return images.map((image, index) => ({
    key: image.id,
    src: image.imageUrl,
    alt: image.altText?.trim() || `Student feedback ${index + 1}`,
  }));
}
