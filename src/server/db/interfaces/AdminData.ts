import type{ AdminType } from "./enums";

export interface AdminData {
  admin_id: string;
  email: string;
  adminType: AdminType; // 0 = SuperAdmin, 1 = Admin
  viewableStudents: string[];
}
