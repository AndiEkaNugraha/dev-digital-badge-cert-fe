"use client"

import Link from "next/link"
import axios from 'axios'
import { useEffect,useState } from "react"
import { SVGChevronLeft, SVGChevronRight } from "@/public/svg/icon"
import FilterProgram from "./_filter";

export default function Programs() {
   const [programs, setPrograms] = useState([]);
   const [totalPage, setTotalPage] = useState(1);
   const [page, setPage] = useState(1);
   const [search, setSearch] = useState<string>('');
   const [filters, setFIlters]= useState({});
   
   const getProgram = async (search:string, page:number) => {
      try {
         setPrograms([]);
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/published-program?search=${search}&page=${page}`);
         const data = response.data.data.items;
         setPrograms(data);
         setTotalPage(response.data.data.totalPages);
      } catch (error) {
         console.log(error);
      }
   }
   useEffect(() => {
      if (typeof window !== 'undefined') {
         // Kode ini hanya akan dijalankan di client-side
         getProgram('',1);
       }
      
   }, []);

   useEffect(() => {
      if (typeof window !== 'undefined') {
         if (filters?.status && filters.status !== "All") {
         filterStatus(page);
         } else if (filters?.startDate || filters?.endDate || filters?.courseName) {
            // Kondisi jika salah satu dari tanggal atau courseName terisi
            filterDate();
            setTotalPage(1)
         } else {
            // Kondisi default, jika tidak ada filter diterapkan atau status "All"
            getProgram(search, page);
         }
      }
   }, [search, page, filters]);
   

   const filter = (appliedFilter) => {
      if (appliedFilter.startDate === "" && appliedFilter.endDate === "" && appliedFilter.courseName === "" && appliedFilter.status === "All") {
        return setFIlters(null);
      } 
      setFIlters(appliedFilter);
      setPage(1);
   }

   const filterStatus = async(page) => {
      try{
         const filter = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}cms/published-program/filter`, 
            {  statusPublish:filters.status,
               page:page
            })
         const response = await filter.data;
         const data = response.data.items;
         setPrograms(data);
         setTotalPage(response.data.totalPages);
      }catch(error){
         console.log(error);}
      
   }
   const filterDate = async() => {
      try{
         const filter = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}cms/published-program/searchByDate`,
            {
               "startDate": filters.startDate,
               "endDate": filters.endDate,
               "courseName": filters.courseName
           })
         const response = filter;
         const data = response.data.data;
         setPrograms(data);
      }catch (error){
         console.log(error);
      }
   }

   return (
      <div className="ms-[65px]">
         <div className="w-max-container mx-auto my-6 px-6">
            <h1 className="text-3xl font-semibold text-green-500">List Programs</h1>
            <div className="flex items-center mt-7 gap-5">
               <div className='ms-auto flex bg-white '>
                  <FilterProgram filterProgram={filter} />
               </div>
               <Link href={"/admin/programs/add-course"}><button className="py-2 px-7 border-gray-400 text-gray-500 bg-white rounded-lg font-medium hover:bg-gray-100 focus:bg-gray-200 transition shadow">Add Course</button></Link>
               <Link href={"/admin/programs/get-course"}><button className="py-2 px-7 border-gray-400 text-gray-500 bg-white rounded-lg font-medium hover:bg-gray-100 focus:bg-gray-200 transition shadow">Get Course</button></Link>
            </div>
            {
               programs.length === 0 ? <p className="w-full text-center mt-10 font-semibold text-gray-500">Data not found</p> : 
               <div className="bg-white rounded-xl mt-7 p-6 border border-gray-100 shadow">
               <table className="w-full text-center rounded-lg table-auto border border-white border-collapse">
               <thead>
                  <tr>
                     <th className="px-4 text-emerald-900 bg-green-300 rounded-tl-2xl py-3 font-semibold border-4 border-white">id</th>
                     <th className="px-4 text-emerald-900 bg-green-300 py-3 font-semibold border-4 border-white">Program</th>
                     <th className="px-4 text-emerald-900 bg-green-300 py-3 font-semibold border-4 border-white">Category</th>
                     <th className="px-4 text-emerald-900 bg-green-300 py-3 font-semibold border-4 border-white">Start Date</th>
                     <th className="px-4 text-emerald-900 bg-green-300 py-3 font-semibold border-4 border-white">End Date</th>
                     <th className="px-4 text-emerald-900 bg-green-300 py-3 font-semibold border-4 border-white">Status</th>
                     <th className="px-4 text-emerald-900 bg-green-300 rounded-tr-2xl py-3 font-semibold border-4 border-white">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {programs.map((program: any) => (
                     <tr key={program.id} className="odd:bg-white even:bg-gray-200">
                        <td className="py-2 px-2 font-medium text-sm border-4 border-white">{program.id}</td>
                        <td className="py-2 px-2 font-medium text-sm text-left border-4 border-white">{program.lmsCourseName}</td>
                        <td className="py-2 px-2 font-medium text-sm border-4 border-white">{program.lmsCategoryName}</td>
                        <td className="py-2 px-2 font-medium text-sm border-4 border-white">{program.startDate}</td>
                        <td className="py-2 px-2 font-medium text-sm border-4 border-white">{program.endDate}</td>
                        <td className="py-2 px-2 font-medium text-sm border-4 border-white"><div className={`px-2 py-1 text-xs text-white rounded-full ${program.status === "unpublish" ? "bg-orange-500" : "bg-emerald-500"}`}>{program.status}</div></td>
                        <td className="py-2 px-2 font-medium text-sm border-4 border-white">
                           <Link prefetch={false} href={`/admin/programs/${program.id}`}>
                              <button className="py-1 px-4 border-2 border-sky-600 font-medium text-sky-600 rounded-md text-xs hover:bg-sky-600 hover:text-white focus:bg-sky-900 focus:text-white transition">Detail</button>
                           </Link>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            </div>
            }
            
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
                     <SVGChevronLeft height={18} width={18} className=""/>
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
                     <SVGChevronRight height={18} width={18} className=""/>
                  </button>
               </div>
            </div>
         }
            
         </div>
      </div>
   )
}