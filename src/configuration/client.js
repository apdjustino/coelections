import axios from "axios";
import { isUndefined } from "lodash";

const baseUrl = "https://aawhadzwb3.execute-api.us-east-2.amazonaws.com/";
const instance = axios.create();

instance.interceptors.request.use((config) => {
  const existingHeaders = !!config && !!config.headers ? config.headers : {};
  //const headers = !!token ? { ...existingHeaders, Authorization: `Bearer ${token}` } : existingHeaders;

  return { ...config, existingHeaders };
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isUndefined(error.response)) {
      if (error.message === "Network Error") {
        console.log("Network error, no internet");
      }
    }
    try {
      const response = await instance.request(error.config);
      if (!!response && response.status >= 200 && response.status < 300) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const Client = {
  get: async (url, config) => await instance.get(`${baseUrl}/${url}`, config),
  post: async (url, data, config) => await instance.post(`${baseUrl}/${url}`, data, config),
  put: async (url, data, config) => await instance.put(`${baseUrl}/${url}`, data, config),
  patch: async (url, data, config) => await instance.patch(`${baseUrl}/${url}`, data, config),
  delete: async (url, config) => await instance.delete(`${baseUrl}/${url}`, config),
};
