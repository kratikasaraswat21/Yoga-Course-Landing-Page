import axios from "axios";

import { EnvConfig } from "@/lib/config/envConfig";
import { clearLocalSessionStorage, getDataFromSecureCookie } from "@/lib/helper/hepler";
import type { ApiReturnInterface, EndpointObject } from "@/types/api";

const BASE_URL = EnvConfig.API_BASE_URL;

const getUrl = (endPoint: string) => `${BASE_URL.replace(/\/$/, "")}/${endPoint.replace(/^\//, "")}`;

const redirectToLogin = () => {
  if (typeof window === "undefined" || window.location.pathname === "/login") return;

  clearLocalSessionStorage();
  const returnTo = `${window.location.pathname}${window.location.search}`;
  window.location.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
};

const axiosApiErrorHandler = (error: unknown): ApiReturnInterface => {
  if (axios.isAxiosError(error)) {
    return {
      data: error.response?.data,
      error: error.response?.data ?? error.message,
      ok: false,
      status: error.response?.status,
    };
  }

  return { error, ok: false };
};

const fetchEndpoint = async (endpoint: EndpointObject, signal?: AbortSignal): Promise<ApiReturnInterface> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...endpoint.header,
  };

  if (endpoint.protected && !headers.Authorization) {
    const token = getDataFromSecureCookie("authenticationToken");
    if (token) headers.Authorization = `Bearer ${token}`;
    else {
      redirectToLogin();
      return { error: "Authentication required", ok: false, status: 401 };
    }
  }

  try {
    const response = await axios({
      data: endpoint.data,
      headers,
      method: endpoint.method ?? "GET",
      signal,
      url: getUrl(endpoint.endPoint),
    });

    return {
      data: response.data,
      ok: true,
      status: response.status,
    };
  } catch (error) {
    const result = axiosApiErrorHandler(error);
    if (endpoint.protected && [401, 403, 404].includes(result.status ?? 0)) redirectToLogin();
    return result;
  }
};

export const multipleApiHandler = async (
  endPointArr: EndpointObject[],
  signal?: AbortSignal,
): Promise<ApiReturnInterface[]> => Promise.all(endPointArr.map((endpoint) => fetchEndpoint(endpoint, signal)));
