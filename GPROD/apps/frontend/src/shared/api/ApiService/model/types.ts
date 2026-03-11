import type NotJsonResponseError from '@/app/Error/classes/NotJsonResponseError';
import type ParseJsonError from '@/app/Error/classes/ParseJsonError';
import type TokenExpiredError from '@/app/Error/classes/TokenExpiredError';

export type KnownErrorApiType = Error | NotJsonResponseError | ParseJsonError | TokenExpiredError;

export type ApiDataType<T> = {
  result?: T;
};

export type ApiErrorType<T> = {
  errors?: T;
};

export type PageErrorsType = {
  message?: string;
  fields?: Record<string, { key: string; msg: string; params: unknown }>;
};
