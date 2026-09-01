import Image from "next/image";
import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import signupYoga from "@/assets/images/auth/signup-yoga.webp";
import { SignupForm } from "@/features/auth/components/signup-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Create your account", "Create your Kratika Yoga account and take the first step towards a more mindful practice.", "/signup");

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo } = await searchParams;

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

            <SignupForm returnTo={returnTo} />

            <div className="signup-prompt">
              <div className="prompt-heading">
                <p>Already have an account?</p>{" "}
                <Link href={returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login"} className="p-0! m-0! signup-link">
                  Log in
                </Link>{" "}
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="login-visual" aria-label="Yoga practice inspiration">
        <Image
          src={signupYoga}
          alt="Woman practicing yoga in a sunlit room"
          fill
          priority
          
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
