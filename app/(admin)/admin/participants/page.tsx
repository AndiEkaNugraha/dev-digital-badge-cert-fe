"use client"

import {SVGSearch} from "@/public/svg/icon"
import axios from 'axios'
import { useEffect,useState, useRef } from "react"
import { SVGChevronLeft, SVGChevronRight,  SVGClose } from "@/public/svg/icon"
import ButtonGenerate from "./_buttonGenerate"
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false }); // Import Quill secara dinamis
import 'react-quill/dist/quill.snow.css'; // Import CSS Quill
import FilterParticipant from './_filter'
import { useAuth } from "@/components/context/authContext"

export default function Participants() {
   const {userData} = useAuth();
   const alertifyRef = useRef(null);
   const [totalPage, setTotalPage] = useState(1);
   const [page, setPage] = useState(1);
   const [search, setSearch] = useState<string>('');
   const [Participants, setParticipants] = useState([]);
   const [emailSend, setEmailSend] = useState<string>('');
   const [isPopupVisible, setIsPopupVisible] = useState(false);
   const [nameonCertificate, setNameonCertificate] = useState<string>('');
   const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
   const [statusGraduation, setStatusGraduation] = useState<string>('');
   const [titleEmail, setTitleEmail] = useState<string>('');
   const [bodyEmail, setBodyEmail] = useState<string>('');
   const [participantChecked, setParticipantChecked] = useState<any[]>([]);
   const [filterPublished, setFilterPublished] = useState<string>("");

   const getParticipants = async (search:string, page:number) => {
      try {
         setParticipants([]);
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/published-participant?search=${search}&page=${page}`);
         const data = response.data.data.items;
         setParticipants(data);
         setTotalPage(response.data.data.totalPages);
      } catch (error) {
         alertifyRef.current.error(error);
      }
   }
   const getParticipantFilter = async(page:number) => {
      try {
         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}cms/published-participant/filter`, {
            "statusPublish": filterPublished,
            "page": page
         })
         const data = await response.data.data.items;
         setParticipants(data);
         setTotalPage(response.data.data.totalPages);
         console.log(response)
      }catch(error){{
         console.log(error)
         }
      }
   }

   useEffect(() => {
      if (typeof window !== 'undefined') {
         import('alertifyjs').then((alertify) => {
            alertifyRef.current = alertify;
          });
      getParticipants('',1);
      }
   }, []);

   useEffect(() => {
      console.log(search,page,filterPublished)
      if (filterPublished !== 'All' && filterPublished !== "") {
         getParticipantFilter(page);
      }
      else {
         getParticipants(search,page);
      }
   }, [search,page,filterPublished]);

   const handleClickButton = (participant: any) => {
      setNameonCertificate(participant.nameOnCertificate);
      setEmailSend(participant.deliveryEmail);
      setIsPopupVisible(true);
      setSelectedParticipant(participant)
      setStatusGraduation(participant.statusGraduation);
   }

   const handleClosePopup = () => {
      setIsPopupVisible(false);
   }

   const sendEmail = async (participant) => {
      if(!titleEmail || !bodyEmail){
      return alertifyRef.current.error("Email not sent. Please fill Title and Body Email");
      }
      try{
         const republish = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}cms/published-participant/republish`, {
            "programId": participant.programId,
            "participantId": participant.id,
            "title": titleEmail,
            "body": bodyEmail,
            "updatedBy": userData?.fullname
         })
         const sendEmail = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}cms/published-program/resend-certificate`, {
            "programId": participant.programId,
            "participantIds": [participant.id],
         })
         alertifyRef.current.success("Email sent successfully");
      }catch(error){
         alertifyRef.current.error("Failed to Send Email");
      }
   }

   const handleUpdateParticipant = async (participant:object) => {
      if(!titleEmail || !bodyEmail){
         return alertifyRef.current.error("Email not sent. Please fill Title and Body Email");
      }
      try{
         const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}cms/published-participant/${selectedParticipant.id}`,
         {
            "nameOnCertificate": nameonCertificate,
            "deliveryEmail": emailSend,
            "statusGraduation": statusGraduation,
            "updatedBy": userData?.fullname
         })
         sendEmail(participant)
         getParticipants('',page);
         setIsPopupVisible(false);
         alertifyRef.current.success("Participant updated successfully");
      }catch(error){
         alertifyRef.current.error("Participant failed to update");
      }
   }

   const handleCheckboxChange = (participant: any) => {
      if (participantChecked.some((checked) => checked.id === participant.id)) {
         // Hapus peserta dari array jika sudah dipilih
         setParticipantChecked(
            participantChecked.filter((checked) => checked.id !== participant.id)
         );
      } else {
         // Tambahkan peserta ke array dan urutkan berdasarkan certificateId
         const updatedParticipants = [...participantChecked, participant];
         updatedParticipants.sort((a, b) => a.publishProgram.certificateId - b.publishProgram.certificateId);
         setParticipantChecked(updatedParticipants);
      }
   };

   const filter = (filterPublished) => {
      // setPage(1);
      setFilterPublished(filterPublished);
   }

   return (
      <div className="ms-[65px]">
      <div className="w-max-container mx-auto my-6 px-6">
         <h1 className="text-3xl font-semibold text-green-500">List Participant</h1>
         <div className="flex items-center mt-7 gap-5">
            <FilterParticipant filterParticipant={filter}/>
            <div className={`flex ${filterPublished !== 'All'? 'bg-gray-200' : 'bg-white'}  rounded-lg items-center ps-5 p-2 border-1 border-gray-400 shadow w-[300px]`}>
               <input
                  disabled = {filterPublished !== 'All'}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`font-medium text-gray-600 ${filterPublished !== 'All'? 'bg-gray-200' : 'bg-white'}focus:border-none outline-none w-full`}
                  type="text"
                  placeholder={filterPublished !== 'All'? 'Set filter to all' : 'Search'}
               />
               <SVGSearch />
            </div>
         </div>
         
         {
            Participants.length === 0 ? <p>No Data</p> : 
            <div className="bg-white rounded-xl mt-7 p-6 border border-gray-100 shadow">
               <div className="text-end mb-5">
                  <ButtonGenerate participants={participantChecked}/>
                  
               </div>
               <div>
                  {participantChecked.length === 0 ? '' : (
                     <div className="flex flex-wrap gap-3 mb-3">
                        {participantChecked.map((participantChoose: any) => (
                           <div className="font-medium text-sm bg-gray-200 rounded-full px-5 py-1 flex align-middle" key={participantChoose.id}>
                              <p className="text-gray-600">{participantChoose.nameOnCertificate}</p>
                              <button className="ms-3" onClick={() => handleCheckboxChange(participantChoose)}><SVGClose height={10} width={10} className={'text-gray-500'}/></button>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            <table className="w-full text-center rounded-lg table-auto border border-white border-collapse">
            <thead>
               <tr>
                  <th className="px-4 text-emerald-900 bg-green-300 rounded-tl-2xl py-3 font-semibold border-4 border-white"></th>
                  <th className="px-4 text-emerald-900 bg-green-300 py-3 font-semibold border-4 border-white">id</th>
                  <th className="px-4 text-emerald-900 bg-green-300 py-3 font-semibold border-4 border-white">Name</th>
                  <th className="px-4 text-emerald-900 bg-green-300 py-3 font-semibold border-4 border-white">Name on Certificate</th>
                  <th className="px-4 text-emerald-900 bg-green-300 py-3 font-semibold border-4 border-white">Send Email to</th>
                  <th className="px-4 text-emerald-900 bg-green-300 py-3 font-semibold border-4 border-white">Course</th>
                  <th className="px-4 text-emerald-900 bg-green-300 py-3 font-semibold border-4 border-white">Status</th>
                  <th className="px-4 text-emerald-900 bg-green-300 rounded-tr-2xl py-3 font-semibold border-4 border-white">Action</th>
               </tr>
            </thead>
            <tbody>
               {Participants.map((participant: any) => (
                  <tr key={participant.id} className="odd:bg-white even:bg-gray-200">
                     <td className="py-2 px-2 font-medium text-sm border-4 border-white">
                        <input
                           type="checkbox"
                           checked={participantChecked.some((checked) => checked.id === participant.id)}
                           onChange={() => handleCheckboxChange(participant)}
                        />
                     </td>
                     <td className="py-2 px-2 font-medium text-sm text-left border-4 border-white">{participant.id}</td>
                     <td className="py-2 px-2 font-medium text-sm text-left border-4 border-white">{participant.lmsFullname}</td>
                     <td className="py-2 px-2 font-medium text-sm text-left border-4 border-white">{participant.nameOnCertificate}</td>
                     <td className="py-2 px-2 font-medium text-sm text-left border-4 border-white">{participant.deliveryEmail}</td>
                     <td className="py-2 px-2 font-medium text-sm text-left border-4 border-white">{participant.publishProgram.lmsCourseName}</td>
                     <td className="py-2 px-2 font-medium text-sm border-4 border-white"><div className={`px-2 py-1 text-xs text-white rounded-full ${participant.publishProgram.status === "unpublish" ? "bg-orange-500" : "bg-emerald-500"}`}>{participant.publishProgram.status}</div></td>
                     <td className="py-2 px-2 font-medium text-sm border-4 border-white">
                        <button 
                        disabled={participant.publishProgram.status === "unpublish"} 
                        onClick={() => {handleClickButton(participant)}} 
                        className={`py-1 px-4 border-2 font-medium rounded-md text-xs ${participant.publishProgram.status === "unpublish"? "bg-gray-300 text-slate-600" : "border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white focus:bg-sky-900 focus:text-white transition"} `}>
                           Edit</button>
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
         
         {/* Popup Component */}
         {(isPopupVisible && selectedParticipant)? (
               <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 transition duration-500">
                  <div className="bg-white rounded-lg p-6 mx-auto relative w-fit transition duration-500 grid opacity-1">
                     <button onClick={handleClosePopup} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition">
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                     </button>
                     <h2 className="text-xl font-semibold mb-4">{selectedParticipant.lmsFullname}</h2>
                     <div className="flex w-full mt-5 items-center">
                        <p className="w-[200px] font-medium text-sm">Name on certificate</p>
                        <input className="w-[400px] p-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md px-3 shadow outline-none focus:border-gray-500" 
                        placeholder="Input name" type="text" value={nameonCertificate} onChange={(e: any) => setNameonCertificate(e.target.value)}/></div>
                     <div className="flex w-full mt-3 items-center">
                        <p className="w-[200px] font-medium text-sm">Email send to</p>
                        <input className="w-[400px] p-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md px-3 shadow outline-none focus:border-gray-500" 
                        placeholder="Input email" type="email" value={emailSend} onChange={(e: any) => setEmailSend(e.target.value)}/>
                     </div>
                     <div className="flex w-full mt-3 items-center">
                        <p className="w-[200px] font-medium text-sm">Status graduation</p>
                        <button 
                        onClick={() => setStatusGraduation(statusGraduation === "passed" ? "failed" : "passed")}
                        className={`w-[100px] text-sm text-white font-medium p-1 px-4 rounded-full ${statusGraduation === "passed" ? "bg-emerald-600" : "bg-red-600"}`}>
                           {statusGraduation}</button>
                     </div>
                     <div className="grid w-full mt-3 items-center">
                        <p className="w-[200px] font-medium text-sm">Title Email</p>
                        <input type="text" placeholder="Input title email" value={titleEmail} onChange={(e: any) => setTitleEmail(e.target.value)}
                        className="mt-1 p-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md px-3 shadow outline-none focus:border-gray-500"/>
                     </div>
                     <div className="grid w-full mt-3 items-center">
                        <p className="w-[200px] font-medium text-sm">Body Email</p>
                        <ReactQuill onChange={setBodyEmail} value={bodyEmail} placeholder="Input body email"
                        className="mt-1 p-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md px-3 shadow outline-none focus:border-gray-500"/>
                     </div>
                     <button className="ms-auto bg-sky-600 text-white rounded-md px-5 py-[7px] mt-4 text-sm hover:bg-sky-700 active:bg-sky-900 transition"
                     onClick={() => handleUpdateParticipant(selectedParticipant)}>Republish</button>
                  </div>
               </div>
            ) : 
            (<div className="invisible fixed inset-0 bg-gray-800 bg-opacity-0 flex items-center justify-center z-50 transition duration-300">
               <div className="bg-white rounded-lg p-6 mx-auto relative w-fit transition duration-300 grid opacity-0"/>
            </div>)}
      </div>
   </div>
   )
}