import axios from "axios";

const client = axios.create({
  baseURL: "http://14.225.211.111:3000/v1/",
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    token && (config.headers.Authorization = `Bearer ${token}`);

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
      //
    }
    return error;
  }
);

export default client;
