import axios from "axios";

const API_URL = "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  return axiosInstance.post("/login", credentials);
};

export const fetchProducts = async () => {
  return axiosInstance.get("/products");
};

export const searchProducts = async (query) => {
  return axiosInstance.get(`/products?search=${query}`);
};

export const addProduct = async (productData) => {
  return axiosInstance.post("/products", productData);
};

export const processSale = async (saleData) => {
  return axiosInstance.post("/pos", saleData);
};

export default axiosInstance;
