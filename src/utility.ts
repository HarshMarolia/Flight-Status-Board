import axios from "axios";

// Handle errors and return appropriate messages
export const handleError = (error: any): string => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 403:
            return "API limit exceeded. Please try again later.";
          case 404:
            return "Flight data not found.";
          case 500:
            return "Server error. Please try again later.";
          default:
            return "An unexpected error occurred. Please try again.";
        }
      } else if (error.request) {
        return "Network error. Please check your internet connection.";
      } else {
        return "Error setting up request. Please try again.";
      }
    }
    return "An unexpected error occurred. Please try again.";
  };

  export const dateFormatter = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString();
  };