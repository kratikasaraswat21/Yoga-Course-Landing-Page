import { Footer } from "@/components/landing-page/footer";
import { Navbar } from "@/components/landing-page/navbar";

export default function PrivacyPolicyPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <main className="simple-site-page legal-page">
        <div className="kratika-yoga-container">
          <article>
            <p className="legal-page-eyebrow">Last updated: 22 August 2026</p>
            <h1>Privacy policy</h1>
            <p className="legal-page-intro">
              This Privacy Policy explains how Kratika Yoga collects, uses, stores and shares information when you visit our website, create an account, purchase a course or use our services.
            </p>

            <section>
              <h2>1. Who we are</h2>
              <p>
                Kratika Yoga (“Kratika Yoga”, “we”, “us” or “our”) provides online yoga courses, guided practices, PDF programs and related recommendations. If you have questions about this policy or how we use your information, contact us at <a href="mailto:hello@kratikayoga.com">hello@kratikayoga.com</a>.
              </p>
            </section>

            <section>
              <h2>2. Information we collect</h2>
              <p>Depending on how you use the website, we may collect:</p>
              <ul>
                <li><strong>Account information:</strong> your name, email address, password and account preferences.</li>
                <li><strong>Order and payment information:</strong> details about the courses or products you purchase, transaction references and billing information. Payment card details are processed by our payment providers and are not stored by Kratika Yoga.</li>
                <li><strong>Usage information:</strong> courses viewed, lessons completed, downloads, favourites and interactions with the website.</li>
                <li><strong>Technical information:</strong> IP address, browser type, device information, operating system, approximate location and website activity.</li>
                <li><strong>Messages and support information:</strong> information you provide when you contact us or request help.</li>
                <li><strong>Marketing preferences:</strong> your choices about receiving emails and other updates from us.</li>
              </ul>
              <p>
                Please do not submit medical records or sensitive health information through the website. Yoga content is general educational material and is not a substitute for medical advice.
              </p>
            </section>

            <section>
              <h2>3. How we use your information</h2>
              <p>We use information to:</p>
              <ul>
                <li>create and manage your account;</li>
                <li>process purchases and provide access to courses and digital programs;</li>
                <li>deliver customer support and respond to enquiries;</li>
                <li>personalise and improve our content, website and services;</li>
                <li>send service messages, such as purchase confirmations, account notices and important updates;</li>
                <li>send marketing communications where permitted and according to your preferences;</li>
                <li>protect the website, prevent fraud and enforce our terms; and</li>
                <li>meet legal, tax, accounting and regulatory obligations.</li>
              </ul>
            </section>

            <section>
              <h2>4. Cookies and similar technologies</h2>
              <p>
                We may use cookies and similar technologies to keep you signed in, remember preferences, understand how the website is used and improve performance. Some cookies may be placed by service providers that help us operate analytics, payments, video playback or security features.
              </p>
              <p>
                You can control cookies through your browser settings. Disabling essential cookies may prevent parts of the website from working correctly.
              </p>
            </section>

            <section>
              <h2>5. When we share information</h2>
              <p>We may share limited information with:</p>
              <ul>
                <li>service providers that support hosting, authentication, payments, email, analytics, customer support and security;</li>
                <li>professional advisers, insurers or auditors where reasonably necessary;</li>
                <li>authorities or other parties where required by law or needed to protect rights, safety and security; and</li>
                <li>a buyer or successor if Kratika Yoga is involved in a merger, sale, restructuring or transfer of assets.</li>
              </ul>
              <p>We do not sell your personal information.</p>
            </section>

            <section>
              <h2>6. Third-party links and services</h2>
              <p>
                Our website may link to third-party websites, social media platforms, video services and recommended products. Those services have their own privacy policies, and we are not responsible for their practices. Please review their policies before providing information or making a purchase.
              </p>
            </section>

            <section>
              <h2>7. International transfers</h2>
              <p>
                Our service providers may process information in countries other than the country where you live. Where required, we use appropriate safeguards for international transfers and handle information in accordance with applicable data-protection law.
              </p>
            </section>

            <section>
              <h2>8. How long we keep information</h2>
              <p>
                We keep information only for as long as reasonably necessary for the purposes described in this policy, including to provide services, maintain business and financial records, resolve disputes, enforce agreements and meet legal obligations. When information is no longer needed, we delete it or securely anonymise it.
              </p>
            </section>

            <section>
              <h2>9. Your choices and rights</h2>
              <p>
                Depending on where you live, you may have the right to request access to, correction or deletion of your personal information, restriction or objection to certain processing, a copy of information in a portable format, or withdrawal of consent where processing is based on consent.
              </p>
              <p>
                You can unsubscribe from marketing emails by using the unsubscribe link in the message or by contacting us. To exercise a privacy right, email <a href="mailto:hello@kratikayoga.com">hello@kratikayoga.com</a>. We may need to verify your identity before completing a request. You may also have the right to complain to your local data-protection authority.
              </p>
            </section>

            <section>
              <h2>10. Security</h2>
              <p>
                We use reasonable technical and organisational measures designed to protect personal information from unauthorised access, loss, misuse or alteration. No online service can be guaranteed completely secure, so please use a strong, unique password and keep your account details confidential.
              </p>
            </section>

            <section>
              <h2>11. Children’s privacy</h2>
              <p>
                Our services are not directed to children under 13, or the minimum age required in your country. We do not knowingly collect personal information from children. If you believe a child has provided information to us, contact us so that we can review and delete it where appropriate.
              </p>
            </section>

            <section>
              <h2>12. Changes to this policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will post the updated version on this page and change the “Last updated” date. If a change is material, we may provide additional notice where required by law.
              </p>
            </section>

            <section>
              <h2>13. Contact us</h2>
              <p>
                For privacy questions, requests or complaints, contact Kratika Yoga at <a href="mailto:hello@kratikayoga.com">hello@kratikayoga.com</a>.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
