"use client"

import { SVGFilter } from "@/public/svg/icon"
import { useState, useEffect,useRef  } from 'react';
import {SVGClose} from '@/public/svg/icon';
import { Menu, MenuButton, MenuItem, MenuItems, Textarea } from '@headlessui/react'

// import { ChevronDownIcon } from '@heroicons/react/20/solid'

export default function FilterProgram({filterProgram}) {
   const alertifyRef = useRef(null);
   const [showPopup, setShowPopup] = useState(false);
   const [popupVisible, setPopupVisible] = useState(false);
   const [filterPublished, setFilterPublished] = useState<string>("All");
   const [startDate, setStartDate] = useState<string>("");
   const [endDate, setEndDate] = useState<string>("");
   const [courseName, setCourseName] = useState<string>("");

   useEffect(() => {
      if (typeof window !== 'undefined') {
        import('alertifyjs').then((alertify) => {
          alertifyRef.current = alertify;
        });
      }
    }, []);

   const openPopup = () => {
      setPopupVisible(true);
      setTimeout(() => {
        setShowPopup(true);
      }, 50); // Delay to match the popup in animation
    };

   const closePopup = () => {
      setShowPopup(false);
      setTimeout(() => {
        setPopupVisible(false);
      }, 500);
    };

    const Filter = () => {
      if (startDate === null && endDate === null) {
         const appliedFilter = {
            status: filterPublished,
            startDate,
            endDate,
            courseName,
         };
         filterProgram(appliedFilter);
      }else {
         if (startDate > endDate) {
         return alertifyRef.current.error("Start date must be less than end date");
         }
         const appliedFilter = {
            status: filterPublished,
            startDate,
            endDate,
            courseName,
         };
         filterProgram(appliedFilter);
         }
      closePopup();
    }

   return(
      <>
         <button onClick={() => openPopup()} className="text-gray-500 flex items-center px-3 py-2 rounded-lg border-1 border-gray-400 shadow hover:bg-gray-200 active:bg-gray-400 transition">
            <SVGFilter height={16} width={16} className="mb-1"/>
            <p className="ms-1 font-medium">Filter</p>
         </button>
         {popupVisible && (
            <div className={`fixed inset-0 flex justify-center bg-black bg-opacity-50 z-50  ${showPopup ? 'opacity-100' : 'opacity-0'} transition duration-300`}>
               <div className={`absolute translate-y-[20vh] bg-white p-6 rounded-lg shadow-lg min-w-[345px] mx-4 ${showPopup ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'} transition duration-300`}>
                  <button onClick={closePopup} className="absolute top-3 right-4 text-gray-600 hover:text-gray-900">
                  <SVGClose height={15} width={15} className='hover:rotate-90 transition' />
                  </button>
                  <h2 className="text-xl font-semibold mb-4 text-center">Filter Program</h2>
                  <div className="grid">
                     <div className='flex mt-5 items-center'>
                        <p className="w-[100px]">Status</p>
                        <Menu as="div" className="relative inline-block text-left">
                           <div>
                           <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                              {filterPublished}
                           </MenuButton>
                           </div>

                           <MenuItems
                           transition
                           className="absolute left-0 z-10 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                           >
                           <div className="py-1">
                              <MenuItem>
                                 <button onClick={() => { 
                                    setFilterPublished("Published"); 
                                    setCourseName(""); 
                                    setStartDate(""); 
                                    setEndDate(""); 
                                    }} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 w-full text-left">
                                 Publish
                                 </button>
                              </MenuItem>
                              <MenuItem>
                                 <button onClick={() => {
                                    setFilterPublished("Unpublish")
                                    setCourseName(""); 
                                    setStartDate(""); 
                                    setEndDate("");
                                    }} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 w-full text-left">
                                 Unpublish
                                 </button>
                              </MenuItem>
                              <MenuItem>
                                 <button onClick={() => {
                                    setFilterPublished("All")
                                    setCourseName(""); 
                                    setStartDate(""); 
                                    setEndDate("");
                                    }} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 w-full text-left">
                                 All
                                 </button>
                              </MenuItem>
                           </div>
                           </MenuItems>
                        </Menu>
                     </div>
                     <div className='flex mt-5 items-center'>
                        <p className="w-[100px]">Start Date</p>
                        <input value={startDate}  onChange={(e) => { setStartDate(e.target.value); filterPublished !== "All" && setFilterPublished("All"); }} className="bg-white rounded border px-3 shadow" type="date" name="start-date" id="start-date" />
                     </div>
                     <div className='flex mt-5 items-center'>
                        <p className="w-[100px]">End Date</p>
                        <input value={endDate} onChange={(e) => { setEndDate(e.target.value); filterPublished !== "All" && setFilterPublished("All"); }} className="bg-white rounded border px-3 shadow" type="date" name="start-date" id="start-date" />
                     </div>
                     <div className='flex mt-5 items-center'>
                        <p className="w-[100px]">Course Name</p>
                        <Textarea value={courseName} onChange={(e) => { setCourseName(e.target.value); filterPublished !== "All" && setFilterPublished("All"); }} className="bg-white rounded border px-3 shadow" name="start-date" id="start-date" />
                     </div>
                     <button onClick={() => Filter()} className="bg-white border rounded px-3 py-1 mt-5 ms-auto font-medium hover:bg-gray-100 active:bg-gray-200">Filter</button>
                  </div>
               </div>
            </div>
         )}
      </>
   )
}