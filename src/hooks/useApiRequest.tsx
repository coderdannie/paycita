import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { api2, api } from "../service/api";
import { AxiosError, AxiosRequestConfig } from "axios";

type Res = {
  data: Record<string, string>;
  status: number;
  statusText: boolean;
};

type UseApiRequestResult = {
  loading: boolean;
  error: string | null;
  message: string;
  isSuccess: boolean;

  getRequest: (
    url: string,
    callback?: (data: DataProps) => void
  ) => Promise<void>;

  postRequest: (
    url: string,
    formData: AxiosRequestConfig["data"],
    callback?: (data: DataProps) => void
  ) => Promise<void>;

  patchRequest: (
    url: string,
    formData: AxiosRequestConfig["data"],
    callback?: (data: DataProps) => void
  ) => Promise<void>;

  deleteRequest: (
    url: string,
    callback?: (data: DataProps) => void
  ) => Promise<void>;
};

type DataProps = {
  pagination?: Pagination;
  data: null;
  success: boolean;
  message: string;
  status: number;
};

type ErrorDataProps = {
  data: AxiosError;
  success: boolean;
  message: string;
  error: string;
  status: number;
};

const useApiRequest = (): UseApiRequestResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const reset = () => {
    setError(null);
    setMessage("");
    setIsSuccess(false);
  };

  const makeRequest = useCallback(
    async (
      method: "get" | "post" | "patch" | "delete",
      url: string,
      data: AxiosRequestConfig["data"],
      callback?: (data: DataProps) => void
    ) => {
      // Check internet connection before making request
      if (!navigator.onLine) {
        toast.error("No internet connection. Please check your network.", {
          position: "top-right",
        });
        return;
      }

      reset();
      setLoading(true);

      try {
        let response;
        const axiosInstance = data instanceof FormData ? api2 : api;

        if (method === "get" || method === "delete") {
          response = await axiosInstance[method]<Res>(url);
        } else {
          response = await axiosInstance[method]<Res>(url, data);
        }

        const responseData: DataProps = response.data;
        setMessage(responseData.message);
        setIsSuccess(true);
        if (method !== "get") {
          if (responseData.success) {
            toast.success(responseData.message || "Request successful", {
              position: "top-right",
            });
          } else {
            toast.error(responseData.message || "Something went wrong", {
              position: "top-right",
            });
          }
        }
        if (callback) callback(responseData);
      } catch (error) {
        const errorData: ErrorDataProps = error?.response?.data || {};
        console?.error(errorData);
        setIsSuccess(false);
        const msg =
          errorData?.message || errorData?.error || "Something went wrong";
        setError(msg);
        toast.error(msg, { position: "top-right" });
        if (callback) {
          const dataProps: DataProps = {
            data: null,
            success: false,
            message: msg,
            status: errorData.status,
          };
          callback(dataProps);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    getRequest: (url, callback) => makeRequest("get", url, undefined, callback),
    postRequest: (url, formData, callback) =>
      makeRequest("post", url, formData, callback),
    patchRequest: (url, formData, callback) =>
      makeRequest("patch", url, formData, callback),
    deleteRequest: (url, callback) => makeRequest("delete", url, {}, callback),
    message,
    isSuccess,
  };
};

export default useApiRequest;
