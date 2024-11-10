import * as XLSX from "xlsx";
import type { Student } from "~/server/db/databaseClasses/Student";
import type { Organisation } from "~/server/db/databaseClasses/Organisation";
import type { LocationLog } from "~/server/db/databaseClasses/LocationLog";

type WorksheetData = (string | number)[][];

export async function generateExcelWorkbook(
  students: Student[],
  organisations: Organisation[],
): Promise<XLSX.WorkBook> {
  const workbook = XLSX.utils.book_new();

  for (const student of students) {
    // Map org IDs to org names
    const activeOrgNames = student.activeOrgs
      .map(orgId => {
        const org = organisations.find(o => o.org_id === orgId);
        return org?.orgName ?? "Unknown Organization";
      })
      .join(", ");

    const wsData: WorksheetData = [
      ["Student Details", "", "", "", ""],
      ["Student Number", student.studentNumber, "", "", ""],
      ["Email", student.email, "", "", ""],
      ["Active Organizations", activeOrgNames, "", "", ""],
      ["Number of Sessions", Object.keys(student.locationData).length.toString(), "", "", ""],
      ["Hours Completed", student.hours?.toString() ?? "0", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""]
    ];

    let sessionCount = 1;
    for (const [, sessionLog] of Object.entries(student.locationData)) {
      const org = organisations.find((o) => o.org_id === sessionLog.orgID);
      const startTime = new Date(sessionLog.sessionStartTime);
      const endTime = new Date(sessionLog.sessionEndTime);
      const avgSpeed = calculateAverageSpeed(sessionLog.locationLogs);

      wsData.push(
        [`Session ${sessionCount} Details`, "", "", "", ""],
        ["Organization Name", org?.orgName ?? "Unknown Organisation", "", "", ""],
        ["Session Start Time", startTime.toLocaleString(), "", "", ""],
        ["Session End Time", endTime.toLocaleString(), "", "", ""],
        ["Number of Location Logs", sessionLog.locationLogs.length.toString(), "", "", ""],
        ["Average Speed", `${avgSpeed.toFixed(1)} km/h`, "", "", ""],
        ["", "", "", "", ""],
        [`Session ${sessionCount} Location Logs`, "", "", "", ""],
        ["Timestamp", "Latitude", "Longitude", "Accuracy", "Altitude"]
      );

      sessionLog.locationLogs.forEach(log => {
        wsData.push([
          new Date(log.timestamp).toISOString(),
          log.latitude.toString(),
          log.longitude.toString(),
          log.accuracy.toString(),
          log.altitude?.toString() ?? "N/A"
        ]);
      });

      wsData.push(["", "", "", "", ""], ["", "", "", "", ""]);
      sessionCount++;
    }

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    applyWorksheetStyles(worksheet);
    XLSX.utils.book_append_sheet(workbook, worksheet, student.studentNumber);
  }

  return workbook;
}

function calculateAverageSpeed(locationLogs: LocationLog[]): number {
  if (locationLogs.length < 2) return 0;
  
  // Calculate total distance in kilometers
  let totalDistance = 0;
  for (let i = 1; i < locationLogs.length; i++) {
    const prevLog = locationLogs[i - 1];
    const currentLog = locationLogs[i];
    
    totalDistance += calculateDistance(
      prevLog?.latitude ?? 0,
      prevLog?.longitude ?? 0,
      currentLog?.latitude ?? 0,
      currentLog?.longitude ?? 0
    );
  }
  
  // Calculate total time in hours
  const totalTimeHours = (
    new Date(locationLogs[locationLogs.length - 1]?.timestamp ?? "").getTime() - 
    new Date(locationLogs[0]?.timestamp ?? "").getTime()
  ) / (1000 * 60 * 60);
  
  // Calculate overall average speed
  return totalTimeHours > 0 ? totalDistance / totalTimeHours : 0;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
function isStringOrHasToString(value: unknown): value is { toString: () => string } | string {
  return typeof value === 'string' || (typeof value === 'object' && value !== null && 'toString' in value && typeof value.toString === 'function');
}

function applyWorksheetStyles(worksheet: XLSX.WorkSheet): void {
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "84CC16" }, type: "pattern", patternType: "solid" },
    alignment: { horizontal: "left" }
  };

  const subHeaderStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: "F3F4F6" }, type: "pattern", patternType: "solid" }
  };

  for (const cellRef in worksheet) {
    if (cellRef.startsWith('!')) continue;
    const cell = worksheet[cellRef];
    if (cell.v === undefined || cell.v === null) continue;
  
    // Use the type guard to ensure cell.v is a string or has a toString method
    if (isStringOrHasToString(cell.v)) {
      //value will be a string or an object with a toString method
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const value = cell.v.toString();
  
      if (value === "Student Details") {  // Apply headerStyle to main headers
        cell.s = headerStyle;
      } else if (
        typeof value === "string" &&
        (value.includes("Session") || value === "Timestamp")
      ) {
        cell.s = subHeaderStyle;
      }
  
      // Add borders to all cells
      cell.s = {
        ...cell.s,
        border: {
          top: { style: "thin", color: { rgb: "E5E7EB" } },
          bottom: { style: "thin", color: { rgb: "E5E7EB" } },
          left: { style: "thin", color: { rgb: "E5E7EB" } },
          right: { style: "thin", color: { rgb: "E5E7EB" } }
        }
      };
    }
  }
  
}
