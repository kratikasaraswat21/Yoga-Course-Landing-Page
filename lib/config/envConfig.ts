export const EnvConfig = {
  CURRENT_ENVIRONMENT: "DEVELOPMENT",
  OWNER_NAME: "Varun Patel",
  API_BASE_URL: (process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? "").trim().replace(/\/$/, ""),
  RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
};
