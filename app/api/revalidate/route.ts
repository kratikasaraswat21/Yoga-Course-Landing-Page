import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

// Called by the backend after an admin change (and at midnight schedule boundaries) so cached
// pages are rebuilt only when their data changes. Body: { "tags": ["courses", "course:<id>"] }.

const TAG_PATTERN = /^[a-z0-9:_-]{1,256}$/i;
const MAX_TAGS = 50;

const isAuthorized = (request: NextRequest) => {
  const expected = process.env.REVALIDATE_SECRET;
  const received = request.headers.get("x-revalidate-secret");
  if (!expected || !received) return false;

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
};

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ revalidated: false, message: "Unauthorized" }, { status: 401 });
  }

  let tags: unknown;
  try {
    ({ tags } = (await request.json()) as { tags?: unknown });
  } catch {
    return Response.json({ revalidated: false, message: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(tags) || tags.length === 0 || tags.length > MAX_TAGS || !tags.every((tag) => typeof tag === "string" && TAG_PATTERN.test(tag))) {
    return Response.json({ revalidated: false, message: "`tags` must be a non-empty list of cache tags" }, { status: 400 });
  }

  // Expire immediately: an external system is telling us the data already changed, so the next
  // visitor should get fresh data rather than one more stale copy.
  for (const tag of new Set(tags as string[])) revalidateTag(tag, { expire: 0 });

  return Response.json({ revalidated: true, tags, now: Date.now() });
}
