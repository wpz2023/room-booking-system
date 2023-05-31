import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import {useEffect} from "react";

const BASE_URL = "http://localhost:8080";

const Api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: BASE_URL,
});

const authApi = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: BASE_URL,
});

const AxiosInterceptorsSetup = (navigate: NavigateFunction) => {
  useEffect(() => {
    const interceptor = authApi.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response.status === 500) {
            window.localStorage.removeItem("jwtToken");
            navigate("/login");
          }
        }
    );

    return () => {
      authApi.interceptors.response.eject(interceptor);
    };
  }, [navigate]);
};

export default { Api, authApi, AxiosInterceptorsSetup };
