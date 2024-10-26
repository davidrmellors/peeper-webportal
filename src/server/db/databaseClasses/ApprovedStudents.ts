import { DatabaseUtility } from './DatabaseUtility';
import type { ApprovedStudentsData } from '../interfaces/ApprovedStudentsData';

export class ApprovedStudents implements ApprovedStudentsData {
  approvedStudents: string[];

  constructor(data: ApprovedStudentsData) {
    this.approvedStudents = data.approvedStudents || [];
  }

  // Save the approved students to the database
  static async save(approvedStudents: string[]): Promise<void> {
    
    await DatabaseUtility.setData(`approvedStudents/`, approvedStudents);
  }

  // Update approved students in the database
  async update(updates: Partial<ApprovedStudentsData>): Promise<void> {
    await DatabaseUtility.updateData(`approvedStudents/${this.approvedStudents}`, updates);
  }

  // Delete approved students from the database
  async delete(): Promise<void> {
    await DatabaseUtility.deleteData(`approvedStudents/${this.approvedStudents}`);
  }

  // Convert the instance to a plain object for storage
  toJSON(): ApprovedStudentsData {
    return {
      approvedStudents: this.approvedStudents,
    };
  }

  // Static method to fetch all approved students
  static async fetchAll(): Promise<ApprovedStudentsData[] | null> {
    try {
      const data = await DatabaseUtility.getAllData<ApprovedStudentsData>('approvedStudents');
      return data.map(item => new ApprovedStudents(item));
    } catch (error) {
      console.error('Error fetching approved students:', error);
      return null;
    }
  }

  
}