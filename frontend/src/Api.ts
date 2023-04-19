import axios from "axios";
import { NavigateFunction } from "react-router-dom";

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
  authApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 500) {
        window.sessionStorage.removeItem("jwtToken");
        navigate("/login");
      }
    }
  );
};

export default { Api, authApi, AxiosInterceptorsSetup };
