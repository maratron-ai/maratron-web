import axios from "axios";
import { Run } from "@maratypes/run";

// helper to map API response to Run type
const mapRun = (data: any): Run => ({
  id: data.id,
  date: new Date(data.date),
  duration: data.duration,
  distance: data.distance,
  distanceUnit: data.distanceUnit,
  trainingEnvironment: data.trainingEnvironment ?? undefined,
  name: data.name ?? undefined,
  pace:
    data.pace && data.paceUnit
      ? { pace: data.pace, unit: data.paceUnit }
      : undefined,
  elevationGain: data.elevationGain ?? undefined,
  elevationGainUnit: data.elevationGainUnit ?? undefined,
  notes: data.notes ?? undefined,
  userId: data.userId,
  shoeId: data.shoeId ?? undefined,
});

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
  return mapRun(response.data);
};

// Delete a run by ID
export const deleteRun = async (runId: string) => {
  const response = await axios.delete(`/api/runs/${runId}`);
  return response.data;
};

// List all runs (or you can extend this with filters as needed)
export const listRuns = async () => {
  const response = await axios.get(`/api/runs`);
  return (response.data as any[]).map(mapRun);
};
