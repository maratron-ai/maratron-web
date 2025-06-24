export type DeviceProvider = "appleHealth" | "appleWatch" | "garmin";

export interface DeviceConnection {
  id: string;
  provider: DeviceProvider;
  token: string;
  userId: string;
  createdAt: Date;
}
