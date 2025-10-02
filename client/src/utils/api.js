import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";

// API utility for making authenticated requests
export function useApi() {
  const { getToken } = useAuth();

  const apiCall = useCallback(async (url, options = {}) => {
    try {
      // Get the session token from Clerk
      const token = await getToken();
      
      if (!token) {
        throw new Error("No authentication token available");
      }

      // Add authorization header
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      };

      // Make the API call
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}${url}`, {
        ...options,
        headers,
      });

      // Parse response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  }, [getToken]);

  return { apiCall };
}

// Convenience functions for common API calls
export function useTicketsApi() {
  const { apiCall } = useApi();

  const fetchTickets = useCallback(() => apiCall("/tickets"), [apiCall]);
  const fetchTicket = useCallback((id) => apiCall(`/tickets/${id}`), [apiCall]);
  const createTicket = useCallback((ticketData) => apiCall("/tickets", {
    method: "POST",
    body: JSON.stringify(ticketData),
  }), [apiCall]);

  return { fetchTickets, fetchTicket, createTicket };
}

export function useUsersApi() {
  const { apiCall } = useApi();

  const fetchUsers = useCallback(() => apiCall("/auth/users"), [apiCall]);
  const fetchProfile = useCallback(() => apiCall("/auth/profile"), [apiCall]);
  const updateProfile = useCallback((profileData) => apiCall("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  }), [apiCall]);
  const updateUser = useCallback((userData) => apiCall("/auth/update-user", {
    method: "PUT",
    body: JSON.stringify(userData),
  }), [apiCall]);

  return { fetchUsers, fetchProfile, updateProfile, updateUser };
}
