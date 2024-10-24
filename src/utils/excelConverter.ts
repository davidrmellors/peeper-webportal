import * as XLSX from "xlsx";
import { Student } from "~/server/db/databaseClasses/Student";
import { Organisation } from "~/server/db/databaseClasses/Organisation";

interface LocationEntry {
  Date: string;
  StartTime: string;
  EndTime: string;
  Hours: number;
  Organisation: string;
  Address: string;
}

export async function generateExcelWorkbook(
  students: Student[],
  organisations: Organisation[],
): Promise<XLSX.WorkBook> {
  const workbook = XLSX.utils.book_new();

  for (const student of students) {
    const locationEntries: LocationEntry[] = [];

    // Process each session log
    for (const [sessionId, sessionLog] of Object.entries(
      student.locationData,
    )) {
      const org = organisations.find((o) => o.org_id === sessionLog.orgID);
      const startTime = new Date(sessionLog.sessionStartTime);
      const endTime = new Date(sessionLog.sessionEndTime);

      // Calculate hours
      const diffInMilliseconds = endTime.getTime() - startTime.getTime();
      const hours =
        Math.round((diffInMilliseconds / (1000 * 60 * 60)) * 100) / 100;

      locationEntries.push({
        Date: startTime.toLocaleDateString(),
        StartTime: startTime.toLocaleTimeString(),
        EndTime: endTime.toLocaleTimeString(),
        Hours: hours,
        Organisation: org?.orgName ?? "Unknown Organisation",
        Address: org
          ? `${org.orgAddress.streetAddress}, ${org.orgAddress.suburb}, ${org.orgAddress.city}`
          : "Unknown Address",
      });
    }

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(locationEntries);

    // Add column widths
    const colWidths = [
      { wch: 12 }, // Date
      { wch: 10 }, // StartTime
      { wch: 10 }, // EndTime
      { wch: 8 }, // Hours
      { wch: 30 }, // Organisation
      { wch: 50 }, // Address
    ];
    worksheet["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, student.studentNumber);
  }

  return workbook;
}
