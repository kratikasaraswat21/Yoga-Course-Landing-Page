import Image from "next/image";
import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { forgotPasswordYoga } from "@/assets/image-assets";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="login-page forgot-password-page">
      <section className="login-panel" aria-labelledby="forgot-password-title">
        <div className="login-content h-full">
          <Logo />

          <div className="flex flex-1 flex-col justify-center pb-8">
            <Link
              href="/login"
              className="inline-flex w-fit items-center gap-2 text-base font-medium text-[#213D34] transition hover:text-[#A86449]">
              <span aria-hidden="true">←</span> Back to login
            </Link>

            <div className="mt-10">
              <h1
                id="forgot-password-title"
                className="m-0 font-serif text-[clamp(40px,4vw,56px)] font-medium leading-[1.1] tracking-[-0.035em] text-[#213D34]">
                Forgot your password?
              </h1>
              <p className="mt-4 max-w-[560px] text-lg leading-7 text-[#66716D]">
                Enter your registered email address and we’ll send you a secure password reset link.
              </p>
            </div>

            <ForgotPasswordForm />

            <div className="mt-14 flex flex-col items-center gap-3 text-base text-[#66716D]">
              <div className="flex w-full items-center gap-6 justify-center">
                <p className="m-0 whitespace-nowrap">Remembered your password?</p>{" "}
                <Link href="/login" className="font-semibold text-[#213D34] hover:text-[#172E27]">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="login-visual" aria-label="Yoga practice inspiration">
        <Image
          src={forgotPasswordYoga}
          alt="Woman practicing a seated side stretch in a warm sunlit yoga studio"
          fill
          priority
          sizes="(max-width: 990px) 0px, 48vw"
        />
        <div className="quote-card">
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <div>
            <p className="quote-text">Return to yourself, one breath at a time.</p>
            <span className="quote-rule" />
            <p className="quote-caption">Your practice will be waiting for you.</p>
          </div>
        </div>
      </aside>
    </main>
  );
}
