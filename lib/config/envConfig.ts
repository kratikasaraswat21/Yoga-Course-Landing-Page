export const EnvConfig = {
  // NEXT_PUBLIC_ENVIRONMENT: "development" (default) or "production".
  CURRENT_ENVIRONMENT:
    (process.env.NEXT_PUBLIC_ENVIRONMENT ?? "development").trim().toLowerCase() === "production"
      ? "PRODUCTION"
      : "DEVELOPMENT",
  OWNER_NAME: "Varun Patel",
  API_BASE_URL: (process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? "").trim().replace(/\/$/, ""),
  RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
};
