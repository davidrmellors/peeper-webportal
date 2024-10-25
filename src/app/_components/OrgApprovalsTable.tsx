import React, { useEffect, useState } from 'react';
import { api } from "~/trpc/react";
import OrgRequestSkeleton from './OrgRequestSkeleton';
import { database } from '~/server/db/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { OrgRequestData } from '~/server/db/interfaces/OrgRequestData';
import OrgRequestModal from './OrgRequestModal';

const OrgApprovalsTable: React.FC = () => {
  const [orgRequests, setOrgRequests] = useState<OrgRequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null); // Updated state type
  const approveOrgRequest = api.orgRequest.approveOrgRequest.useMutation();
  const denyOrgRequest = api.orgRequest.denyOrgRequest.useMutation();
  const [selectedRequest, setSelectedRequest] = useState<OrgRequestData>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const orgRequestsRef = ref(database, 'orgRequests'); // Reference to your orgRequests path

    const unsubscribe = onValue(orgRequestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const requests = Object.values(data).filter((req: any) => req.approvalStatus === 0); // Assuming 0 is Pending
        setOrgRequests(requests as never[]);
      } else {
        setOrgRequests([]);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching org requests:", error);
      setError(error); // No longer causes a type error
      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleViewRequest = (orgReq: OrgRequestData) => {
    setSelectedRequest(orgReq);
    setIsModalOpen(true);
  };

  const handleApprove = async () => {
    if (selectedRequest) {
      await approveOrgRequest.mutateAsync({ requestId: selectedRequest.request_id });
      setIsModalOpen(false);
      // Optionally refresh the requests
    }
  };

  const handleDeny = async () => {
    if (selectedRequest) {
      await denyOrgRequest.mutateAsync({ requestId: selectedRequest.request_id });
      setIsModalOpen(false);
      // Optionally refresh the requests
    }
  };

  const { data: students } = api.student.getAllStudents.useQuery();
  const getStudentNumber = (studentId: string) => {
    const student = students?.find(s => s.student_id === studentId);
    return student?.studentNumber || 'N/A';
  };

  const handleOrgApprove = async (orgId: string) => {
    try {
      await approveOrgRequest.mutateAsync({ requestId: orgId });
    } catch (error) {
      console.error("Error approving organization:", error);
    }
  };


  const handleOrgDeny = async (orgId: string) => {
    try {
      await denyOrgRequest.mutateAsync({ requestId: orgId });
    } catch (error) {
      console.error("Error denying organization:", error);
    }
  };

  if (error) return <div>Error loading organization requests: {error.message}</div>;

  return (
    <>
      {isLoading ? <OrgRequestSkeleton /> : (
        <div className="overflow-x-auto">
          {orgRequests.length > 0 ? (
            <table className="w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-lime-500 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">NAME ↓</th>
                  <th className="py-3 px-4 text-left">SUBMITTED BY</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {orgRequests.map((orgReq) => (
                  <tr key={orgReq.request_id} className="border-b border-gray-200">
                    <td className="py-3 px-4">{orgReq.name}</td>
                    <td className="py-3 px-4">{getStudentNumber(orgReq.studentID)}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewRequest(orgReq)}
                        className="bg-green-500 text-white px-4 py-2 rounded font-bold"
                      >
                        VIEW
                      </button>
                        <button
                          onClick={() => handleOrgDeny(orgReq.request_id)}
                          className="bg-red-500 text-white px-4 py-2 rounded font-bold"
                        >
                          DENY
                        </button>
                        <button
                          onClick={() => handleOrgApprove(orgReq.request_id)}
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
      <OrgRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        requestDetails={selectedRequest}
        onApprove={handleApprove}
        onDeny={handleDeny}
      />
    </>
  );
};

export default OrgApprovalsTable;
