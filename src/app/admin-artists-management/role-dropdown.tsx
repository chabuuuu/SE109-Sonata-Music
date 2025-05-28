"use client";

import React, { useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

export interface RolesResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: string[]; // Array of role strings like "SINGER", "BAND", etc.
  errors: unknown | null;
}

interface DropdownRolesProps {
  roleArtist: RolesResponse | undefined; // Pass roles from parent
  selectedRole?: string | null; // Optional: Current selected role
  onSelectRole: (role: string | null) => void; // Callback to update parent
}

const DropdownRoles: React.FC<DropdownRolesProps> = ({
  roleArtist,
  selectedRole,
  onSelectRole,
}) => {
  // State for selected role (controlled by parent)
  const [localSelectedRole, setLocalSelectedRole] = useState<string | null>(
    selectedRole ?? null // Use nullish coalescing to handle undefined
  );

  // Sync local state with prop
  useEffect(() => {
    setLocalSelectedRole(selectedRole ?? null); // Convert undefined to null
  }, [selectedRole]);

  // Handle role selection
  const handleChange = (role: string | null) => {
    setLocalSelectedRole(role);
    onSelectRole(role); // Notify parent
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="w-full">
      {roleArtist ? (
        <Listbox value={localSelectedRole} onChange={handleChange}>
          {({ open }) => (
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-gray-100 py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300">
                <span className="block truncate text-gray-900">
                  {localSelectedRole ? formatRole(localSelectedRole) : "Select a role"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={React.Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-2"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {roleArtist.data.map((role) => (
                    <Listbox.Option
                      key={role}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                        }`
                      }
                      value={role}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {formatRole(role)}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-blue-600" : "text-blue-600"
                              }`}
                            >
                              <Check className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>
      ) : (
        <div className="text-center text-gray-500">Loading roles...</div>
      )}
    </div>
  );
};

export default DropdownRoles;
