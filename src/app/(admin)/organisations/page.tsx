'use client';

import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import type { OrgAddressData } from '~/server/db/interfaces/OrgAddressData';
import OrganisationsSkeleton from '~/app/_components/OrganistationsSkeleton';
import { api } from '~/trpc/react';

export interface OrganisationData {
    org_id: string;
    orgName: string;
    orgEmail: string;
    orgPhoneNo: string;
    orgLatitude: number;
    orgLongitude: number;
    orgAddress: OrgAddressData;
  }



  const OrganisationsPage: React.FC = () => {
    const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectAll, setSelectAll] = useState(false);
  
    const { data: organisations, isLoading } = api.organisation.getAllOrganisations.useQuery();

    const handleSelectAll = () => {
      if (selectAll) {
        setSelectedOrgs([]);
      } else {
        setSelectedOrgs(filteredOrgs.map(org => org.org_id));
      }
      setSelectAll(!selectAll);
    };

    const handleSelectOrg = (orgId: string) => {
      setSelectedOrgs(prev => {
        const newSelection = prev.includes(orgId) 
          ? prev.filter(id => id !== orgId)
          : [...prev, orgId];
        setSelectAll(newSelection.length === filteredOrgs.length);
        return newSelection;
      });
    };

    const filteredOrgs = organisations?.filter(org => 
      org.orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.orgEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.orgPhoneNo.includes(searchTerm)
    ) ?? [];

    return (
      <>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">ORGANISATIONS</h1>
          
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
              SELECTED <span className="ml-2 bg-white text-lime-500 rounded-full w-5 h-5 flex items-center justify-center">{selectedOrgs.length}</span>
            </button>
          </div>
          {isLoading ? <OrganisationsSkeleton /> : (
          <div className="bg-white rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-lime-500 text-white">
                <tr>
                  <th className="p-2 w-0">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded accent-lime-500"
                    />
                  </th>
                  <th className="p-2 text-left">NAME <ChevronDown className="inline" /></th>
                  <th className="p-2 text-left">EMAIL</th>
                  <th className="p-2 text-left">PHONE NO.</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrgs.map((org) => (
                  <tr 
                    key={org.org_id} 
                    className={`border-b cursor-pointer hover:bg-lime-50 transition-colors duration-150 ease-in-out ${
                      selectedOrgs.includes(org.org_id) ? 'bg-lime-100' : ''
                    }`}
                    onClick={() => handleSelectOrg(org.org_id)}
                  >
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selectedOrgs.includes(org.org_id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectOrg(org.org_id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded accent-lime-500"
                      />
                    </td>
                    <td className="p-2">{org.orgName}</td>
                    <td className="p-2">{org.orgEmail}</td>
                    <td className="p-2">{org.orgPhoneNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </>
    );
  };

export default OrganisationsPage;
