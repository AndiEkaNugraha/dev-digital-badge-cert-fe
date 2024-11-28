"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useState, useEffect } from 'react';

interface FilterParticipantProps {
  filterParticipant: (filter: string) => void;
}

export default function FilterParticipant({ filterParticipant }: FilterParticipantProps) {
  const [filterPublished, setFilterPublished] = useState<string>("All");

  useEffect(() => {
    // Memanggil fungsi filterParticipant saat filterPublished berubah
    filterParticipant(filterPublished);
  }, [filterPublished, filterParticipant]);

  return (
    <Menu as="div" className="relative inline-block text-left ms-auto">
      <div>
        <MenuButton className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-[100px]">
          {filterPublished}
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute left-0 z-10 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
        <MenuItem>
            <button
              onClick={() => setFilterPublished("All")}
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 w-full text-left"
            >
              All
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={() => setFilterPublished("Published")}
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 w-full text-left"
            >
              Publish
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={() => setFilterPublished("unpublish")}
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 w-full text-left"
            >
              Unpublish
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
