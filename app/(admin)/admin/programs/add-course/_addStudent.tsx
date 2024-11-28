"use client";
import { useState, useEffect, useRef } from "react";
import { Student, StatusGraduation } from "@/components/interface/pushCourseInterface";
import { useAuth } from "@/components/context/authContext";
import { SVGClose } from "@/public/svg/icon";

interface AddStudentProps {
   onAddStudent: (student: typeAdd) => void;
   text: string;
   useFor: string;
   student: Student
}
interface typeAdd {
   student: Student;
   status: string
}

export default function AddStudent({ onAddStudent, text, useFor, student }: AddStudentProps) {
   const { userData } = useAuth();
   const alertifyRef = useRef(null)
   const [popUpVisible, setPopUpVisible] = useState(false);

   const [studentName, setStudentName] = useState(student?.lmsFullname);
   const [studentNameCertificate, setStudentNameCertificate] = useState(student?.nameOnCertificate);
   const [studentEmail, setStudentEmail] = useState(student?.lmsEmail);
   const [studentEmailDelivery, setStudentEmailDelivery] = useState(student?.deliveryEmail);
   const [studentDepartment, setStudentDepartment] = useState(student?.lmsDepartment);
   const [studentPhone1, setStudentPhone1] = useState<number | undefined>(parseInt(student?.lmsPhone1) || undefined);
   const [studentPhone2, setStudentPhone2] = useState<number | undefined>(parseInt(student?.lmsPhone2) || undefined);
   const [studentAddress, setStudentAddress] = useState(student?.lmsAddress);
   const [studentCompany, setStudentCompany] = useState(student?.lmsCompany);
   const [studentBio, setStudentBio] = useState(student?.lmsBioDecription);
   const [studentLinkedin, setStudentLinkedin] = useState(student?.lmsLinkedin);
   
   useEffect(() => {
      if (typeof window !== 'undefined') {
         import('alertifyjs').then((alertify) => {
           alertifyRef.current = alertify;
         });
       }
   },[])

   const handleAdd = (isDelete: boolean = false) => {
      if (studentName === "") {
         return alertifyRef.current.error("Isi nama peserta!")
      }
      if (studentNameCertificate === "") {
         return alertifyRef.current.error("Isi nama pada sertifikat!")
      }
      if (studentEmail === "") {
         return alertifyRef.current.error("Isi email peserta!")
      }
      if (studentEmailDelivery === "") {
         return alertifyRef.current.error("Isi email pengiriman!")
      }
      const date = new Date();
      let phone1 = studentPhone1?.toString() || "";
      if (!phone1.startsWith("62") && phone1) {  
         phone1 = "62" + phone1;
      }
      let phone2 = studentPhone2?.toString() || "";
      if (!phone2.startsWith("62") && phone2) {  
         phone2 = "62" + phone2;
      }
      const newStudent: typeAdd = {
         student : {
         lmsUserId: student?student.lmsUserId:parseInt(date.getTime().toString()),
         programId: "",
         certificateNumber: "",
         lmsFullname: studentName,
         nameOnCertificate: studentNameCertificate,
         lmsEmail: studentEmail,
         deliveryEmail: studentEmailDelivery,
         statusGraduation: StatusGraduation.Passed,
         linkAchievement: "",
         linkProfileBadge: "",
         linkCertificate: "",
         lmsProfilePicture: "",
         lmsDepartment: studentDepartment,
         lmsPhone1: phone1,
         lmsPhone2: phone2,
         lmsAddress: studentAddress,
         lmsCompany: studentCompany,
         lmsBioDecription: studentBio,
         lmsLinkedin: studentLinkedin,
         createdBy: userData?.fullname || "Unknown",
         },
         status: isDelete === true ? "delete": useFor === "button" ? "create":"update",
      };
      onAddStudent(newStudent);
      if (useFor === "button") {
         setStudentName("");
         setStudentNameCertificate("");
         setStudentEmail("");
         setStudentEmailDelivery("");
         setStudentDepartment("");
         setStudentPhone1(undefined);
         setStudentPhone2(undefined);
         setStudentAddress("");
         setStudentCompany("");
         setStudentBio("");
         setStudentLinkedin("");
      }
      closePopUp();
   };

   const closePopUp = () => {
      const overlay = document.getElementById("addStudent__popUpOverlay");
      const popUp = document.getElementById("addStudent__popUp");

      overlay?.classList.replace("opacity-50", "opacity-0");
      popUp?.classList.replace("opacity-100", "opacity-0");

      setTimeout(() => {
         setPopUpVisible(false);
      }, 550);
   };

   

   useEffect(() => {
      const overlay = document.getElementById("addStudent__popUpOverlay");
      const popUp = document.getElementById("addStudent__popUp");

      if (popUpVisible) {
         setTimeout(() => {
            overlay?.classList.replace("opacity-0", "opacity-50");
            popUp?.classList.replace("opacity-0", "opacity-100");
         }, 100);
         
      }
   }, [popUpVisible]);

   return (
      <>
         {useFor === "button"? (() =>{return(
            <button className="px-3 py-2 font-medium rounded border shadow hover:bg-slate-100 active:bg-slate-200 transition"
               onClick={() => setPopUpVisible(true)}>
               {text}
            </button>
         )})(): (()=>{return (
            <tr className="rounded-lg shadow hover:bg-sky-500 hover:text-white transition cursor-pointer" onClick={() => setPopUpVisible(true)}>
               <td className="px-3 py-2 font-medium text-center rounded-s-lg">{student.lmsUserId}</td>
               <td className="px-3 py-2 font-medium text-center">{student.lmsFullname}</td>
               <td className="px-3 py-2 font-medium text-center">{student.nameOnCertificate}</td>
               <td className="px-3 py-2 font-medium text-center">{student.lmsEmail}</td>
               <td className="px-3 py-2 font-medium text-center rounded-e-lg">{student.deliveryEmail}</td>
            </tr>
         )})()}
         
         {popUpVisible && (
            <>
               <div id="addStudent__popUpOverlay" className="transition duration-500 opacity-0 fixed top-0 left-0 bg-black w-screen h-screen z-30 "></div>
               <div id="addStudent__popUp" className="transition duration-500 opacity-0 fixed top-1/2 left-1/2 grid gap-3 transform -translate-x-1/2 -translate-y-1/2 bg-white z-30 min-w-[50vw] p-5 rounded-lg border shadow max-h-[95vh] overflow-auto">
                  <button className="absolute top-3 right-3 hover:rotate-90 transition" onClick={closePopUp}>
                     <SVGClose height={15} width={15} className=""/>
                  </button>
                  <p className="text-xl font-semibold text-sky-600 mb-3">{text}</p>
                     <div className="flex items-center">
                        <label htmlFor="studentName" className="min-w-[220px] font-medium text-gray-500">Name <span className="text-red-600">*</span></label>
                        <input
                           value={studentName}
                           onChange={(e) => setStudentName(e.target.value)}
                           type="text"
                           name="studentName"
                           id="studentName"
                           className="w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"
                        />
                     </div>
                     
                     <div className="flex items-center">
                        <label htmlFor="studentNameCertificate" className="min-w-[220px] font-medium text-gray-500">Name on Certificate <span className="text-red-600">*</span></label>
                        <input
                           value={studentNameCertificate}
                           onChange={(e) => setStudentNameCertificate(e.target.value)}
                           type="text"
                           name="studentNameCertificate"
                           id="studentNameCertificate"
                           className="w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"
                        />
                     </div>
                     
                     <div className="flex items-center">
                        <label htmlFor="email" className="min-w-[220px] font-medium text-gray-500">Student Email <span className="text-red-600">*</span></label>
                        <input
                           value={studentEmail}
                           onChange={(e) => setStudentEmail(e.target.value)}
                           type="email"
                           name="email"
                           id="email"
                           className="w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"
                        />
                     </div>

                     <div className="flex items-center">
                        <label htmlFor="emailDelivery" className="min-w-[220px] font-medium text-gray-500">Email Delivery <span className="text-red-600">*</span></label>
                        <input
                           value={studentEmailDelivery}
                           onChange={(e) => setStudentEmailDelivery(e.target.value)}
                           type="email"
                           name="emailDelivery"
                           id="emailDelivery"
                           className="w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"
                        />
                     </div>
                     
                     <div className="flex items-center">
                        <label htmlFor="phone1" className="min-w-[220px] font-medium text-gray-500">Phone 1</label>
                        <input
                           value={studentPhone1}
                           onChange={(e) => setStudentPhone1(Number(e.target.value))}
                           type="number"
                           name="phone1"
                           id="phone1"
                           className="w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"
                        />
                     </div>

                     <div className="flex items-center">
                        <label htmlFor="phone2" className="min-w-[220px] font-medium text-gray-500">Phone 2</label>
                        <input
                           value={studentPhone2}
                           onChange={(e) => setStudentPhone2(Number(e.target.value))}
                           type="number"
                           name="phone2"
                           id="phone2"
                           className="w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"
                        />
                     </div>

                     <div className="flex items-center">
                        <label htmlFor="linkedin" className="min-w-[220px] font-medium text-gray-500">Linkedin</label>
                        <input
                           value={studentLinkedin}
                           onChange={(e) => setStudentLinkedin(e.target.value)}
                           type="text"
                           name="linkedin"
                           id="linkedin"
                           className="w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"
                        />
                     </div>

                     <div className="flex items-center">
                        <label htmlFor="adress" className="min-w-[220px] font-medium text-gray-500">Address</label>
                        <input
                           value={studentAddress}
                           onChange={(e) => setStudentAddress(e.target.value)}
                           type="text"
                           name="adress"
                           id="adress"
                           className="w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"
                        />
                     </div>

                     <div className="flex items-center">
                        <label htmlFor="bio" className="min-w-[220px] font-medium text-gray-500">Bio Description</label>
                        <input
                           value={studentBio}
                           onChange={(e) => setStudentBio(e.target.value)}
                           type="text"
                           name="bio"
                           id="bio"
                           className="w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"
                        />
                     </div>

                     <div className="flex items-center">
                        <label htmlFor="company" className="min-w-[220px] font-medium text-gray-500">Company</label>
                        <input
                           value={studentCompany}
                           onChange={(e) => setStudentCompany(e.target.value)}
                           type="text"
                           name="company"
                           id="company"
                           className="w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"
                        />
                     </div>

                     <div className="flex items-center">
                        <label htmlFor="department" className="min-w-[220px] font-medium text-gray-500">Department</label>
                        <input
                           value={studentDepartment}
                           onChange={(e) => setStudentDepartment(e.target.value)}
                           type="text"
                           name="department"
                           id="department"
                           className="w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"
                        />
                     </div>

                     <div className="w-full flex pt-3 justify-end gap-4">
                        {useFor !== "button" && (
                           <button
                              onClick={() => {
                                 handleAdd(true)
                              }}
                              className="px-3 py-2 rounded shadow hover:bg-red-600 hover:text-white active:bg-red-800 active:text-white transition">
                              Delete
                           </button>
                           )}
                        <button
                           onClick={() => {handleAdd(false)}}
                           className="px-3 py-2 rounded border shadow hover:bg-sky-500 hover:text-white active:bg-sky-700 active:text-white transition"
                        >
                           {text}
                        </button>
                  </div>
               </div>
            </>
         )}
      </>
   );
}