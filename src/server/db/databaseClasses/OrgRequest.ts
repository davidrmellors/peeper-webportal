// OrgRequest.ts
import { DatabaseUtility } from './DatabaseUtility';
import type { OrgRequestData } from '../interfaces/OrgRequestData';
import { OrgAddress } from './OrgAddress';
import type { ApprovalStatus } from '../interfaces/enums';
import { onValue } from 'firebase/database';

export class OrgRequest implements OrgRequestData {
  request_id: string;
  studentIDs: string[];
  org_id: string;
  name: string;
  orgAddress: OrgAddress;
  email?: string;
  phoneNo?: string;
  approvalStatus: ApprovalStatus;
  orgLatitude: number;
  orgLongitude: number;

  constructor(data: OrgRequestData) {
    this.request_id = data.request_id;
    this.studentIDs = data.studentIDs;
    this.org_id = data.org_id;
    this.name = data.name;
    this.orgAddress = new OrgAddress(data.orgAddress);
    this.email = data.email;
    this.phoneNo = data.phoneNo;
    this.approvalStatus = data.approvalStatus;
    this.orgLatitude = data.orgLatitude;
    this.orgLongitude = data.orgLongitude;
  }

  static async fetchById(request_id: string): Promise<OrgRequest | null> {
    const data = await DatabaseUtility.getData<OrgRequestData>(`orgRequests/${request_id}`);
    return data ? new OrgRequest(data) : null;
  }

  async save(): Promise<void> {
    await DatabaseUtility.setData(`orgRequests/${this.request_id}`, this.toJSON());
  }

  async update(updates: Partial<OrgRequestData>): Promise<void> {
    await DatabaseUtility.updateData(`orgRequests/${this.request_id}`, updates);
  }

  async delete(): Promise<void> {
    await DatabaseUtility.deleteData(`orgRequests/${this.request_id}`);
  }

  toJSON(): OrgRequestData {
    return {
      request_id: this.request_id,
      studentIDs: this.studentIDs,
      org_id: this.org_id,
      name: this.name,
      orgAddress: this.orgAddress.toJSON(),
      email: this.email,
      phoneNo: this.phoneNo,
      approvalStatus: this.approvalStatus,
      orgLatitude: this.orgLatitude,
      orgLongitude: this.orgLongitude,
    };
  }

  static listenToRequestsByStudentId(
    studentID: string,
    callback: (requests: OrgRequest[]) => void
  ): () => void {
    const dbRef = DatabaseUtility.getRef('orgRequests');
  
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const requests: OrgRequest[] = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val() as OrgRequestData;
        if (Array.isArray(data.studentIDs) && data.studentIDs.includes(studentID)) {
          requests.push(new OrgRequest(data));
        }
      });
      callback(requests);
    });
  
    // Return the unsubscribe function
    return () => unsubscribe();
  }
}