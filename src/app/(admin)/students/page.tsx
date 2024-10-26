'use client';

import React, { useCallback, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { api } from "~/trpc/react";
import StudentsSkeleton from '~/app/_components/StudentsSkeleton';
import StudentActionModal from '~/app/_components/StudentActionModal';
import GenerateReportModal from '~/app/_components/GenerateReportModal';

const StudentsPage: React.FC = () => {
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const { data: students, isLoading } = api.student.getAllStudents.useQuery();

  const filteredStudents = useMemo(() => {
    return students?.filter(student => 
      student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];
  }, [students, searchTerm]);

  const handleSelectStudent = useCallback((studentId: string) => {
    setSelectedStudentIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(filteredStudents.map(s => s.student_id)));
    }
    setSelectAll(!selectAll);
  }, [selectAll, filteredStudents]);

  const calculateStatus = (hours: number): 'COMPLETE' | 'INCOMPLETE' => {
    return hours >= 4 ? 'COMPLETE' : 'INCOMPLETE';
  };

  const handleMoreClick = () => {
    if (selectedStudentIds.size === 0) return;
    setModalOpen(true);
  };

  const handleEdit = () => {
    // Implement edit functionality
    setModalOpen(false);
  };

  const handleGenerateReport = () => {
    setReportModalOpen(true);
    setModalOpen(false);
  };
  
  const handleGenerateReportSubmit = () => {
    setReportModalOpen(false);
  };

  const handleDelete = () => {
    // Implement delete functionality
    setModalOpen(false);
  };

  const handleAddClick = () => {
      
  };

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold">STUDENTS</h1>
      
      <div className="flex justify-between items-center">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search for..."
            className="w-full p-2 pl-10 pr-4 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className='flex '>
        <button onClick={handleAddClick} className="bg-lime-500 text-white px-4 py-2 rounded-lg flex items-center">
          MANAGE <span className="ml-2 bg-white text-lime-500 rounded-full w-5 h-5 flex items-center justify-center">{selectedStudentIds.size}</span>
        </button>
        <button onClick={handleMoreClick} className="bg-lime-500 text-white px-4 py-2 rounded-lg flex items-center">
          MANAGE <span className="ml-2 bg-white text-lime-500 rounded-full w-5 h-5 flex items-center justify-center">{selectedStudentIds.size}</span>
        </button>
        </div>
       
      </div>
    {isLoading ? <StudentsSkeleton /> : (
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-lime-500 text-white">
            <tr>
              <th className="p-2 w-0">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded accent-lime-500 w-4 h-4"
                />
              </th>
              <th className="p-2 text-left">STUDENT NUMBER</th>
              <th className="p-2 text-left">HOURS</th>
              <th className="p-2 text-left">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const status = calculateStatus(student.hours);
              const isSelected = selectedStudentIds.has(student.student_id);
              return (
                <tr 
                  key={student.student_id} 
                  className={`border-b cursor-pointer hover:bg-lime-50 transition-colors duration-150 ease-in-out ${isSelected ? 'bg-lime-100' : ''}`}
                  onClick={() => handleSelectStudent(student.student_id)}
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded"
                    />
                  </td>
                  <td className="p-2">{student.studentNumber}</td>
                  <td className="p-2">{student.hours}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded ${status === 'COMPLETE' ? 'bg-lime-500 text-white' : 'bg-gray-200'}`}>
                      {status}
                    </span>
                  </td> 
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      )}
      <StudentActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEdit={handleEdit}
        onGenerateReport={handleGenerateReport}
        onDelete={handleDelete}
      />
      <GenerateReportModal
        isOpen={reportModalOpen}
        selectedStudents={filteredStudents.filter(s => selectedStudentIds.has(s.student_id))}
        onClose={() => setReportModalOpen(false)}
        onGenerate={handleGenerateReportSubmit}
      />
    </div>
  );
};

export default StudentsPage;
