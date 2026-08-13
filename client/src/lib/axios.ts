// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const message = error.response?.data?.message || "Something went wrong";
//     if (error.response?.status === 401) {
//       window.location.href = "/login";
//     }
//     return Promise.reject(new Error(message));
//   },
// );

// export default api;

import axios from "axios";
import { LOGIN_PATHS } from "./auth-paths";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    const status = error.response?.status;
    const isAuthCheck = error.config?.url?.includes("/auth/me");
    const alreadyOnLogin = window.location.pathname.includes("/login");

    // let /auth/me's 401 fall through untouched — the guard hook handles that one
    if (status === 401 && !isAuthCheck && !alreadyOnLogin) {
      const loginPath = window.location.pathname.startsWith("/portal")
        ? LOGIN_PATHS.client
        : LOGIN_PATHS.admin;
      window.location.href = loginPath;
    }

    return Promise.reject(new Error(message));
  },
);

export default api;
