import { Plus } from "lucide-react";

import { Footer } from "@/components/landing-page/footer";
import { Navbar } from "@/components/landing-page/navbar";
import { faqQuestions } from "@/data/landing-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Frequently asked questions", "Find answers about Kratika Yoga courses, access, payments, PDF programs and practising across your devices.", "/faq");

const faqAnswers = [
  "Yes. Our courses are designed to be clear and welcoming for complete beginners, with options to practise at your own pace.",
  "You can access a purchased course for the period described on its course page or at checkout. Your access details are available in your account.",
  "Yes. Kratika Yoga is designed to work across modern phones, tablets, laptops and desktop browsers with a stable internet connection.",
  "Course access is provided through the website unless a particular product explicitly says that downloads are included.",
  "Purchased PDF programs are available through your account after payment has been confirmed. Check your email or contact us if you need help.",
  "You can begin with a comfortable surface and clothing that allows you to move freely. Props are optional unless a course says otherwise.",
  "Some recommended products are shared through third-party retailers or affiliate links. Kratika Yoga does not fulfil those orders directly.",
  "For questions about refunds, please review the applicable purchase terms or contact us at hello@kratikayoga.com with your order details.",
];

export default function FaqPage() {
  return (
    <div className="landing-page standalone-faq-page">
      <Navbar />
      <main className="landing-page">
        <section className="platform-faq standalone-faq" id="faq">
            <div className="kratika-yoga-container platform-faq-grid">
            <div className="platform-section-intro">
              <h1>Questions before you begin?</h1>
              <p>A few helpful answers to make your first step feel simple.</p>
            </div>
            <div className="platform-faq-list">
              {faqQuestions.map((question, index) => (
                <details key={question}>
                  <summary>
                    {question}
                    <Plus size={21} aria-hidden="true" />
                  </summary>
                  <p>{faqAnswers[index]}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
