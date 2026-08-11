import Image from "next/image";
import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ signature?: string; email?: string }>;
}) {
  const { signature = "", email = "" } = await searchParams;

  return (
    <main className="login-page verify-email-page">
      <section className="login-panel" aria-labelledby="verify-email-title">
        <div className="login-content h-full">
          <Logo />

          <div className="flex flex-1 flex-col justify-center pb-8">
            <Link
              href="/signup"
              className="inline-flex w-fit items-center gap-2 text-base font-medium text-[#213D34] transition hover:text-[#A86449]">
              <span aria-hidden="true">←</span> Back
            </Link>

            <div className="mt-10">
              <h1
                id="verify-email-title"
                className="m-0 font-serif text-[clamp(40px,4vw,56px)] font-medium leading-[1.1] tracking-[-0.035em] text-[#213D34]">
                Verify your email
              </h1>
              <p className="mt-4 max-w-[600px] text-lg leading-6 text-[#66716D]">
                We’ve sent a 6-digit verification code to {email || "your email address"}.
              </p>
            </div>

            <VerifyEmailForm email={signature} />
          </div>
        </div>
      </section>

      <aside className="login-visual" aria-label="Yoga practice inspiration">
        <Image
          src="/images/auth/verify-email-yoga.png"
          alt="Woman practicing a calm forward fold in a warm sunlit yoga studio"
          fill
          priority
          sizes="(max-width: 990px) 0px, 48vw"
        />
        <div className="quote-card bottom-[80%]!">
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <div>
            <p className="quote-text">Pause. Breathe. Begin again.</p>
            <span className="quote-rule" />
            <p className="quote-caption">Small moments of presence create lasting change.</p>
          </div>
        </div>
      </aside>
    </main>
  );
}
