import axios from "axios";
import { UserProfile } from "@types/user";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://jsonplaceholder.typicode.com";
;

// Fetch user profile from API
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await axios.get(`${API_URL}/users/${userId}`);
  return response.data;
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>
) => {
  const response = await axios.put(`${API_URL}/users/${userId}`, data);
  return response.data;
};
