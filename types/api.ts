export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface EndpointObject {
  endPoint: string;
  method?: ApiMethod;
  protected?: boolean;
  header?: Record<string, string>;
  data?: unknown;
}

export interface CommonDataFormat {
  message: string;
  success: boolean;
  // API payloads have endpoint-specific shapes.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export interface ApiReturnInterface {
  data?: CommonDataFormat;
  error?: unknown;
  status?: number;
  ok: boolean;
}
