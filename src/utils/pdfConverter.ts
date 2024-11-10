import type { Student } from "~/server/db/databaseClasses/Student";
import { Organisation } from "~/server/db/databaseClasses/Organisation";
import JSZip from 'jszip';
import type { LocationLog } from "~/server/db/databaseClasses/LocationLog";
import {logoBase64} from '~/utils/logoBase64';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
const MAX_PATH_SEGMENTS = 50;

// Add this function at the top of your file
const getHtml2Pdf = async () => {
  const html2pdf = (await import('html2pdf.js')).default;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return html2pdf;
};

export async function generatePDFReports(students: Student[]): Promise<Blob> {
    if (students.length === 1) {
      const student = students[0];
      if (student) {
        const { pdf } = await generatePDFForStudent(student);
        return pdf;
      }
      throw new Error("No student found in the array");
    }
    
    const zip = new JSZip();
    
    for (const student of students) {
      const { pdf, filename } = await generatePDFForStudent(student);
      zip.file(filename, pdf);
    }
    
    return await zip.generateAsync({ type: 'blob' });
  }

async function generatePDFForStudent(student: Student): Promise<{ pdf: Blob, filename: string }> {
  // First, generate the HTML content
  const htmlContent = await testHTML(student, logoBase64); 
  const html2pdf = await getHtml2Pdf();
  
  // Pre-load the map images
  const mapPromises = Object.values(student.locationData).map(async (session) => {
    const mapURL = generateStaticMapURL(session.locationLogs ?? [], GOOGLE_MAPS_API_KEY);
    const response = await fetch(mapURL);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  });

  // Wait for all map images to load
  const mapUrls = await Promise.all(mapPromises);

  // Replace the map URLs in the HTML content
  let finalHtmlContent = htmlContent;
  mapUrls.forEach((url, index) => {
    const placeholder = `src="${generateStaticMapURL(Object.values(student.locationData)[index]?.locationLogs ?? [], GOOGLE_MAPS_API_KEY)}"`;
    finalHtmlContent = finalHtmlContent.replace(placeholder, `src="${url}"`);
  });

  const options = {
    margin: 20,
    filename: `${student.studentNumber}_report.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      allowTaint: true
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Generate PDF with pre-loaded images
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const pdf = await html2pdf().set(options).from(finalHtmlContent).output('blob');
  
  // Clean up object URLs
  mapUrls.forEach((url) => URL.revokeObjectURL(url));

  return {
    pdf,
    filename: `${student.studentNumber}_report.pdf`
  };
}

//------------------------------------------------------------------------------------
// HELPER FUNCTIONS
//------------------------------------------------------------------------------------

/**
 * Calculate the distance between two latitude and longitude coordinates using the Haversine formula.
 * @param lat1 - The latitude of the first point.
 * @param lon1 - The longitude of the first point.
 * @param lat2 - The latitude of the second point.
 * @param lon2 - The longitude of the second point.
 * @returns Distance in kilometers between the two points.
 */
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  /**
 * Calculate the zoom level for a Google Maps static image based on the spread of location data.
 * @param locationLogs - An array of location logs containing latitude and longitude coordinates.
 * @returns Calculated zoom level for the static map image. Between 10 and 16.
 */
const calculateZoomLevel = (locationLogs: Array<LocationLog>) => {
    const latitudes = locationLogs.map((pin) => parseFloat(pin.latitude.toString()));
    const longitudes = locationLogs.map((pin) => parseFloat(pin.longitude.toString()));
  
    const maxLat = Math.max(...latitudes);
    const minLat = Math.min(...latitudes);
    const maxLng = Math.max(...longitudes);
    const minLng = Math.min(...longitudes);
  
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
  
    const largestDiff = Math.max(latDiff, lngDiff);
  
    // Approximate zoom level based on the difference in coordinates
    if (largestDiff > 1.0) {
      return 10; // Zoomed out for larger area
    } else if (largestDiff > 0.5) {
      return 12;
    } else if (largestDiff > 0.1) {
      return 14;
    } else {
      return 16; // Zoomed in for smaller area
    }
  };

  /**
 * Convert HSL color to RGB color.
 * @param h - Hue value (0-360).
 * @param s - Saturation value (0-1).
 * @param l - Lightness value (0-1).
 * @returns Array of RGB values.
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h /= 360; // Convert hue to a fraction between 0 and 1
    let r: number, g: number, b: number;
  
    if (s === 0) {
      // Achromatic (grey)
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
  
      const q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p: number = 2 * l - q;
  
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
  
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  /**
 * Generate a colour based on the distance between two location logs.
 * @param distance - Distance between two location logs in kilometers.
 * @param minDistance - Minimum distance between two location logs in kilometers.
 * @param maxDistance - Maximum distance between two location logs in kilometers.
 * @returns Hexadecimal colour string.
 */
const getColorBasedOnDistance = (
    distance: number,
    minDistance: number,
    maxDistance: number
  ): string => {
    distance = distance * 1000; // Convert distance to meters
    const ratio: number = (distance - minDistance) / (maxDistance - minDistance);
    const hue: number = (1 - ratio) * 120; // Map ratio to hue from 120° (green) to 0° (red)
    const [r, g, b] = hslToRgb(hue, 1, 0.5); // Full saturation and 50% lightness
  
    return `0x${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

/**
 * Calculate the minimum and maximum distance between two location logs in a given array.
 * @param locationLogs - An array of location logs containing latitude and longitude coordinates.
 * @returns Object containing the minimum and maximum distances in meters.
 */
const getMinAndMaxDistance = (locationLogs: Array<LocationLog>) => {
    let minDistance = Number.MAX_VALUE;
    let maxDistance = Number.MIN_VALUE;
    for (let i = 0; i < locationLogs.length - 1; i++) {
      const pin1 = locationLogs[i];
      const pin2 = locationLogs[i + 1];
  
      const pin1Latitude = pin1?.latitude ?? 0;
      const pin1Longitude = pin1?.longitude ?? 0;
      const pin2Latitude = pin2?.latitude ?? 0;
      const pin2Longitude = pin2?.longitude ?? 0;
      const currentDistance = haversineDistance(
        pin1Latitude,
        pin1Longitude,
        pin2Latitude,
        pin2Longitude
      );
  
      if (currentDistance < minDistance) {
        minDistance = currentDistance;
      }
      if (currentDistance > maxDistance) {
        maxDistance = currentDistance;
      }
    }
    // Convert km to meters
    minDistance = minDistance * 1000;
    maxDistance = maxDistance * 1000;
    return { minDistance, maxDistance };
  };
  
  const sampleLocationLogs = (locationLogs: Array<LocationLog>, maxSamples: number): Array<LocationLog> => {
    // Early return if array is empty or undefined
    if (!locationLogs?.length) return [];
    if (locationLogs.length <= maxSamples) return locationLogs;
    
    const result: LocationLog[] = [];
    const step = Math.floor(locationLogs.length / maxSamples);
    
    // Add first location log with type check
    const firstLog = locationLogs[0];
    if (firstLog) {
      result.push(firstLog);
    }
    
    // Add middle location logs with type checks
    for (let i = step; i < locationLogs.length - step; i += step) {
      const log = locationLogs[i];
      if (log) {
        result.push(log);
      }
    }
    
    // Add last location log with type check
    const lastLog = locationLogs[locationLogs.length - 1];
    if (lastLog) {
      result.push(lastLog);
    }
    
    return result;
  };

  /**
 * Generate a static Google Maps image URL based on location data.
 * @param locationLogs - An array of location logs containing latitude and longitude coordinates.
 * @param apiKey - Google Maps API key.
 * @returns URL for the static Google Maps image.
 */
const generateStaticMapURL = (locationLogs: Array<LocationLog>, apiKey: string): string => {
  const sampledLogs = sampleLocationLogs(locationLogs, MAX_PATH_SEGMENTS);
  
  // Early return if no logs
  if (!sampledLogs.length) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=0,0&zoom=1&size=600x400&key=${apiKey}`;
  }

  const baseUrl = "https://maps.googleapis.com/maps/api/staticmap?";
  
  // Calculate average coordinates with type safety
  const avgLat = sampledLogs.reduce((sum, pin) => sum + Number(pin?.latitude ?? 0), 0) / sampledLogs.length;
  const avgLng = sampledLogs.reduce((sum, pin) => sum + Number(pin?.longitude ?? 0), 0) / sampledLogs.length;
  
  const center = `center=${avgLat},${avgLng}`;
  const zoom = `zoom=${calculateZoomLevel(sampledLogs)}`;
  const size = "size=600x400";
  const mapType = "maptype=roadmap";

  const { minDistance, maxDistance } = getMinAndMaxDistance(sampledLogs);

  const pathSegments = [];
  for (let i = 0; i < sampledLogs.length - 1; i++) {
    const pin1 = sampledLogs[i];
    const pin2 = sampledLogs[i + 1];

    if (!pin1 || !pin2) continue;

    const distance = haversineDistance(
      Number(pin1.latitude ?? 0),
      Number(pin1.longitude ?? 0),
      Number(pin2.latitude ?? 0),
      Number(pin2.longitude ?? 0)
    );

    const color = getColorBasedOnDistance(distance, minDistance, maxDistance);
    pathSegments.push(
      `path=color:${color}|weight:2|${pin1.latitude},${pin1.longitude}|${pin2.latitude},${pin2.longitude}`
    );
  }
  
  const path = pathSegments.join("&");
  const markers = sampledLogs
    .filter(pin => pin?.latitude && pin?.longitude) // Filter out invalid pins
    .map((pin, index) => 
      `markers=color:red%7Clabel:${index + 1}%7C${pin.latitude},${pin.longitude}`
    )
    .join("&");

  return `${baseUrl}${center}&${zoom}&${size}&${mapType}&${path}&${markers}&key=${apiKey}`;
};
  
  /**
   * Calculate the average speed between location logs in kilometers per hour.
   * @param locationLogs - Array of location logs.
   * @returns Average speed in km/h.
   */
  const calculateAverageSpeed = ((locationLogs: Array<LocationLog>): number => {
    if (locationLogs.length < 2) return 0;
  
    let totalDistance = 0; // in kilometers
    let totalTime = 0; // in hours
  
    for (let i = 1; i < locationLogs.length; i++) {
      const prevLog = locationLogs[i - 1];
      const currLog = locationLogs[i];
  
      // Calculate distance between the two points
      const distance = haversineDistance(
        Number(prevLog?.latitude ?? 0),
        Number(prevLog?.longitude ?? 0),
        Number(currLog?.latitude ?? 0),
        Number(currLog?.longitude ?? 0)
      );
      totalDistance += distance;
  
      // Calculate time difference in hours
      const timeDiffMs =
        new Date(currLog?.timestamp ?? 0).getTime() -
        new Date(prevLog?.timestamp ?? 0).getTime();
      const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
      totalTime += timeDiffHours;
    }
  
    // Calculate average speed (distance/time)
    const averageSpeed = totalTime > 0 ? totalDistance / totalTime : 0;
    return Math.round(averageSpeed * 100) / 100; // Return speed rounded to 2 decimal places
  });

  /**
 * Generate an HTML report for a student's location data.
 * @param student - The student object containing location data.
 * @param logoBase64 - Base64 encoded logo image.
 * @returns HTML content for the report.
 */
async function testHTML(student: Student, logoBase64: string): Promise<string> {
    let htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
      
          <style>
            @page {
              size: A4;
              margin: 20mm;
              @bottom-right {
                content: "Page " counter(page) " of " counter(pages);
                font-size: 12px;
                color: #666;
              }
            }
    
            body {
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 10mm;
              background-color: #f0f0f0;
              text-align: left;
              position: relative;
              counter-increment: page;
            }
    
            /* Header */
            .header-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-bottom: 10px;
              border-bottom: 1px solid #000;
              margin-bottom: 20px;
            }
    
            .report-title {
              font-size: 32px;
              font-weight: 500;
            }
    
            .date-generated {
              font-size: 16px;
              color: #666;
            }
    
            /* Organisation Details */
            .details-container {
              display: grid;
              grid-template-columns: 1fr 2fr 2fr;
              gap: 10px;
              margin-top: 20px;
              padding-bottom: 20px;
              margin-left: 20px;
              border-bottom: 1px solid #000;
              font-size: 16px;
            }
    
            .details-container div {
              padding: 5px 0;
            }
    
            .descriptor {
              font-weight: 500;
            }
    
            /* Map container with square aspect ratio */
            .maps-container {
              margin-top: 20px;
              border-radius: 16px;
              border: 2px solid #ccc;
              overflow: hidden;
              height: 400px; /* More square-like map */
              width: 100%;
              margin-bottom: 20px;
            }
    
            .google-maps-image {
              width: 100%;
              height: 100%; /* Adjust height to make the map more square */
              object-fit: cover;
            }
    
            /* Speed and Pin Count below the map */
            .map-details-container {
              font-size: 16px;
              color: #666;
              margin-top: 10px;
              display: flex;
              justify-content: space-between;
            }
    
            /* Page break to ensure each session starts on a new page */
            .page-break {
              page-break-before: always;
            }
          </style>
        </head>
        <body>
          <header class="header-container">
            <div>
              <div class="report-title"> ${student.studentNumber} Report </div>
              <div class="date-generated"> Date Generated: ${new Date().toLocaleDateString()} </div>
            </div>
            <img src="${logoBase64}" class="logo" />
          </header>
      `;
  
    if (student.locationData && typeof student.locationData === "object") {
      // Convert sessions to array and calculate duration for each
      const sessions = Object.values(student.locationData)
        .map(session => {
          const startTime = new Date(session.sessionStartTime);
          const endTime = new Date(session.sessionEndTime);
          const durationMs = endTime.getTime() - startTime.getTime();
          return {
            ...session,
            duration: durationMs
          };
        })
        // Sort by duration in descending order
        .sort((a, b) => b.duration - a.duration)
        // Take top 4 longest sessions
        .slice(0, 4);
  
      // Fetch all organization data in parallel
      const orgPromises = sessions.map(session =>
        Organisation.fetchById(session.orgID)
      );
      const orgObjects = await Promise.all(
        orgPromises.map(p => p.catch(() => null))
      );
  
      for (let index = 0; index < sessions.length; index++) {
        const session = sessions[index];
        const orgObj = orgObjects[index];
        // Parse start and end times
        const startTime = session?.sessionStartTime ? new Date(session.sessionStartTime) : new Date();
        const endTime = session?.sessionEndTime ? new Date(session.sessionEndTime) : new Date();

        // Format the dates to be more readable
        const formatDateTime = (date: Date) => {
          return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });
        };

        const durationMs = endTime.getTime() - startTime.getTime();
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const durationSeconds = Math.floor((durationMs % (1000 * 60)) / 1000);
        const durationString = `${durationHours} hours, ${durationMinutes} minutes, ${durationSeconds} seconds`;
  
        const numPins = session?.locationLogs?.length ?? 0;
        const avgSpeed = session?.locationLogs ? calculateAverageSpeed(session.locationLogs) : 0;
  
        const mapURL = generateStaticMapURL(
          session?.locationLogs ?? [],
          GOOGLE_MAPS_API_KEY
        );
  
        // Concatenate HTML content
        htmlContent += `
        <div class="details-container">
          <div class="descriptor">Organisation:</div>
          <div class="data">${orgObj?.orgName ?? "N/A"}</div>
          <div class="address">${orgObj?.orgAddress?.streetAddress ?? "N/A"}</div>
  
          <div class="descriptor">Start Time:</div>
          <div class="data">${formatDateTime(startTime)}</div>
          <div class="address">${orgObj?.orgAddress?.suburb ?? "N/A"}</div>
  
          <div class="descriptor">End Time:</div>
          <div class="data">${formatDateTime(endTime)}</div>
          <div class="address">${orgObj?.orgAddress?.city ?? "N/A"}</div>
  
          <div class="descriptor">Duration:</div>
          <div class="data">${durationString}</div>
          <div class="address">${orgObj?.orgAddress?.postalCode ?? "N/A"}</div>
        </div>
  
        <div class="maps-container">
          <img src="${mapURL}" class="google-maps-image" />
        </div>
  
        <div class="map-details-container">
          <div>Number of Pins: ${numPins}</div>
          <div>Average Speed: ${avgSpeed} km/h</div>
        </div>
  
        <div class="page-break"></div>
      `;
      }
    } else {
      console.error("Failed to generate HTML");
    }
  
    htmlContent += `</body></html>`;
    return htmlContent;
  }



