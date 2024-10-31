import React, { useEffect, useState } from 'react';
import { api } from "~/trpc/react";
import OrgRequestSkeleton from './OrgRequestSkeleton';
import { database } from '~/server/db/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import type { OrgRequestData } from '~/server/db/interfaces/OrgRequestData'; // Use import type
import OrgReqStatusModal from './OrgReqStatusModal';
import ViewStudentsModal from './viewStudentsModal';
import type { OrganisationData } from '../(admin)/organisations/page';
import { OrgAddress } from '~/server/db/databaseClasses/OrgAddress';

const OrgApprovalsTable: React.FC = () => {
  const [orgRequests, setOrgRequests] = useState<OrgRequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const approveOrgRequest = api.orgRequest.approveOrgRequest.useMutation();
  const denyOrgRequest = api.orgRequest.denyOrgRequest.useMutation();
  const addOrganisation = api.organisation.addOrganisation.useMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [orgRequestApproved, setApprovalStatus ] = useState(false);
  const [viewMoreModalOpen, setViewModalOpen] = useState(false);


  useEffect(() => {
    const orgRequestsRef = ref(database, 'orgRequests');

    const unsubscribe = onValue(orgRequestsRef, (snapshot) => {
      const data = snapshot.val() as OrgRequestData;
      if (data) {
        const requests = Object.values(data);
        const pendingRequests = requests.filter((req) => req.approvalStatus === 0); // Assuming 0 is Pending
        setOrgRequests(pendingRequests);
      } else {
        setOrgRequests([]);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching org requests:", error);
      setError(error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  

  const handleApprove = async (orgReqId: string) => {
    console.log("Approve clicked");
    if (orgReqId) {
        approveOrgRequest.mutate({ requestId: orgReqId }, {
          onSuccess: () => {
            setModalOpen(true);
            setApprovalStatus(true);
            const orgRequest = orgRequests.find(orgReq => orgReq.request_id === orgReqId);
            if (orgRequest) {
              const org: OrganisationData = {
                org_id: orgRequest.org_id,
                orgName: orgRequest.name,
                orgAddress: new OrgAddress(orgRequest.orgAddress),
                orgEmail: orgRequest.email ? orgRequest.email : "",
                orgPhoneNo: orgRequest.phoneNo ? orgRequest.phoneNo : "",
                orgLatitude: orgRequest.orgLatitude,
                orgLongitude: orgRequest.orgLongitude,
              };
              addOrganisation.mutate({ org }); 
            }
          },
          onError: (error) => {
            console.log(error);
          },
        });
        
    }
  };

  const handleDeny = async (orgReqId: string) => {
    console.log("Deny Clicked");
    if (orgReqId) {
      denyOrgRequest.mutate({ requestId: orgReqId }, {
        onSuccess: () => {
          setModalOpen(true);
          setApprovalStatus(false);
        },
        onError: (error) => {
          console.log(error);
        }
      }
      );
    }
  };

  const handleViewMore = () => {
    setViewModalOpen(true);
  };


  if (error) return <div>Error loading organization requests: {error.message}</div>;

  return (
    <>
      {isLoading ? <OrgRequestSkeleton /> : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-black">ORGANISATION REQUESTS</h2>
          </div>

          <div className="overflow-x-auto">
            {orgRequests.length > 0 ? (
              <table className="w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-lime-500 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">NAME</th>
                    <th className="py-3 px-4 text-left">EMAIL</th>
                    <th className="py-3 px-4 text-left">Phone Number</th>
                    <th className="py-3 px-4 text-left">Address</th>
                    <th className="py-3 px-4 text-left">SUBMITTED BY</th>
                    <th className="py-3 px-4 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orgRequests.map((orgReq) => (
                    <tr key={orgReq.request_id} className="border-b border-gray-200">
                      <td className="py-3 px-4">{orgReq.name ? orgReq.name : "N/A"}</td>
                      <td className="py-3 px-4">{orgReq.email ? orgReq.email : "N/A"}</td>
                      <td className="py-3 px-4">{orgReq.phoneNo ? orgReq.phoneNo : "N/A"}</td>
                      <td className="py-3 px-4">{`${orgReq.orgAddress.suburb}, ${orgReq.orgAddress.city}, ${orgReq.orgAddress.province}, ${orgReq.orgAddress.postalCode}`}</td>
                      <td className='py-3 px-3'><button onClick={handleViewMore} className="bg-lime-500 text-white px-4 py-1 rounded">VIEW</button></td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleDeny(orgReq.request_id)}
                            className="bg-red-500 text-white px-4 py-2 rounded font-bold"
                          >
                            DENY
                          </button>
                          <button
                            onClick={() => handleApprove(orgReq.request_id)}
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
        </div>
      )}
      <OrgReqStatusModal isOpen={modalOpen} approvalStatus={orgRequestApproved} onClose={() => setModalOpen(false)}/>
      <ViewStudentsModal onClose={() => setViewModalOpen(false)} isOpen={viewMoreModalOpen} students={orgRequests.flatMap((orgReq) => (orgReq.studentIDs))}/>
    </>
  );
};

export default OrgApprovalsTable;
