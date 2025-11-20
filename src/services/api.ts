import axios from "axios";
import { UserProfile, PredictionResponse } from "../types";

// API Configuration
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error.response?.data || error.message);

    let errorMessage = "An unexpected error occurred.";

    if (error.response?.status === 503) {
      errorMessage =
        "Models not loaded on server. Please ensure backend is properly set up.";
    } else if (error.response?.status >= 500) {
      errorMessage = "Server error. Please try again later.";
    } else if (error.response?.status >= 400) {
      // Handle detailed error messages from backend
      const responseData = error.response.data;
      if (typeof responseData === "string") {
        errorMessage = responseData;
      } else if (responseData?.detail) {
        errorMessage = responseData.detail;
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else {
        errorMessage = "Invalid request. Please check your input.";
      }
    } else if (error.code === "ECONNREFUSED") {
      errorMessage =
        "Cannot connect to server. Please ensure the backend is running on port 8000.";
    } else if (error.message && typeof error.message === "string") {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
);

export interface HealthCheckResponse {
  status: string;
  models_loaded: boolean;
  service: string;
}

export interface FeatureInfo {
  code: string;
  description: string;
}

export interface FeaturesResponse {
  features: FeatureInfo[];
  total_features: number;
}

// API Functions
export const healthCheck = async (): Promise<HealthCheckResponse> => {
  const response = await api.get<HealthCheckResponse>("/health");
  return response.data;
};

export const predictNutrientDeficiencies = async (
  profile: UserProfile
): Promise<PredictionResponse> => {
  const response = await api.post<PredictionResponse>("/api/predict", profile);
  return response.data;
};

export const getFeatures = async (): Promise<FeaturesResponse> => {
  const response = await api.get<FeaturesResponse>("/api/features");
  return response.data;
};

export default api;
