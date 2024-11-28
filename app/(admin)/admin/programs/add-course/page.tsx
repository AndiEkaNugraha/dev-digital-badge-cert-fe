"use client"
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SVGBack } from "@/public/svg/icon";
import { Skill } from "@/components/interface/skillInterface";
import {PushCourse, Student} from "@/components/interface/pushCourseInterface"
import { Certificate } from "@/components/interface/listCertificateInterface";
import { Badge } from "@/components/interface/badgeInterface";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import AddStudent from "./_addStudent";
import { useAuth } from "@/components/context/authContext";
import BulkAddStudent from "./_bulkAddStudent";

interface typeAdd {
   student: Student;
   status: string
}

export default function AddCourse () {
   const {userData} = useAuth();
   const alertifyRef = useRef(null);
   const navigate = useRouter();

   const [programName, setProgramName] = useState("")
   const [programCat, setProgramCat] = useState("")
   const [programDescription, setProgramDescription] = useState("")
   const [expiredDate, setExpiredDate] = useState("")
   const [programStart, setProgramStart] = useState("")
   const [programEnd, setProgramEnd] = useState("")

   const [listSkills, setListSkills] = useState<Skill[]>([])
   const [listCertificate, setListCertificate] = useState<Certificate[]>([])

   const [showDropdownSkill, setShowDropdownSkill] = useState(false)
   const [showDropdownCertificate, setShowDropdownCertificate] = useState(false)

   const [skillSelected, setSkillSelected] = useState<Skill[]>([])
   const [certificateSelected, setCertificateSelected] = useState<Certificate | null>(null)
   const [badge, setBadge] = useState<Badge | null>(null)

   const [listStudent, setListStudent] = useState<Student[]>([])

   useEffect(() => {
      if (typeof window !== 'undefined') {
         import('alertifyjs').then((alertify) => {
            alertifyRef.current = alertify;
            if (alertifyRef.current) {
               alertifyRef.current.alert('Perhatian', 'Hanya untuk program yang tidak tersedia di LMS!', function(){ });
            }
         });
         getSkill("");
         getCertificate("");
      }
   }, []);

   const getSkill = async(search:string|null) => {
      const query = search || "";
      try {
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/skill?search=${query}`);
         const data:Skill[] = response.data.data.items;
         setListSkills(data);
      } catch (e) {
         console.log(e);
         setListSkills([]); 
      }
   }
   const getCertificate = async(search:string | null) => {
      const query = search || "";
      try{
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/certificate?search=${query}`);
         const data:Certificate[] = response.data.data.items;
         setListCertificate(data);
      }catch(error){
         console.log(error)
      }
   }
   const handleSkillSelect = async(skill: Skill) => {
      setSkillSelected(
         prevSkills => {
            if (!prevSkills.some(existingSkill => existingSkill.id === skill.id)) {
               return [...prevSkills, skill];
            }
            return prevSkills;
         }
      )
      setShowDropdownSkill(false);
   }
   const handleCertificateSelect = async(certificate: Certificate) => {
      setCertificateSelected(certificate)
      try{
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/badge/show/${certificate.badgeId}`);
         const data:Badge = response.data;
         setBadge(data)
      }catch(error){
         console.log(error)
      }
   }
   const removeSkill = async(skill: Skill) => {
      setSkillSelected(
         prevSkills => prevSkills.filter((s) => s !== skill)
      )
   }
   const getStudent = async (student: typeAdd) => {
      setListStudent((prevListStudent) => {
        if (student.status === "create") {
          return [...prevListStudent, student.student];
        } if (student.status === "delete") {
          return prevListStudent.filter((s) => s.lmsUserId !== student.student.lmsUserId);
        }else {
          const existingStudentIndex = prevListStudent.findIndex(
            (s) => s.lmsUserId === student.student.lmsUserId
          );
          if (existingStudentIndex !== -1) {
            const newListStudent = [...prevListStudent];
            newListStudent[existingStudentIndex] = student.student;
            return newListStudent;
          } else {
            return [...prevListStudent, student.student];
          }
        }
      });
    };
   const bulkAdd = async(student) => {
      (student.student).map((eachStudent)=>{
         setListStudent((prevListStudent) => {
            return [...prevListStudent, eachStudent];
         })
      })
      
    }
   const submit = async() => {
      if (programName === "") {
         return alertifyRef.current.error('Isi nama program!');
      }
      if (programCat === "") {
         return alertifyRef.current.error('Isi kategori program!');
      }
      if (programStart === "") {
         return alertifyRef.current.error('Isi waktu mulai!');
      }
      if (programEnd === "") {
         return alertifyRef.current.error('Isi waktu berakhir!');
      }
      if (certificateSelected === null) {
         return alertifyRef.current.error('Pilih sertifikat!');
      }
      if (listStudent.length === 0) {
         return alertifyRef.current.error('Isi list student!');
      }
      const date = new Date();
      const dateNow = parseInt(date.getTime().toString())
      const data:PushCourse = {
         certificateId:   (certificateSelected.id).toString(),
         lmsCourseId:     dateNow.toString(),
         lmsCourseName:   programName,
         lmsCategoryName: programCat,
         lmsCategoryId:   dateNow.toString(),
         publishDate:     null,
         startDate:       programStart,
         endDate:         programEnd,
         expiredDate:     expiredDate,
         description:     programDescription,
         status:          'unpublish',
         students:        listStudent,
         skills:          skillSelected.map((skill: { id: number }) => {return {'id': skill.id}}),
         createdBy:       userData?userData.fullname:"unknown",
      }
      try{
         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}cms/published-program/save`, data, {
            headers: { 'Content-Type': 'application/json' },
         })
         const res = response
         alertifyRef.current.success('Success add program');
         navigate.push("/admin/programs")
      }catch(e){
         alertifyRef.current.error('Failed to add program');
      }
   }
   return(
      <div className="ml-[65px]">
         <div className="w-max-container mx-auto my-6 px-6">
            <Link href="/admin/programs"><SVGBack height={40} width={40} className=""/></Link>
            <div className="flex items-center mt-5">
               <h1 className="text-3xl font-bold text-gray-600 ">Input Program</h1>
            </div>
            <div  className="grid mt-5">
               <div className="grid bg-white border border-gray-300 p-5 pb-6 rounded-xl shadow gap-3">
                  <p className="text-sky-600 font-semibold text-lg">Program Detail</p>
                  <div className="flex items-center">
                     <label htmlFor="courseName" className="min-w-[220px] font-medium text-gray-500">Program Name <span className="text-red-600">*</span></label>
                     <input
                        value={programName}
                        onChange={(e) => setProgramName(e.target.value)}
                        className="w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400" 
                        type="text" name="courseName" id="courseName" placeholder="Name"/>
                  </div>
                  <div className="flex items-center">
                     <label htmlFor="courseCategory" className="min-w-[220px] font-medium text-gray-500">Program Category <span className="text-red-600">*</span></label>
                     <input 
                        className="w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400" 
                        type="text" name="courseCategory" id="courseCategory" placeholder="Category"
                        value={programCat} onChange={(e) => setProgramCat(e.target.value)}/>
                  </div>
                  <div className="flex">
                     <label htmlFor="courseDescription" className="min-w-[220px] font-medium text-gray-500">Program Description <span className="text-red-600">*</span></label>
                     <textarea 
                        name="courseDescription" id="courseDescription" 
                        placeholder="Description" 
                        value={programDescription}
                        onChange={(e) => setProgramDescription(e.target.value)}
                        className="w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"></textarea>
                  </div>
                  <div className="flex items-center ">
                     <label htmlFor="courseExpired" className="min-w-[220px] font-medium text-gray-500">Expired Date</label>
                     <input
                         type="date" 
                         name="courseExpired" 
                         id="courseExpired" 
                         value={expiredDate}
                         onChange={(e) => setExpiredDate(e.target.value)}
                         className="border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"/>
                  </div>
                  <div className="flex items-center">
                     <label htmlFor="courseExpired" className="min-w-[220px] font-medium text-gray-500">Start Date <span className="text-red-600">*</span></label>
                     <input 
                        type="date" 
                        name="courseExpired" 
                        id="courseExpired" 
                        value={programStart}
                        onChange={(e) => setProgramStart(e.target.value)}
                        className="border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"/>
                  </div>
                  <div className="flex items-center">
                     <label htmlFor="courseExpired" className="min-w-[220px] font-medium text-gray-500">End Date <span className="text-red-600">*</span></label>
                     <input 
                        type="date" 
                        name="courseExpired" 
                        id="courseExpired" 
                        value={programEnd}
                        onChange={(e) => setProgramEnd(e.target.value)}
                        className="border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"/>
                  </div>
               </div>
               <div className="grid bg-white border border-gray-300 p-5 pb-6 rounded-xl shadow gap-3 mt-5">
                  <div className="relative">
                     <p className="text-sky-600 font-semibold text-lg">Skill Set</p>
                     <input placeholder="Search skill" type="text" 
                     onChange={(e) => getSkill(e.target.value)} 
                     onFocus={() => setShowDropdownSkill(true)}
                     onBlur={() => setShowDropdownSkill(false)} 
                     className="mt-2 w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400" />
                     {showDropdownSkill && (
                           <div className="absolute w-full z-10 bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
                              {listSkills.map((skill, index) => (
                                 <div
                                    key={index}
                                    className="cursor-pointer px-2 py-1 hover:bg-gray-200"
                                    onMouseDown={() => handleSkillSelect(skill)}>
                                    {skill.label}
                                 </div>
                              ))}
                           </div>
                        )}
                  </div>
                  <div className="flex flex-wrap gap-5">
                     {skillSelected.map((skill, index) => (
                        <div className="border bg-emerald-500 text-white text-sm rounded-full px-3 py-1 font-semibold" key={index}>
                        {skill.label}
                           <button className="ms-6 hover:text-red-500" onClick={() => removeSkill(skill)}>x</button>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="grid bg-white border border-gray-300 p-5 pb-6 rounded-xl shadow gap-3 mt-5">
                  <div className="relative">
                     <p className="text-sky-600 font-semibold text-lg">Certificate</p>
                     <input type="text" className="mt-2 w-full border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"
                     placeholder="Search certificate"
                     onChange={(e) => getCertificate(e.target.value)}
                     onClick={()=>setShowDropdownCertificate(true)}
                     onBlur={()=>setShowDropdownCertificate(false)}/>
                     {showDropdownCertificate && (
                           <div className="absolute w-full z-10 bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
                              {listCertificate.map((certificate, index) => (
                                 <div
                                    key={index}
                                    onMouseDown={() => handleCertificateSelect(certificate)}
                                    className="cursor-pointer px-2 py-1 hover:bg-gray-200">
                                    {certificate.label}
                                 </div>
                              ))}
                           </div>
                        )}
                     <small>{certificateSelected?.label}</small>
                  </div>
                  <div className="flex gap-12 mt-3">
                     {certificateSelected && (()=> {
                        const fileCertificate = JSON.parse(certificateSelected.file)
                        return (
                           <Image  className="ms-auto"
                           src={`data:image/png;base64,${fileCertificate.thumbnail}`}
                           alt="Certificate"
                           width={400}
                           height={282.73}/>
                        )
                     })()}
                     {badge && <Image className="me-auto"
                        src={`data:image/svg+xml;base64,${badge.badgeFile}`}
                        alt="Badge"
                        width={200}
                        height={200}
                        />}
                  </div>                 
               </div>
               <div className="grid bg-white border border-gray-300 p-5 pb-6 rounded-xl shadow gap-3 mt-5">
                  <p className="text-sky-600 font-semibold text-lg">Student</p>
                  <div className="flex justify-end gap-5">
                     <BulkAddStudent onAddStudent={bulkAdd}/>
                     <AddStudent onAddStudent={getStudent} text="Add Student" useFor="button" student={null}/>
                  </div>
                  <table className="mt-5">
                     <thead>
                        <tr className="rounded-lg shadow text-white">
                           <th className="px-3 py-2 font-medium bg-emerald-500 rounded-s-lg">Id</th>
                           <th className="px-3 py-2 font-medium bg-emerald-500">Name</th>
                           <th className="px-3 py-2 font-medium bg-emerald-500">Name on Certificate</th>
                           <th className="px-3 py-2 font-medium bg-emerald-500">Email</th>
                           <th className="px-3 py-2 font-medium bg-emerald-500 rounded-e-lg">Email Delivery</th>
                        </tr>
                     </thead>
                     <tbody>
                        {listStudent.map((student, index) => (
                           <>
                              <tr key={index} className="py-1"><td className="py-1"></td></tr>
                              <AddStudent onAddStudent={getStudent} text="Update Student" useFor="table" student={student}/>
                           </>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
            <div className="flex justify-end mt-5">
               <button 
                  onClick={submit}
                  className=" transition px-3 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 active:bg-sky-700 font-medium">
                  Add Program
               </button>
            </div>
         </div>
      </div>
   )
}