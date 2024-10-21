import React from 'react';

interface Organization {
  id: string;
  name: string;
  submittedBy: string;
  email: string;
  phoneNo: string;
}

interface OrgApprovalsTableProps {
  organizations: Organization[];
  onApprove: (orgId: string) => void;
  onDeny: (orgId: string) => void;
}

const OrgApprovalsTable: React.FC<OrgApprovalsTableProps> = ({ organizations, onApprove, onDeny }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-lime-500 text-white">
          <tr>
            <th className="py-3 px-4 text-left">NAME ↓</th>
            <th className="py-3 px-4 text-left">SUBMITTED BY</th>
            <th className="py-3 px-4 text-left">EMAIL</th>
            <th className="py-3 px-4 text-left">PHONE NO.</th>
            <th className="py-3 px-4 text-center">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr key={org.id} className="border-b border-gray-200">
              <td className="py-3 px-4">{org.name}</td>
              <td className="py-3 px-4">{org.submittedBy}</td>
              <td className="py-3 px-4">{org.email}</td>
              <td className="py-3 px-4">{org.phoneNo}</td>
              <td className="py-3 px-4">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onDeny(org.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded font-bold"
                  >
                    DENY
                  </button>
                  <button
                    onClick={() => onApprove(org.id)}
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
    </div>
  );
};

export default OrgApprovalsTable;