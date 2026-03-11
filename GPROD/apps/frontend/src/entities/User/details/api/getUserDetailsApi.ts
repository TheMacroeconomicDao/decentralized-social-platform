// import ApiService from '@/shared/api/ApiService/ApiService';
// import type { UserDetailsDataType } from '../model/type';
import MockApiService from '@/shared/api/MockApiService/MockApiService';
// import json from './__json__/details/error_422_fieldErrors.json';
import json from './__json__/details/success_200.json';

export const getUserDetailsApi = async (id?: string) => {
  const uri = `/user/${id}/details`;

  return await MockApiService.GET(json);
  // return await ApiService.GET<UserDetailsDataType>(uri);
};
