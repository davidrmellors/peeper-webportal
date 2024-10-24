// OrgRequest.ts
import { DatabaseUtility } from './DatabaseUtility';
import { OrgRequestData } from '../interfaces/OrgRequestData';
import { OrgAddress } from './OrgAddress';
import { ApprovalStatus } from '../interfaces/enums';

export class OrgRequest implements OrgRequestData {
  request_id: string;
  studentID: string;
  org_id: string;
  name: string;
  orgAddress: OrgAddress;
  email?: string;
  phoneNo?: string;
  approvalStatus: ApprovalStatus;

  constructor(data: OrgRequestData) {
    this.request_id = data.request_id;
    this.studentID = data.studentID;
    this.org_id = data.org_id;
    this.name = data.name;
    this.orgAddress = new OrgAddress(data.orgAddress);
    this.email = data.email;
    this.phoneNo = data.phoneNo;
    this.approvalStatus = data.approvalStatus;
  }

  static async fetchById(request_id: string): Promise<OrgRequest | null> {
    const data = await DatabaseUtility.getData<OrgRequestData>(`orgRequests/${request_id}`);
    return data ? new OrgRequest(data) : null;
  }

  static async fetchByApprovalStatus(approvalStatus: ApprovalStatus): Promise<OrgRequest[] | null> {
    try {
      const allRequests = await DatabaseUtility.getData<Record<string, OrgRequestData>>('orgRequests');
      if (!allRequests) return null;

      const filteredRequests = Object.entries(allRequests)
        .filter(([_, request]) => request.approvalStatus === approvalStatus)
        .map(([id, request]) => new OrgRequest({ ...request, request_id: id }));

      return filteredRequests.length > 0 ? filteredRequests : null;
    } catch (error) {
      console.error('Error fetching org requests:', error);
      return null;
    }
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
      studentID: this.studentID,
      org_id: this.org_id,
      name: this.name,
      orgAddress: this.orgAddress.toJSON(),
      email: this.email,
      phoneNo: this.phoneNo,
      approvalStatus: this.approvalStatus,
    };
  }
}
