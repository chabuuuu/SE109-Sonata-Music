"use client";

import React from "react";
import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Edit, Settings } from 'lucide-react';

export default function SongManagementAdmin() {
  const [currentPage, setCurrentPage] = useState(2);
  //setting the hooks for time but havent got function to change it
  const [timeFilter, setTimeFilter] = useState('Last 7 days');
  
  // Sample data from the image
  const songs = [
    { id: 1, date: '24 Apr', title: 'Security Awareness', contributor: 'Keithlyn O\'Hara', approved: 'pending' },
    { id: 2, date: '16 Feb', title: 'Induction program: Office user manual', contributor: 'Matthew Brandstock', approved: 'pending' },
    { id: 3, date: '16 Feb', title: 'Induction program: Security', contributor: 'Chris Columbus', approved: 'pending' },
    { id: 4, date: '11 Feb', title: 'Induction program: Capability profile and corporate CV, Dashboard Overview', contributor: 'Chris Columbus', approved: 'pending' },
    { id: 5, date: '03 Feb', title: 'Induction program: Career development in company', contributor: 'Arnold Harris', approved: 'pending' },
    { id: 6, date: '01 Feb', title: 'Induction program: Office policy', contributor: 'Arnold Harris', approved: 'pending' },
    { id: 7, date: '24 Apr', title: 'Security Awareness', contributor: 'Keithlyn O\'Hara', approved: 'pending' },
    { id: 8, date: '16 Feb', title: 'Induction program: Office user manual', contributor: 'Matthew Brandstock', approved: 'pending' },
    { id: 9, date: '16 Feb', title: 'Induction program: Security', contributor: 'Chris Columbus', approved: 'pending' },
    { id: 10, date: '11 Feb', title: 'Induction program: Capability profile and corporate CV, Dashboard Overview', contributor: 'Chris Columbus', approved: 'pending' },
    { id: 11, date: '03 Feb', title: 'Induction program: Career development in company', contributor: 'Arnold Harris', approved: 'approved' },
    { id: 12, date: '01 Feb', title: 'Induction program: Office policy', contributor: 'Arnold Harris', approved: 'approved' },
  ];
  
  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium">
          Dashboard
        </button>
        <div className="flex gap-2">
          <button className="rounded-full p-2 border border-sky-900/70 bg-white">
            <Settings size={18} className="text-sky-900/70" />
          </button>
          <div >
            <button className="flex items-center gap-2 border border-sky-900/70 bg-white rounded-md px-3 py-1.5 text-sm text-sky-900/70">
              {timeFilter}
              <ChevronDown size={16} />
            </button>
          </div>
          <button className="flex items-center gap-2 border border-sky-900/70 bg-white rounded-md px-3 py-1.5 text-sm text-sky-900/70">
            <img src="../../Download_icon.svg" alt="download icon down arrow" />
            Download as CSV
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h1 className="text-xl font-bold text-black ">Uninspected Songs</h1>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Songs</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Contributors</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-1">
                    Approved
                    <ChevronDown size={16} className="text-blue-600" />
                  </div>
                </th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr key={song.id} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-sm text-gray-600">{song.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{song.title}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{song.contributor}</td>
                  <td className="py-3 px-4">
                    {song.approved === 'pending' ? (
                      <div className="bg-yellow-500 text-white text-xs font-medium py-1 px-2 rounded-full w-16 text-center">
                        Pending
                      </div>
                    ) : (
                      <div className="bg-green-500 text-white text-xs font-medium py-1 px-1 rounded-full w-16 text-center">
                        Approved
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-500"> 
                      {/* using lucide icon */}
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="py-3 px-4 flex items-center justify-center border-t border-gray-200">
          <div className="flex items-center">
            <button className="flex items-center text-gray-500 text-sm gap-1">
              <ChevronLeft size={16} />
              Previous
            </button>
          </div>
          {/* normal chosen css can change later on */}
          <div className="flex items-center gap-2">
            <button className="h-8 w-4 flex items-center justify-center rounded-md text-black">1</button>
            <button className="h-8 w-4 flex items-center justify-center rounded-md text-blue-500 underline">2</button>
            <button className="h-8 w-4 flex items-center justify-center rounded-md text-black">3</button>
            <button className="h-8 w-4 flex items-center justify-center rounded-md text-black">5</button>
            <button className="h-8 w-4 flex items-center justify-center rounded-md text-black">4</button>
            <span className="text-gray-600">...</span>
            <button className="h-8 w-8 flex items-center justify-center rounded-md text-black">31</button>
            <button className="flex items-center text-blue-500 text-sm gap-1">
              Next
              <ChevronRight size={16} />
            </button>
          </div>
          <div>
            <button className="text-blue-500 text-sm ">Show all</button>
          </div>
        </div>
      </div>
    </div>
  );
}
