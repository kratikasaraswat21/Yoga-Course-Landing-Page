import Image from "next/image";
import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { loginYoga } from "@/assets/image-assets";
import { LoginForm } from "@/features/auth/components/login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo } = await searchParams;

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-content">
          <Logo />
          <div className="flex flex-1 flex-col justify-center pb-8">
            <div className="login-intro">
              <h1 id="login-title">Welcome back</h1>
              <p>Continue your yoga journey and return to your practice.</p>
            </div>

            <LoginForm returnTo={returnTo} />

            <div className="signup-prompt">
              <div className="prompt-heading">
                <p>New to Kratika Yoga?</p>{" "}
                <Link href={returnTo ? `/signup?returnTo=${encodeURIComponent(returnTo)}` : "/signup"} className="p-0! m-0! signup-link">
                  Create an account
                </Link>{" "}
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="login-visual" aria-label="Yoga practice inspiration">
        <Image
          src={loginYoga}
          alt="Woman meditating in a sunlit yoga room"
          fill
          priority
          sizes="(max-width: 767px) 100vw, 48vw"
        />
        <div className="quote-card">
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <div>
            <p className="quote-text">A calmer mind begins with one intentional breath.</p>
            <span className="quote-rule" />
            <p className="quote-caption">Practice at your pace, wherever you are.</p>
          </div>
        </div>
      </aside>
    </main>
  );
}
