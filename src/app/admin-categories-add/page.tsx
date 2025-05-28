'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import {
  FolderPlus,
  Inbox,
} from 'lucide-react';
import { ADMIN_TOKEN } from '@/constant/adminToken';

export default function AdminCategoriesPage() {
  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    try {
      const response = await fetch('https://api.sonata.io.vn/api/v1/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem(ADMIN_TOKEN),
        },
        body: JSON.stringify({ name, picture, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      const data = await response.json();
      console.log('Category created:', data);
      // Optionally, reset form or redirect
      setName('');
      setPicture('');
      setDescription('');
      alert('Category created successfully!');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category. Please try again.');
    }
  };

  const handleClear = () => {
    setName('');
    setPicture('');
    setDescription('');
  };

  return (
    <AdminLayout>
      <div className="h-full bg-gray-100 p-6 relative">
        {/* Left action buttons */}
        <div className="absolute top-6 left-6 flex space-x-4">
          <Link
            href="/admin/categories/new"
            className="w-36 h-20 bg-blue-600 text-white rounded-xl shadow-xl flex flex-col items-center justify-center"
          >
            <FolderPlus size={24} className="mb-1" />
            <span className="text-sm font-medium">Add Categories</span>
          </Link>
          <Link
            href="./admin-categories-all"
            className="w-36 h-20 bg-white text-gray-600 rounded-xl shadow border border-gray-200 flex flex-col items-center justify-center"
          >
            <Inbox size={24} className="mb-1" />
            <span className="text-sm font-medium">All</span>
          </Link>
        </div>

        {/* Main content area */}
        <div className="h-full bg-white p-6 pt-24 flex flex-col overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Categories Title */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Categories Title</label>
              <input
                type="text"
                placeholder="Enter category title"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 bg-gray-100 rounded-lg px-3 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500 border border-transparent"
              />
            </div>
            {/* Picture URL */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Picture URL</label>
              <input
                type="text"
                placeholder="Enter picture URL"
                value={picture}
                onChange={(e) => setPicture(e.target.value)}
                className="w-full h-10 bg-gray-100 rounded-lg px-3 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500 border border-transparent"
              />
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Description</label>
              <textarea
                rows={4}
                placeholder="Enter description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-100 rounded-lg p-3 placeholder-gray-400 text-black resize-none focus:ring-blue-500 focus:border-blue-500 border border-transparent"
              />
            </div>
          </div>



          {/* Action buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button 
              onClick={handleClear}
              className="w-24 h-10 bg-white text-gray-700 rounded-lg border border-gray-300"
            >
              Clear
            </button>
            <button 
              onClick={handleAdd}
              className="w-24 h-10 bg-green-500 text-white rounded-lg"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}