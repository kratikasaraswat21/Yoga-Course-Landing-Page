import Image from "next/image";
import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-content">
          <Logo />
          <div className="login-intro">
            <h1 id="login-title">Welcome back</h1>
            <p>Continue your yoga journey and return to your practice.</p>
          </div>

          <LoginForm />

          <div className="signup-prompt">
            <div className="prompt-heading">
              <span /> <p>New to Kratika Yoga?</p> <span />
            </div>
            <Link href="#create-account" className="text-link signup-link">
              Create an account
            </Link>
          </div>

          <footer className="login-footer">
            <Link href="#privacy">Privacy Policy</Link>
            <span aria-hidden="true">|</span>
            <Link href="#terms">Terms of Service</Link>
          </footer>
        </div>
      </section>

      <aside className="login-visual" aria-label="Yoga practice inspiration">
        <Image
          src="/images/auth/login-yoga.png"
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
