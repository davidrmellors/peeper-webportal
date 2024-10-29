import { DatabaseUtility } from './DatabaseUtility';
import type { ApprovedStudentsData } from '../interfaces/ApprovedStudentsData';

export class ApprovedStudents implements ApprovedStudentsData {
  approvedStudents: string[];

  constructor(data: ApprovedStudentsData) {
    this.approvedStudents = data.approvedStudents ?? [];
  }

  // Save the approved students to the database
  static async save(newStudents: string[]): Promise<void> {
    // First, fetch existing students
    const existingStudents = await this.fetchAll() ?? [];
    
    // Create a Set to remove duplicates and combine existing with new students
    const combinedStudents = new Set([...existingStudents, ...newStudents]);
    
    // Save the combined unique students
    await DatabaseUtility.setData(`approvedStudents/`, Array.from(combinedStudents));
  }

  // Convert the instance to a plain object for storage
  toJSON(): ApprovedStudentsData {
    return {
      approvedStudents: this.approvedStudents,
    };
  }

  // Static method to fetch all approved students
  static async fetchAll(): Promise<string[] | null> {
    try {
      const data = await DatabaseUtility.getAllData<string>('approvedStudents');
      console.log("Approved students:", data);
      return data;
    } catch (error) {
      console.error('Error fetching approved students:', error);
      return null;
    }
  }

  
}