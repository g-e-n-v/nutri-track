import axios from "axios";
import { redirect } from "react-router-dom";

const client = axios.create({
  baseURL: "http://14.225.211.111:3000/v1/",
  // withCredentials: true,
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    token && (config.headers.Authorization = `Bearer ${token.slice(1, -1)}`);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      redirect("/auth");
    }
    return error;
  }
);

export default client;
