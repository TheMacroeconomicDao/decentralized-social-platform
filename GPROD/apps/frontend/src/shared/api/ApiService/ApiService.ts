/* eslint-disable @conarti/feature-sliced/layers-slices */
import NotJsonResponseError from '@/app/Error/classes/NotJsonResponseError';
import ParseJsonError from '@/app/Error/classes/ParseJsonError';
import TokenExpiredError from '@/app/Error/classes/TokenExpiredError';
import UnknownResponseError from '@/app/Error/classes/UnknownResponseError';
import { localStorageService } from '../../storages/localStorageService';
import { urlApiHelper } from './helpers/urlApiHelpers';
import { ErrorResponseStatus } from './model/const';
import { type ApiDataType } from './model/types';

class ApiService {
  private static getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${localStorageService.get('access_token')}`,
      'AcceptLanguage': localStorageService.get('language') || 'RU',
      'Content-Type': 'application/json',
    };
  }

  static async GET<T>(uri: string, params?: unknown): Promise<ApiDataType<T>> {
    const url = urlApiHelper(uri, params);

    const response = await fetch(url, {
      method: 'GET',
      headers: ApiService.getHeaders(),
    });

    if (response.headers.get('content-type') !== 'application/json') {
      throw new NotJsonResponseError();
    }

    let json = null;

    try {
      json = await response.json();
    } catch (e) {
      throw new ParseJsonError((e as Error).message);
    }

    if (Object.values(ErrorResponseStatus).includes(response?.status)) {
      // throw prepareError(json);
      throw json;
    }

    if (response?.status === 429) {
      throw new TokenExpiredError();
    }

    if (response?.ok) {
      return json as ApiDataType<T>;
    }

    throw new UnknownResponseError();
  }

  static async makeFetch<T>(
    method: string,
    uri: string,
    payload: unknown,
    params?: unknown
  ): Promise<ApiDataType<T>> {
    const url = urlApiHelper(uri, params);
    const body = JSON.stringify(payload);

    const response = await fetch(url, {
      method,
      body,
      headers: ApiService.getHeaders(),
    });

    if (response.headers.get('content-type') !== 'application/json') {
      throw new NotJsonResponseError();
    }

    let json = null;

    try {
      json = await response.json();
    } catch (e) {
      throw new ParseJsonError((e as Error).message);
    }

    if (Object.values(ErrorResponseStatus).includes(response?.status)) {
      throw json;
    }

    if (response?.status === 429) {
      throw new TokenExpiredError();
    }

    if (response?.ok) {
      return json as ApiDataType<T>;
    }

    throw new UnknownResponseError();
  }

  static async POST<T>(uri: string, payload: unknown, params?: unknown) {
    return await ApiService.makeFetch<T>('POST', uri, payload, params);
  }
}

export default ApiService;
