"use client";

import logo from "@/assets/images/logo/logo.png";

import Image from "next/image";
import { useEffect, useState } from "react";

const loadingMessages = [
  "Creating a little space for your practice…",
  "Gathering your courses and progress…",
  "Preparing something calm and useful…",
  "Almost ready to move with you…",
];

export function DashboardLoading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % loadingMessages.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="dashboard-loading" aria-label="Loading your Kratika Yoga dashboard" role="status">
      <div className="dashboard-loading-card">
        <div className="dashboard-loading-mark">
          <span />
          <Image src={logo} alt="Kratika Yoga" width={72} height={72} priority />
        </div>
        <p className="dashboard-loading-kicker">KRATIKA YOGA</p>
        <p className="dashboard-loading-message" key={messageIndex}>
          {loadingMessages[messageIndex]}
        </p>
        <div className="dashboard-loading-progress" aria-hidden="true">
          <span />
        </div>
        <p className="dashboard-loading-caption">Your practice is worth taking a moment for.</p>
      </div>
    </main>
  );
}
