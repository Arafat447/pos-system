import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Replace with your backend URL

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to handle login
export const login = async (credentials) => {
  return axiosInstance.post("/login", credentials);
};

// Function to handle product fetching
export const fetchProducts = async () => {
  return axiosInstance.get("/products");
};

// Function to search for products
export const searchProducts = async (query) => {
  return axiosInstance.get(`/products?search=${query}`);
};

// Function to handle adding a new product
export const addProduct = async (productData) => {
  return axiosInstance.post("/products", productData);
};

// Function to process sales
export const processSale = async (saleData) => {
  return axiosInstance.post("/pos", saleData);
};

export default axiosInstance;
