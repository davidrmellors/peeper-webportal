import type { LocationLogData } from "./LocationLogData";
import type { ViewportData } from "./ViewportData";

export interface SessionLogData {
  sessionLog_id: string;
  orgID: string;
  sessionStartTime: string; // ISO 8601 datetime
  sessionEndTime: string; // ISO 8601 datetime
  locationLogs: LocationLogData[];
  viewport: ViewportData;
}
