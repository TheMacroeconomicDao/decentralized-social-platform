import { envConfig } from '../../../config/envConfig';

export const urlApiHelper = (uri: string, params?: unknown): string => {
  let finalUrl = `${envConfig.BASE_URL}${uri}`;

  if (params) {
    const searchParamsString = new URLSearchParams(params as URLSearchParams)
      .toString()
      .replace('%2C', ',');

    finalUrl = `${finalUrl}?${searchParamsString}`;
  }

  return finalUrl;
};
