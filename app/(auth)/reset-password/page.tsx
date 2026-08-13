import Image from "next/image"
import Link from "next/link"

import { Logo } from "@/components/shared/logo"
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token = "" } = await searchParams

  return (
    <main className="login-page reset-password-page">
      <section className="login-panel" aria-labelledby="reset-password-title">
        <div className="login-content h-full">
          <Logo />

          <div className="flex flex-1 flex-col justify-center pb-8">
            <Link
              href="/login"
              className="inline-flex w-fit items-center gap-2 text-base font-medium text-[#213D34] transition hover:text-[#A86449]"
            >
              <span aria-hidden="true">←</span> Back to login
            </Link>

            <div className="mt-10">
              <h1
                id="reset-password-title"
                className="m-0 font-serif text-[clamp(40px,4vw,56px)] font-medium leading-[1.1] tracking-[-0.035em] text-[#213D34]"
              >
                Reset your password
              </h1>
              <p className="mt-4 max-w-[560px] text-lg leading-7 text-[#66716D]">
                Create a new password to keep your Kratika Yoga account secure.
              </p>
            </div>

            <ResetPasswordForm token={token} />

            <div className="mt-12 flex justify-center text-base text-[#66716D]">
              Remembered your password?{" "}
              <Link href="/login" className="ml-1 font-semibold text-[#213D34] hover:text-[#172E27]">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <aside className="login-visual" aria-label="Yoga practice inspiration">
        <Image
          src="/images/auth/forgot-password-yoga.png"
          alt="Woman practicing a seated side stretch in a warm sunlit yoga studio"
          fill
          priority
          sizes="(max-width: 990px) 0px, 48vw"
        />
        <div className="quote-card">
          <span className="quote-mark" aria-hidden="true">“</span>
          <div>
            <p className="quote-text">A fresh start begins with one gentle step.</p>
            <span className="quote-rule" />
            <p className="quote-caption">Create space for what comes next.</p>
          </div>
        </div>
      </aside>
    </main>
  )
}
