// Admin.ts
import { DatabaseUtility } from './DatabaseUtility';
import type { AdminData } from '../interfaces/AdminData';
import type { AdminType } from '../interfaces/enums';

export class Admin implements AdminData {
  admin_id: string;
  email: string;
  adminType: AdminType;
  viewableStudents: string[];

  constructor(data: AdminData) {
    this.admin_id = data.admin_id;
    this.email = data.email;
    this.adminType = data.adminType;
    this.viewableStudents = data.viewableStudents;
  }

  static async fetchById(admin_id: string): Promise<Admin | null> {
    const data = await DatabaseUtility.getData<AdminData>(`admins/${admin_id}`);
    return data ? new Admin(data) : null;
  }

  static async fetchAdminsByType(adminType: AdminType): Promise<Admin[] | null> {
    const data = await DatabaseUtility.getData<AdminData[]>(`admins?adminType=${adminType}`);
    return data ? data.map(adminData => new Admin(adminData)) : null;
  }

  async save(): Promise<void> {
    await DatabaseUtility.setData(`admins/${this.admin_id}`, this.toJSON());
  }

  async update(updates: Partial<AdminData>): Promise<void> {
    await DatabaseUtility.updateData(`admins/${this.admin_id}`, updates);
  }

  async delete(): Promise<void> {
    await DatabaseUtility.deleteData(`admins/${this.admin_id}`);
  }

  toJSON(): AdminData {
    return {
      admin_id: this.admin_id,
      email: this.email,
      adminType: this.adminType,
      viewableStudents: this.viewableStudents,
    };
  }
}
