"use client"

import * as XLSX from 'xlsx';
import { useEffect, useState } from 'react';
import { SVGClose } from "@/public/svg/icon";
import { Student, StatusGraduation } from '@/components/interface/pushCourseInterface';
import { useAuth } from '@/components/context/authContext';
import Link from 'next/link';

interface BulkAddStudentProps {
   onAddStudent: (student: typeAdd) => void;
}
interface typeAdd {
   student: Student[];
   status: string
}

export default function BulkAddStudent({onAddStudent}:BulkAddStudentProps) {
   const {userData} = useAuth()

   const [popUpVisible, setPopUpVisible] = useState(false);
   const [jsonData, setJsonData] = useState(null);
   
   useEffect(()=> {
      const overlay = document.getElementById("bulkAdd__popUpOverlay");
      const popUp = document.getElementById("bulkAdd__popUp");
      if (popUp) {
         setTimeout(() => {
            overlay?.classList.replace("opacity-0", "opacity-50");
            popUp?.classList.replace("opacity-0", "opacity-100");
         }, 100);
      }
   },[popUpVisible])

   const closePopUp = () => {
      const overlay = document.getElementById("bulkAdd__popUpOverlay");
      const popUp = document.getElementById("bulkAdd__popUp");
      overlay?.classList.replace("opacity-50", "opacity-0");
      popUp?.classList.replace("opacity-100", "opacity-0");
      setTimeout(() => {
         setPopUpVisible(false);
      }, 550);
   };

   const onUpload = async(event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files[0];;
      if (!file) return;
      const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });

            // Membaca sheet pertama
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Mengubah data menjadi JSON
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 'A' }).slice(1);
            setJsonData(json);
        };
        reader.readAsArrayBuffer(file);
   }

   const onAdd = async() => {
      if (!jsonData) return;
      const date = new Date();
      const newStudent:typeAdd = {
         student : 
            jsonData.map((student,index) => {
               return{
                  lmsUserId:         parseInt(date.getTime().toString()) + index,
                  programId:         "",
                  certificateNumber: "",
                  lmsFullname:       student.A || "",
                  nameOnCertificate: student.B || "",
                  lmsEmail:          student.C || "",
                  deliveryEmail:     student.D || "",
                  statusGraduation:  StatusGraduation.Passed,
                  linkAchievement:   "",
                  linkProfileBadge:  "",
                  linkCertificate:   "",
                  lmsProfilePicture: "",
                  lmsDepartment:     student.K || "",
                  lmsPhone1:         (student.E).toString() || "",
                  lmsPhone2:         (student.F).toString() || "",
                  lmsAddress:        student.H || "",
                  lmsCompany:        student.J || "",
                  lmsBioDecription:  student.I || "",
                  lmsLinkedin:       student.G || "",
                  createdBy:         userData?userData.fullname:"unknown",
               }
            })
         ,
         status:"create"
      }
      onAddStudent(newStudent)
   }

   return (
      <>
         <button 
            onClick={() => setPopUpVisible(true)}
            className='font-medium px-3 py-2 rounded border shadow hover:bg-slate-100 active:bg-slate-200 transition'>
            Bulk Add
         </button>

         {popUpVisible && (
            <>
               <div id="bulkAdd__popUpOverlay" className="transition duration-500 opacity-0 fixed top-0 left-0 bg-black w-screen h-screen z-30 "></div>
               <div id="bulkAdd__popUp" className="transition duration-500 opacity-0 fixed top-1/2 left-1/2 grid gap-3 transform -translate-x-1/2 -translate-y-1/2 bg-white z-30 min-w-[500px] p-5 rounded-lg border shadow max-h-[95vh] overflow-auto">
                  <button className="absolute top-3 right-3 hover:rotate-90 transition" onClick={closePopUp}>
                     <SVGClose height={15} width={15} className=""/>
                  </button>
                  <p className='font-semibold text-sky-600 text-lg'>Bulk Add Student</p>
                  <div className='grid justify-center mt-5'>
                     <input 
                        className='rounded shadow px-3 py-5 bg-gray-100 border-dashed border-2 border-gray-500' 
                        type="file" accept=".xlsx, .xls"
                        onChange={onUpload}
                        />
                     <Link className='text-gray-500 mt-2 font-semibold text-sm underline' href="/file/example.xlsx">Download Template</Link>
                  </div>
                  
                  <button
                     onClick={ () => 
                        {
                           onAdd ();
                           closePopUp();
                        }}
                     className='mt-5 font-medium px-3 py-2 rounded border shadow text-white bg-sky-500 hover:bg-sky-600 active:bg-sky-800 transition'>
                     Upload
                  </button> 
               </div>
            </>
         )}
      </>
   )
}