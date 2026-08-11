import Image from "next/image";
import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { SignupForm } from "@/features/auth/components/signup-form";

export default function SignupPage() {
  return (
    <main className="login-page signup-page">
      <section className="login-panel" aria-labelledby="signup-title">
        <div className="login-content">
          <Logo />
          <div className="flex flex-1 flex-col justify-center pb-8">
            <div className="login-intro">
              <h1 id="signup-title">Begin your journey</h1>
              <p>Create your account and take the first step towards a more mindful practice.</p>
            </div>

            <SignupForm />

            <div className="signup-prompt">
              <div className="prompt-heading">
                <p>Already have an account?</p>{" "}
                <Link href="/login" className="p-0! m-0! signup-link">
                  Log in
                </Link>{" "}
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="login-visual" aria-label="Yoga practice inspiration">
        <Image
          src="/images/auth/signup-yoga.png"
          alt="Woman practicing yoga in a sunlit room"
          fill
          priority
          sizes="(max-width: 990px) 0px, 48vw"
        />
        <div className="quote-card">
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <div>
            <p className="quote-text">Your practice begins exactly where you are.</p>
            <span className="quote-rule" />
            <p className="quote-caption">Start gently. Grow consistently.</p>
          </div>
        </div>
      </aside>
    </main>
  );
}
