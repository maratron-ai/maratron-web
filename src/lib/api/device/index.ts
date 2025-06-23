import axios from "axios";
import type { DeviceProvider } from "@maratypes/device";

export interface ConnectDevicePayload {
  provider: DeviceProvider;
  token: string;
  userId: string;
}

export const connectDevice = async (
  data: ConnectDevicePayload
): Promise<{ success: boolean }> => {
  const res = await axios.post("/api/devices/connect", data);
  return res.data as { success: boolean };
};
