import axios from "axios";
import { UserProfile } from "@maratypes/user";


// updates
export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>
) => {
  // put req
  const response = await axios.put(`/api/users/${userId}`, data);
  return response.data;
};


// creates new
export const createUserProfile = async (data: Partial<UserProfile>) => {
  // post req
  const response = await axios.post(`/api/users`, data);
  return response.data;
};
