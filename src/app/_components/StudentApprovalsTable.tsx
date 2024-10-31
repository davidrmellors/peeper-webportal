import React from 'react';

interface Student {
  id: string;
  name: string;
  email: string;
}

interface StudentApprovalsTableProps {
  students: Student[];
  onApprove: (studentId: string) => void;
  onDeny: (studentId: string) => void;
}

/**
 * Student Approvals Table Component
 * 
 * Reusable table component for managing student approval requests.
 * Features:
 * - TypeScript interfaces for props and student data
 * - Approve/Deny functionality
 * - Responsive table design
 * - Consistent styling with main application theme
 */
const StudentApprovalsTable: React.FC<StudentApprovalsTableProps> = ({ students, onApprove, onDeny }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-lime-500 text-white">
          <tr>
            <th className="py-3 px-4 text-left">EMAIL</th>
            <th className="py-3 px-4 text-center">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b border-gray-200">
              <td className="py-3 px-4">{student.email}</td>
              <td className="py-3 px-4">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onDeny(student.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded font-bold"
                  >
                    DENY
                  </button>
                  <button
                    onClick={() => onApprove(student.id)}
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

export default StudentApprovalsTable;