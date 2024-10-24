'use client';

import React, { useEffect, useState } from 'react';
import { MoreHorizontal, Search } from 'lucide-react';
import { api } from "~/trpc/react";
import { Student } from "~/server/db/databaseClasses/Student";

const StudentsPage: React.FC = () => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const generateExcel = api.student.generateExcelReport.useMutation();

  const { data: students, isLoading } = api.student.getAllStudents.useQuery();

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.student_id));
    }
    setSelectAll(!selectAll);
  };

  const handleDownloadExcel = async() =>{
    if(selectedStudents.length === 0) return;
    try{
      const base64Data = await generateExcel.mutateAsync(selectedStudents);

      //Convert base64 to blob
      const binaryString = window.atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for(let i = 0; i< binaryString.length; i++){
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      
      //Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student-hours.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch(error){
      console.error('Error downloading Excel:', error);
    }
  }

  const calculateStatus = (hours: number): 'COMPLETE' | 'INCOMPLETE' => {
    return hours >= 4 ? 'COMPLETE' : 'INCOMPLETE';
  };

  const filteredStudents = students?.filter(student => 
    student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
        <button className="bg-lime-500 text-white px-4 py-2 rounded-lg flex items-center">
          SELECTED <span className="ml-2 bg-white text-lime-500 rounded-full w-5 h-5 flex items-center justify-center">{selectedStudents.length}</span>
        </button>
      </div>

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
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const status = calculateStatus(student.hours);
              return (
                <tr key={student.student_id} className={`border-b ${selectedStudents.includes(student.student_id) ? 'bg-lime-100' : ''}`}>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.student_id)}
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
                  <td className="p-2">
                    <button><MoreHorizontal /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsPage;
