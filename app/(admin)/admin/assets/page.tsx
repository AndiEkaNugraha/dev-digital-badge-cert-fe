"use client"
import Link from 'next/link'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { SVGSearch } from '@/public/svg/icon'
import { SVGChevronLeft, SVGChevronRight } from "@/public/svg/icon"
import Loading from './loading'

export default function Assets() {
   const [totalPage, setTotalPage] = useState(1);
   const [page, setPage] = useState(1);
   const [templates, setTemplates] = useState([]);
   const [search, setSearch] = useState("");
   const [mockUp, setMockUp] = useState([]);

   const getCertificateTemplate = async (searchTerm:string, page :number) => {
      try {
         setTemplates([]);
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/certificate`, {
            params: {
               search: searchTerm,
               page: page
            }
         });
         const data = response.data.data.items;
         setTemplates(data);
         setTotalPage(response.data.data.totalPages);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      getCertificateTemplate('',1);
   }, []);

   useEffect(() => {
      getCertificateTemplate(search,page);
   }, [search,page]);

   if(!templates) {
      return <Loading />
   }

   // const handleFilter = async (e: React.ChangeEvent<HTMLInputElement>) => {
   //    const searchTerm = e.target.value;
   //    setSearch(searchTerm);
   //    getCertificateTemplate(searchTerm, page);
   // };

   return (
      <div className='w-max-container mx-auto px-6 mb-6'>
         <div className="py-7 flex gap-5 mt-5">
            <div className='ms-auto flex bg-white rounded-lg items-center ps-5 p-2 border-1 border-gray-300 shadow w-[300px]'>
               <input
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  className='font-medium text-gray-600 bg-white focus:border-none outline-none w-full'
                  type="text"
                  placeholder='Search...'
               />
               <SVGSearch />
            </div>
            <Link href="assets/create-certificate" prefetch={false}>
               <button className="py-2 px-7 bg-sky-500 text-white rounded-lg font-medium text-lg hover:bg-sky-600 focus:bg-sky-900 transition">Create</button>
            </Link>
         </div>
         <div className='mt-7 flex flex-wrap justify-center gap-10'>
            {templates.length > 0 ? (
               templates.map((template, index) => {
                  const templateData = JSON.parse(template.file);
                  const matchingMockup = mockUp.find((item) => item.id === template.certificateTemplateId)
                  return (
                     <div key={index} className='bg-white rounded-[15px] max-w-[300px]' style={{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
                        <div className="relative py-7 px-3 rounded-[15px] shadow-lg" style={{background: 'linear-gradient(to bottom, #46e297, #3da2f4)'}}>
                           
                           <div className="absolute inset-[2px] rounded-[13px] bg-white"></div>
                           <div className="relative">
                           <Image
                                 src={`data:image/png;base64,${templateData.thumbnail}`}
                                 width={300}
                                 height={300}
                                 alt={`${template.label}`}
                              />
                           </div>
                        </div>
                        <Link prefetch={false} href={`assets/create-certificate?id=${template.id}`}><h2 className='pt-5 pb-2 px-5 font-semibold text-sky-600 text-[16px] cursor-pointer hover:text-sky-700'>{template.label}</h2></Link>
                        <p className='px-5 pb-5 font-semibold  text-[13px]'>{matchingMockup?.label}</p>
                     </div>
                     
                     
                  );
               })
            ) : (
               <div className="text-lg font-semibold text-gray-500">Data not found</div>
            )}
            
         </div>
         {/* Pagination */}
         { totalPage > 1 && 
               <div className="flex justify-between mt-5">
                  <p className="text-sm text-sky-700 font-medium">Showing <strong>{page}</strong> of <strong>{totalPage}</strong></p>
                  <div className="flex items-center">
                     <button 
                        className="px-2 py-1 bg-sky-600 rounded-lg border text-white hover:bg-sky-700 active:bg-sky-900 transition"
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        disabled={page <= 1}
                     >
                        <SVGChevronLeft height={18} width={18}/>
                     </button>
                     <input 
                        type="text" 
                        placeholder=". . ."
                        // defaultValue={page}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") {
                           const inputPage = parseInt(e.currentTarget.value, 10);
                           if (!isNaN(inputPage) && inputPage > 0 && inputPage <= totalPage && inputPage !== page) {
                              setPage(inputPage);
                           } else if (e.currentTarget.value === "") {
                              setPage(1);
                           }
                           }
                        }} 
                        onBlur={(e) => {
                           const inputPage = parseInt(e.target.value, 10);
                           if (!isNaN(inputPage) && inputPage > 0 && inputPage <= totalPage && inputPage !== page) {
                              setPage(inputPage);
                           } else if (e.target.value === "") {
                              setPage(1);
                           }
                        }}
                        className="w-[50px] py-1 text-center mx-2 outline-none border border-gray-400 rounded-md text-sm"
                     />
                     <button 
                        className="px-2 py-1 bg-sky-600 rounded-lg border text-white hover:bg-sky-700 active:bg-sky-900 transition"
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPage))}
                        disabled={page >= totalPage}
                     >
                        <SVGChevronRight height={18} width={18}/>
                     </button>
                  </div>
               </div>
            }
      </div>
   );
}
