'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import axios from 'axios';
import { ADMIN_TOKEN } from '@/constant/adminToken';

// Define the prop types for the SearchModal
interface SearchModalProps {
  onClose: () => void;
  fieldType: string; // The type of field being searched (e.g., "periods", "genres")
  onSelect: (selectedItems: SearchItem[]) => void; // Callback when items are selected
  existingItems?: SearchItem[]; // Items that are already selected
}

// Generic search result type
interface SearchItem {
  id: number | string;
  name: string;
  picture?: string;
  description?: string;
}

const SearchModal = ({ onClose, fieldType, onSelect, existingItems = [] }: SearchModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SearchItem[]>(existingItems || []);
  const [loading, setLoading] = useState(false);
  const BASE_URL = 'https://api.sonata.io.vn/api/v1';

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Fetch items when modal opens or search term changes
  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      try {
        // Determine which API endpoint to call based on fieldType
        let endpoint = '';
        switch (fieldType) {
          case 'periods':
            endpoint = `${BASE_URL}/period/search`;
            break;
          case 'roles':
            endpoint = `${BASE_URL}/role/search`;
            break;
          case 'orchestras':
            endpoint = `${BASE_URL}/orchestra/search`;
            break;
          case 'instruments':
            endpoint = `${BASE_URL}/instrument/search`;
            break;
          case 'genres':
            endpoint = `${BASE_URL}/genre/search`;
            break;
          case 'students':
            endpoint = `${BASE_URL}/artist/search`;
            break;
          default:
            endpoint = `${BASE_URL}/${fieldType}/search`;
        }

        // Create request body with filters for the search term
        const requestBody = {
          filters: searchTerm
            ? [
                {
                  operator: 'like',
                  key: 'name',
                  value: searchTerm,
                },
              ]
            : [], // No filters when searchTerm is empty to fetch all items
          sorts: [
            {
              key: 'name',
              type: 'ASC',
            },
          ],
        };

        // Add pagination parameters to the URL
        const paginatedEndpoint = `${endpoint}?rpp=50&page=1`; // Increased rpp to fetch more items

        // Make POST request with the proper body
        const response = await axios.post(paginatedEndpoint, requestBody, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
            'Content-Type': 'application/json',
          },
        });

        setSearchResults(response.data.data.items || []);
      } catch (error) {
        console.error(`Error searching for ${fieldType}:`, error);
        setSearchResults([]);
      }
      setLoading(false);
    };

    // Debounce the search for better performance
    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, fieldType]);

  // Toggle selection of an item
  const toggleItemSelection = (item: SearchItem) => {
    setSelectedItems((prevSelected) => {
      const isSelected = prevSelected.some((selectedItem) => selectedItem.id === item.id);
      if (isSelected) {
        return prevSelected.filter((selectedItem) => selectedItem.id !== item.id);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  // Handle adding selected items
  const handleAddItems = () => {
    onSelect(selectedItems);
    onClose();
  };

  // Check if an item is already selected
  const isItemSelected = (item: SearchItem) => {
    return selectedItems.some((selectedItem) => selectedItem.id === item.id);
  };

  // Get a display title based on the fieldType
  const getFieldTitle = () => {
    const titles: { [key: string]: string } = {
      periods: 'Musical Periods',
      roles: 'Roles',
      orchestras: 'Orchestras',
      instruments: 'Instruments',
      genres: 'Genres',
      students: 'Notable Students',
    };
    return titles[fieldType] || fieldType.charAt(0).toUpperCase() + fieldType.slice(1);
  };

  return (
    <div
      onClick={handleBackdropClick}
      className='fixed inset-0 backdrop-filter backdrop-brightness-75 backdrop-blur-md flex justify-center items-center z-50'
    >
      <div ref={modalRef} className='bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden p-5'>
        <h3 className='text-lg font-semibold mb-3 text-black'>Search {getFieldTitle()}</h3>

        <div className='bg-gray-100 p-3 flex items-center rounded-xl shadow-sm mb-3'>
          <Search className='text-gray-500 mr-2' size={20} />
          <input
            type='text'
            placeholder={`Search for ${getFieldTitle().toLowerCase()}...`}
            className='bg-transparent flex-grow outline-none text-gray-700'
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button className='p-1 rounded-full hover:bg-gray-200' onClick={() => setSearchTerm('')}>
              <X className='text-gray-500' size={20} />
            </button>
          )}
        </div>

        <div className='mb-3'>
          {selectedItems.length > 0 && (
            <div className='mb-3 p-2 bg-gray-50 rounded-lg'>
              <p className='text-sm font-medium text-gray-700 mb-2'>Selected:</p>
              <div className='flex flex-wrap gap-2'>
                {selectedItems.map((item) => (
                  <span
                    key={item.id}
                    className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center'
                  >
                    {item.name}
                    <button
                      onClick={() => toggleItemSelection(item)}
                      className='ml-1 p-1 hover:bg-blue-200 rounded-full'
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='max-h-64 overflow-y-auto bg-gray-50 rounded-lg'>
          {loading ? (
            <div className='p-4 text-center'>Loading...</div>
          ) : searchResults.length > 0 ? (
            <ul className='divide-y divide-gray-200'>
              {searchResults.map((item) => (
                <li
                  key={item.id}
                  className={`p-3 cursor-pointer hover:bg-gray-100 flex justify-between items-center ${
                    isItemSelected(item) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => toggleItemSelection(item)}
                >
                  <div>
                    <p className='font-medium text-black'>{item.name}</p>
                    {item.description && (
                      <p className='text-xs text-gray-500 truncate'>{item.description}</p>
                    )}
                  </div>
                  <input
                    type='checkbox'
                    checked={isItemSelected(item)}
                    onChange={() => {}} // Handled by parent div onClick
                    className='h-5 w-5 text-blue-600'
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className='p-4 text-center text-gray-500'>No results found</div>
          )}
        </div>

        <div className='p-3 bg-white flex justify-between mt-3'>
          <button
            onClick={onClose}
            className='px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-full hover:bg-gray-300 transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleAddItems}
            disabled={selectedItems.length === 0}
            className={`px-6 py-2 bg-green-600 text-white font-medium rounded-full transition-colors ${
              selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500'
            }`}
          >
            Add {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;