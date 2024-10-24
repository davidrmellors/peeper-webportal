'use client';

import React, { useEffect, useState } from 'react';
import { MoreHorizontal, Search } from 'lucide-react';
import { api } from "~/trpc/react";
import StudentsSkeleton from '~/app/_components/StudentsSkeleton';
import StudentActionModal from '~/app/_components/StudentActionModal';
import GenerateReportModal from '~/app/_components/GenerateReportModal';
import { Student } from '~/server/db/databaseClasses/Student';

const StudentsPage: React.FC = () => {
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const { data: students, isLoading } = api.student.getAllStudents.useQuery();

  const handleSelectStudent = (studentId: string) => {
    console.log(studentId);
    setIsChecked(!isChecked);
    setSelectedStudents(prev => 
      prev.some(student => student.student_id === studentId) 
        ? prev.filter(student => student.student_id !== studentId)
        : [...prev, students?.find(student => student.student_id === studentId)!]
    );
  };


  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents);
    }
    setSelectAll(!selectAll);
  };

  

  const calculateStatus = (hours: number): 'COMPLETE' | 'INCOMPLETE' => {
    return hours >= 4 ? 'COMPLETE' : 'INCOMPLETE';
  };

  const filteredStudents = students?.filter(student => 
    student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  const handleMoreClick = (e: React.MouseEvent) => {
    console.log(selectedStudents);
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 200, // Adjust this value to position the modal
    });

    setModalOpen(true);
  };

  const handleEdit = () => {
    if (selectedStudentId) {
      // Implement edit functionality
      console.log('Edit student:', selectedStudentId);
    }
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
    if (selectedStudentId) {
      // Implement delete functionality
      console.log('Delete student:', selectedStudentId);
    }
    setModalOpen(false);
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
        <button onClick={handleMoreClick} className="bg-lime-500 text-white px-4 py-2 rounded-lg flex items-center">
          MANAGE <span className="ml-2 bg-white text-lime-500 rounded-full w-5 h-5 flex items-center justify-center">{selectedStudents.length}</span>
        </button>
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
              return (
                <tr key={student.student_id} className={`border-b ${selectedStudents.some(s => s.student_id === student.student_id) ? 'bg-lime-100' : ''}`}>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedStudents.some(s => s.student_id === student.student_id)}
                      onChange={() => handleSelectStudent(student.student_id)}
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
        selectedStudents={selectedStudents}
        onClose={() => setReportModalOpen(false)}
        onGenerate={handleGenerateReportSubmit}
      />
    </div>
  );
};

export default StudentsPage;
