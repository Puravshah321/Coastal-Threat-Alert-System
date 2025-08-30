import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  withCredentials: false,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.data && err.response.data.message) {
      return Promise.reject(new Error(err.response.data.message));
    }
    return Promise.reject(err);
  }
);

export default api;
