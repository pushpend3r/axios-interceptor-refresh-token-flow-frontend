import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:3000",
});

interface FailedRequests {
  resolve: (value: AxiosResponse) => void;
  reject: (value: AxiosError) => void;
  config: AxiosRequestConfig;
  error: AxiosError;
}

axiosInstance.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    request.headers.Authorization = JSON.parse(accessToken);
  }

  return request;
});

let failedRequests: FailedRequests[] = [];
let isTokenRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequestConfig = error.config!;

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (isTokenRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequests.push({
          resolve,
          reject,
          config: originalRequestConfig,
          error: error,
        });
      });
    }

    isTokenRefreshing = true;

    try {
      const response = await axiosInstance.post("/access-token", {
        refreshToken: JSON.parse(localStorage.getItem("refreshToken") ?? ""),
      });
      const { accessToken = null, refreshToken = null } = response.data ?? {};

      if (!accessToken || !refreshToken) {
        throw new Error(
          "Something went wrong while refreshing your access token"
        );
      }

      localStorage.setItem("accessToken", JSON.stringify(accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(refreshToken));

      failedRequests.forEach(({ resolve, reject, config }) => {
        axiosInstance(config)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    } catch (_error: unknown) {
      console.error(_error);
      failedRequests.forEach(({ reject, error }) => reject(error));
      localStorage.setItem("accessToken", "");
      localStorage.setItem("refreshToken", "");
      return Promise.reject(error);
    } finally {
      failedRequests = [];
      isTokenRefreshing = false;
    }

    return axiosInstance(originalRequestConfig);
  }
);

export { axiosInstance };
