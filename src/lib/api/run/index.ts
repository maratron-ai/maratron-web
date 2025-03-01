import axios from "axios";
import { Run } from "@maratypes/run";

// Create a new run
export const createRun = async (data: Partial<Run>) => {
  const response = await axios.post(`/api/runs`, data);
  return response.data;
};

// Update an existing run
export const updateRun = async (runId: string, data: Partial<Run>) => {
  const response = await axios.put(`/api/runs/${runId}`, data);
  return response.data;
};

// Get a specific run by ID
export const getRun = async (runId: string) => {
  const response = await axios.get(`/api/runs/${runId}`);
  return response.data;
};

// Delete a run by ID
export const deleteRun = async (runId: string) => {
  const response = await axios.delete(`/api/runs/${runId}`);
  return response.data;
};

// List all runs (or you can extend this with filters as needed)
export const listRuns = async () => {
  const response = await axios.get(`/api/runs`);
  return response.data;
};
