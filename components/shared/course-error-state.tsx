import { ArrowLeft, LockKeyhole } from "lucide-react";
import Link from "next/link";

export function CourseErrorState({ message, onRetry }: { message?: string; onRetry: () => void }) {
  const isAccessRevoked = /revoked|access/i.test(message ?? "");

  return (
    <div className="course-error-page">
      <div className="course-error-card" role="alert">
        <div className="course-error-icon" aria-hidden="true"><LockKeyhole size={28} /></div>
        <p className="course-error-eyebrow">Course unavailable</p>
        <h1>{isAccessRevoked ? "Your course access has been revoked" : "We couldn’t open this course"}</h1>
        <p className="course-error-message">
          {isAccessRevoked ? "You no longer have access to this course. Please contact support if you think this is a mistake." : message || "This course could not be found. Please try again or return to the home page."}
        </p>
        <div className="course-error-actions">
          <button type="button" onClick={onRetry}>Try again</button>
          <Link href="/dashboard"><ArrowLeft size={17} aria-hidden="true" /> Return home</Link>
        </div>
      </div>
    </div>
  );
}
