'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import {
  FolderPlus,
  Inbox,
  Cog,
  ChevronDown,
  Download,
  Calendar,
  CloudUpload,
  MinusCircle,
  PlusCircle,
} from 'lucide-react';

const mockItems = ['E_Interview', 'E_Bench_Engineering'];

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<string[]>(['']);

  const addRow = () => setRows((prev) => [...prev, '']);
  const updateRow = (i: number, val: string) =>
    setRows((prev) => prev.map((v, idx) => (idx === i ? val : v)));
  const removeRow = (i: number) =>
    setRows((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <AdminLayout>
      <div className="h-full bg-gray-100 p-6 relative">
        {/* Left action buttons */}
        <div className="absolute top-6 left-6 flex space-x-4">
          {/* Add Categories */}
          <Link
            href="/admin/categories/new"
            className="w-36 h-20 bg-blue-600 text-white rounded-xl shadow-xl flex flex-col items-center justify-center"
          >
            <FolderPlus size={24} className="mb-1" />
            <span className="text-sm font-medium">Add Categories</span>
          </Link>

          {/* All */}
          <Link
            href="/adminall"
            className="w-36 h-20 bg-white text-gray-600 rounded-xl shadow border border-gray-200 flex flex-col items-center justify-center"
          >
            <Inbox size={24} className="mb-1" />
            <span className="text-sm font-medium">All</span>
          </Link>
        </div>

        {/* Right controls */}
        <div className="absolute top-6 right-6 flex items-center space-x-3">
          <button className="w-10 h-10 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-center">
            <Cog size={20} />
          </button>
          <button className="inline-flex items-center bg-white rounded-lg shadow border border-gray-200 px-3 h-10">
            <span className="text-sm text-gray-800">Last 7 days</span>
            <ChevronDown size={16} className="ml-1 text-gray-400" />
          </button>
          <button className="inline-flex items-center bg-white rounded-lg shadow border border-gray-200 px-3 h-10">
            <span className="text-sm text-gray-800">Download as CSV</span>
            <Download size={16} className="ml-1" />
          </button>
        </div>

        {/* Main content area (no rounding, no shadow) */}
        <div className="h-full bg-white p-6 pt-24 flex flex-col overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Categories Title */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Categories Title</label>
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-10 bg-gray-100 rounded-lg px-3 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500 border border-transparent"
              />
            </div>
            {/* Release Date */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Release Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full h-10 bg-gray-100 rounded-lg px-3 pr-10 text-black focus:ring-blue-500 focus:border-blue-500 border border-transparent cursor-pointer"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <Calendar size={20} className="text-gray-400" />
                </div>
              </div>
            </div>
            {/* Upload Cover Art */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Upload Cover Art</label>
              <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white">
                <CloudUpload size={32} className="mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Select a file or drag and drop here</p>
                <p className="text-xs text-gray-400 mb-2">
                  JPG, PNG or PDF; file size no more than 10MB
                </p>
                <button className="text-xs text-blue-600 font-medium underline">
                  SELECT FILE
                </button>
              </div>
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Description</label>
              <textarea
                rows={4}
                placeholder="Enter description..."
                className="w-full bg-gray-100 rounded-lg p-3 placeholder-gray-400 text-black resize-none focus:ring-blue-500 focus:border-blue-500 border border-transparent"
              />
            </div>
          </div>

          {/* Upload Songs/Albums */}
          <div className="mt-8 flex-1 flex flex-col">
            <label className="block text-sm text-gray-700 mb-3">Upload Songs/Albums</label>
            <div className="flex-1 overflow-auto space-y-4">
              {rows.map((val, idx) => (
                <div key={idx} className="flex items-center bg-gray-50 rounded-lg px-4 h-12">
                  <button onClick={() => removeRow(idx)} className="text-blue-600 hover:text-blue-800 mr-3">
                    <MinusCircle size={20} />
                  </button>
                  <select
                    value={val}
                    onChange={(e) => updateRow(idx, e.target.value)}
                    className="flex-1 bg-gray-100 rounded-lg px-3 h-10 text-black focus:ring-blue-500 focus:border-blue-500 border border-transparent"
                  >
                    <option value="" disabled>
                      Songs/Albums
                    </option>
                    {mockItems.map((it) => (
                      <option key={it} value={it}>
                        {it}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <button onClick={addRow} className="mt-4 inline-flex items-center text-blue-600 font-medium">
              <PlusCircle size={20} className="mr-1" />
              Add row
            </button>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button className="w-24 h-10 bg-white text-gray-700 rounded-lg border border-gray-300">
              Clear
            </button>
            <button className="w-24 h-10 bg-green-500 text-white rounded-lg">
              Add
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
