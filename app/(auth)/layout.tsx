"use client";

import { getDataFromSecureCookie } from "@/lib/helper/hepler";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, Suspense, useEffect, useState } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthSessionGuard>{children}</AuthSessionGuard>
    </Suspense>
  );
}

function AuthSessionGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const token = getDataFromSecureCookie("yoga_platform_auth_token");

    if (token) {
      const returnTo = searchParams.get("returnTo");
      const destination = returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/dashboard";
      router.replace(destination);
      return;
    }

    setIsCheckingSession(false);
  }, [router, searchParams]);

  if (isCheckingSession) return null;

  return children;
}
