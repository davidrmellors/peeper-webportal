// This is the student class
import { DatabaseUtility } from "./DatabaseUtility";
import { StudentData } from "../interfaces/StudentData";
import { SessionLogData } from "../interfaces/SessionLogData";
import { SessionLog } from "./SessionLog";

export class Student implements StudentData {
  student_id: string;
  studentNumber: string;
  email: string;
  profilePhotoURL?: string;
  activeOrgs: string[];
  locationData: Record<string, SessionLog>;

  constructor(data: StudentData) {
    this.student_id = data.student_id;
    this.studentNumber = data.studentNumber || "";
    this.email = data.email || "";
    this.profilePhotoURL = data.profilePhotoURL ?? undefined;
    this.activeOrgs = data.activeOrgs || [];
    this.locationData = {};

    if (data.locationData) {
      for (const key in data.locationData) {
        const sessionLogData = data.locationData[key];
        if (sessionLogData) {
          this.locationData[key] = new SessionLog(sessionLogData);
        }
      }
    }
  }

  static async fetchById(student_id: string): Promise<Student | null> {
    const data = await DatabaseUtility.getData<StudentData>(
      `students/${student_id}`
    );
    return data ? new Student(data) : null;
  }

  async save(): Promise<void> {
    const data = this.toJSON();
    await DatabaseUtility.setData(`students/${this.student_id}`, data);
  }

  async update(updates: Partial<StudentData>): Promise<void> {
    await DatabaseUtility.updateData(`students/${this.student_id}`, updates);
  }

  async delete(): Promise<void> {
    await DatabaseUtility.deleteData(`students/${this.student_id}`);
  }

  toJSON(): StudentData {
    const locationDataJSON: Record<string, SessionLogData> = {};
    for (const key in this.locationData) {
      if (Object.prototype.hasOwnProperty.call(this.locationData, key)) {
        const sessionLog = this.locationData[key];
        if (sessionLog) {
          locationDataJSON[key] = sessionLog.toJSON();
        }
      }
    }

    return {
      student_id: this.student_id,
      studentNumber: this.studentNumber,
      email: this.email,
      profilePhotoURL: this.profilePhotoURL,
      activeOrgs: this.activeOrgs,
      locationData: locationDataJSON,
    };
  }
}
