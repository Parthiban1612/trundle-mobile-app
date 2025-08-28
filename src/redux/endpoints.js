// Base API configuration
export const API_BASE_URL = 'https://mapi.trundle.me';

// Common axios configuration
export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'S0HU1TJi.YN1ikR4PcO9bLM5BcaZh8qRuhHTXBZZc',
  },
};

// API endpoints with full URLs
export const ENDPOINTS = {
  SEND_OTP: `${API_BASE_URL}/accounts/send-code`,
  VERIFY_OTP: `${API_BASE_URL}/accounts/verify-otp`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
  FORGOT_PASSWORD: `${API_BASE_URL}/account/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/account/reset-password`,
  COUNTRIES: `${API_BASE_URL}/accounts/all-countries`,
  TRAVEL_COUNTRIES: `${API_BASE_URL}/itinerary/Itinerary-trip-countries`,
  CREATE_PROFILE: `${API_BASE_URL}/accounts/update-profile`,
  GET_USER_PROFILE: `${API_BASE_URL}/accounts/user-details`,
  SUBMIT_USER_COUNTRY: `${API_BASE_URL}/itinerary/submit-user-country`,
  GET_ALL_ITINERARIES: `${API_BASE_URL}/itinerary/get-all-itineraries`,
  GET_CATEGORIES: `${API_BASE_URL}/itinerary/get-categories`,
  GET_SUB_CATEGORIES: `${API_BASE_URL}/itinerary/get-sub-categories`,
  ADD_FAVOURITE: `${API_BASE_URL}/itinerary/add-trip`,
  REMOVE_FAVOURITE: `${API_BASE_URL}/itinerary/delete-trip`,
  GET_FAVOURITES: `${API_BASE_URL}/itinerary/get-trips`,
  GET_FAVOURITE: `${API_BASE_URL}/itinerary/get-single-itinerary`,
  GET_UPDATES: `${API_BASE_URL}/notification/get-updates`,
  GET_TIPS: `${API_BASE_URL}/notification/get-tips`,
  GET_QUESTIONS: `${API_BASE_URL}/recommendation/questions`,
  SUBMIT_USER_PREFERENCE: `${API_BASE_URL}/recommendation/submit-answer`,
  UPDATE_READED: `${API_BASE_URL}/notification/read-notification`,
  GET_USER_SELECTED_COUNTRY: `${API_BASE_URL}/itinerary/get-submitted-country`,
  UPDATE_USER_PROFILE: `${API_BASE_URL}/accounts/upload-profile-image`,
  INITIATE_PAYMENT: `${API_BASE_URL}/payment/initiate`,
  CONFIRM_PAYMENT: `${API_BASE_URL}/payment/confirm`,
}; 