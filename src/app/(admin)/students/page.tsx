'use client';

import React, { useState } from 'react';
import { MoreHorizontal, ChevronDown, Search } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  hours: string;
}

const mockStudents: Student[] = [
  { id: '1', name: 'John Doe', email: 'STXXXXXXXX@lekkaacademy.co.za', hours: '02:00:00' },
  { id: '2', name: 'Jane Smith', email: 'STXXXXXXXX@lekkaacademy.co.za', hours: '05:30:00' },
  { id: '3', name: 'Alice Johnson', email: 'STXXXXXXXX@lekkaacademy.co.za', hours: '10:15:00' },
  { id: '4', name: 'Bob Williams', email: 'STXXXXXXXX@lekkaacademy.co.za', hours: '01:45:00' },
  { id: '5', name: 'Charlie Brown', email: 'STXXXXXXXX@lekkaacademy.co.za', hours: '08:00:00' },
  { id: '6', name: 'Diana Prince', email: 'STXXXXXXXX@lekkaacademy.co.za', hours: '03:20:00' },
  { id: '7', name: 'Ethan Hunt', email: 'STXXXXXXXX@lekkaacademy.co.za', hours: '06:45:00' },
  { id: '8', name: 'Fiona Apple', email: 'STXXXXXXXX@lekkaacademy.co.za', hours: '00:30:00' },
  { id: '9', name: 'George Lucas', email: 'STXXXXXXXX@lekkaacademy.co.za', hours: '12:00:00' },
  { id: '10', name: 'Hannah Montana', email: 'STXXXXXXXX@lekkaacademy.co.za', hours: '04:15:00' }
];

const StudentsPage: React.FC = () => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const calculateStatus = (hours: string): 'COMPLETE' | 'INCOMPLETE' => {
    const [h = 0, m = 0] = hours.split(':').map(Number);
    const totalHours = h + m / 60;
    return totalHours >= 4 ? 'COMPLETE' : 'INCOMPLETE';
  };

  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <th className="p-2"></th>
              <th className="p-2 text-left">STUDENT NAME <ChevronDown className="inline" /></th>
              <th className="p-2 text-left">EMAIL</th>
              <th className="p-2 text-left">HOURS</th>
              <th className="p-2 text-left">STATUS</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const status = calculateStatus(student.hours);
              return (
                <tr key={student.id} className={`border-b ${selectedStudents.includes(student.id) ? 'bg-lime-100' : ''}`}>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-2">{student.name}</td>
                  <td className="p-2">{student.email}</td>
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
