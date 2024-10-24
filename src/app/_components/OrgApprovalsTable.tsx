import React from 'react';
import { api } from "~/trpc/react";
import OrgRequestSkeleton from './OrgRequestSkeleton';

type Organization = {
  id: string;
  name: string;
  submittedBy: string;
  email?: string;
  phoneNo?: string;
};

const OrgApprovalsTable: React.FC = () => {
  const { data: organizations, isLoading, error, refetch } = api.organisation.getPendingRequests.useQuery();
  console.log('Organizations data:', organizations);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);
  const approveOrgRequest = api.organisation.approveOrgRequest.useMutation();
  const denyOrgRequest = api.organisation.denyOrgRequest.useMutation();

  const handleOrgApprove = async (orgId: string) => {
    try {
      await approveOrgRequest.mutateAsync({ requestId: orgId });
      await refetch();
    } catch (error) {
      console.error("Error approving organization:", error);
    }
  };

  const handleOrgDeny = async (orgId: string) => {
    try {
      await denyOrgRequest.mutateAsync({ requestId: orgId });
      await refetch();
    } catch (error) {
      console.error("Error denying organization:", error);
    }
  };

  if (error) return <div>Error loading organization requests: {error.message}</div>;

  return (
    <>
      {isLoading ? <OrgRequestSkeleton /> : (
        <div className="overflow-x-auto">
          {organizations && organizations.length > 0 ? (
        <table className="w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-lime-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">NAME ↓</th>
              <th className="py-3 px-4 text-left">SUBMITTED BY</th>
              {/* <th className="py-3 px-4 text-left">EMAIL</th>
              <th className="py-3 px-4 text-left">PHONE NO.</th> */}
              <th className="py-3 px-4 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org.request_id} className="border-b border-gray-200">
                <td className="py-3 px-4">{org.name}</td>
                <td className="py-3 px-4">{org.studentID}</td>
                {/* <td className="py-3 px-4">{org.email}</td>
                <td className="py-3 px-4">{org.phoneNo}</td> */}
                <td className="py-3 px-4">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleOrgDeny(org.request_id)}
                      className="bg-red-500 text-white px-4 py-2 rounded font-bold"
                    >
                      DENY
                    </button>
                    <button
                      onClick={() => handleOrgApprove(org.request_id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded font-bold"
                    >
                      APPROVE
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-600">No pending organization requests found.</p>
          <p className="text-sm text-gray-500 mt-2">New requests will appear here when organizations apply.</p>
        </div>
      )}
        </div>
      )}
    </>
  );
};

export default OrgApprovalsTable;
