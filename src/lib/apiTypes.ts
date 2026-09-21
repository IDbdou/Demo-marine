export type ApiSuccess = { ok: true; reference: string };

export type ApiErrorCode =
  | "validation"
  | "duplicate"
  | "too_large"
  | "rate_limited"
  | "closed_before"
  | "closed_after"
  | "origin"
  | "server";

export type ApiError = {
  ok: false;
  code: ApiErrorCode;
  message: string;
  fieldErrors?: Record<string, string>;
};

export type ApiResponse = ApiSuccess | ApiError;

export const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  validation: 400,
  duplicate: 409,
  too_large: 413,
  rate_limited: 429,
  closed_before: 403,
  closed_after: 403,
  origin: 403,
  server: 500,
};
