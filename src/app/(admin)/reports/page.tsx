'use client';

import React, { useState } from 'react';
import { Search, MoreHorizontal, ChevronDown } from 'lucide-react';
import { FaFolder } from 'react-icons/fa';

interface Report {
  id: string;
  name: string;
  lastModified: string;
  fileSize: string;
}

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([
    { id: '1', name: '10 Nov 2024', lastModified: '20 Nov, 2024', fileSize: '10 MB' },
    { id: '2', name: '10 Nov 2024', lastModified: '20 Nov, 2024', fileSize: '10 MB' },
    { id: '3', name: '10 Nov 2024', lastModified: '20 Nov, 2024', fileSize: '10 MB' },
    { id: '4', name: '10 Nov 2024', lastModified: '20 Nov, 2024', fileSize: '10 MB' },
    { id: '5', name: '10 Nov 2024', lastModified: '20 Nov, 2024', fileSize: '10 MB' },
    { id: '6', name: '10 Nov 2024', lastModified: '20 Nov, 2024', fileSize: '10 MB' },
    { id: '7', name: '10 Nov 2024', lastModified: '20 Nov, 2024', fileSize: '10 MB' },
    { id: '8', name: '10 Nov 2024', lastModified: '20 Nov, 2024', fileSize: '10 MB' },
    { id: '9', name: '10 Nov 2024', lastModified: '20 Nov, 2024', fileSize: '10 MB' },
    { id: '10', name: '10 Nov 2024', lastModified: '20 Nov, 2024', fileSize: '10 MB' },
    // ... add more mock data as needed
  ]);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reports.map(report => report.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleReportSelection = (id: string) => {
    setSelectedReports(prev => {
      const newSelection = prev.includes(id) 
        ? prev.filter(reportId => reportId !== id)
        : [...prev, id];
      setSelectAll(newSelection.length === reports.length);
      return newSelection;
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold">REPORTS</h1>
      
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
          SELECTED <span className="ml-2 bg-white text-lime-500 rounded-full w-5 h-5 flex items-center justify-center">{selectedReports.length}</span>
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
              <th className="p-2 text-left">NAME <ChevronDown className="inline" /></th>
              <th className="p-2 text-left">LAST MODIFIED</th>
              <th className="p-2 text-left">FILE SIZE</th>
              <th className="p-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className={`border-b ${selectedReports.includes(report.id) ? 'bg-lime-100' : ''}`}>
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.id)}
                    onChange={() => toggleReportSelection(report.id)}
                    className="rounded accent-lime-500 w-4 h-4"
                  />
                </td>
                <td className="p-2 flex items-center">
                  <FaFolder className="mr-2 text-yellow-500" />
                  {report.name}
                </td>
                <td className="p-2">{report.lastModified}</td>
                <td className="p-2">{report.fileSize}</td>
                <td className="p-2">
                  <button><MoreHorizontal /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
