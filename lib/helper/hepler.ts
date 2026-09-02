import { CookieConfigInterface } from "@/types/helper.interface";
import { clsx, type ClassValue } from "clsx";
import Cookies from "js-cookie";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getCookieConfig = (): CookieConfigInterface => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    // Local development runs on http://localhost, where Secure cookies are blocked.
    secure: isProduction,
    sameSite: "Lax",
    path: "/",
    // Let the browser use the current host locally; scope the cookie in production.
    ...(isProduction ? { domain: "kratikayoga.com" } : {}),
    expires: 30,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDataFromSecureCookie = (key: string): any | null => {
  try {
    const cookieStorageData = Cookies.get(key);

    if (!cookieStorageData) return null;

    return JSON.parse(cookieStorageData);
  } catch (error) {
    console.error(`Error reading from cookie (key: ${key}):`, error);
    return null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const storeDataInSecureCookie = (_data: any, key: string, is_persistent: boolean, expire?: number) => {
  if (!key) {
    console.error("the key is required to store the data");
    return;
  }

  const cookieConfig = getCookieConfig();

  const dataToStore = JSON.stringify(_data);

  if (is_persistent === true) {
    cookieConfig.expires = expire && expire > 0 ? expire : 30;
  }

  Cookies.set(key, dataToStore, cookieConfig);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDataFromSessionStorage = (key: string): any | null => {
  if (typeof window === "undefined") return null;

  try {
    const sessionStorageData = sessionStorage.getItem(key);
    return sessionStorageData ? JSON.parse(sessionStorageData) : null;
  } catch (error) {
    console.error(`Error reading from sessionStorage (key: ${key}):`, error);
    return null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const storeDataInSessionStorage = (_data: any, key: string) => {
  if (!key || typeof window === "undefined") return;

  try {
    sessionStorage.setItem(key, JSON.stringify(_data));
  } catch (error) {
    console.error(`Error writing to sessionStorage (key: ${key}):`, error);
  }
};

export const removeDataFromSecureCookie = (key: string) => {
  if (!key) return;
  Cookies.remove(key, getCookieConfig());
};

export const removeDataFromSessionStorage = (key: string) => {
  if (!key || typeof window === "undefined") return;
  sessionStorage.removeItem(key);
};

export const getAuthToken = (key: string) =>
  getDataFromSecureCookie(key) ?? getDataFromSessionStorage(key);

export const clearLocalSessionStorage = () => {
  localStorage.clear();
  sessionStorage.clear();

  const cookieConfig: CookieConfigInterface = getCookieConfig();
  Object.keys(Cookies.get()).forEach((cookieName) => {
    Cookies.remove(cookieName, cookieConfig);
  });
};

export const getRemainingCountDownSeconds = (availableAt: number) =>
  Math.max(0, Math.ceil((availableAt - Date.now()) / 1000));

export const formatCountDownTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

export const isValidUrl = (value: string) => {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  try {
    const url = new URL(value.trim());

    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};
