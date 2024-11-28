"use client"
import { useEffect, useState, useRef } from "react"
import axios from "axios";
import Image from "next/image";
import { SVGBack } from "@/public/svg/icon";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/context/authContext"
import {PushCourse} from "@/components/interface/pushCourseInterface"
import {Certificate} from "@/components/interface/listCertificateInterface"
import { Badge } from "@/components/interface/badgeInterface";
import {Skill} from "@/components/interface/skillInterface"

export default function PullProgram() {
   const alertifyRef = useRef(null);
   const { userData } = useAuth()
   const [find, setFind] = useState("hidden");
   const [course, setCourse] = useState<any>(null);
   const [description, setDescription] = useState("");
   const [listSkill, setListSkill] = useState<Skill[]>([]); 
   const [searchSkill, setSearchSkill] = useState("");
   const [showDropdown, setShowDropdown] = useState(false);
   const [showDropdownCertificate, setShowDropdownCertificate] = useState(false);
   const [addSkill, setAddSkill] = useState<Skill[]>([]);
   const [getCertificates, setGetCertificates] = useState(""); // Rename variable
   const [certificates, setCertificates] = useState<Certificate[]>([]); // Inisialisasi sebagai array kosong
   const [useCertificate, setUseCertificate] = useState<Certificate | null>(null);
   const [thumbnail, setThumbnail] = useState(null);
   const [badge, setBadge] = useState<Badge | null>(null);
   const [expiredDate, setExpiredDate] = useState("");
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");
   const navigate = useRouter();

   useEffect(() => {
      ListCertificate("").then(() => setShowDropdownCertificate(false));
      ListSkill("").then(() => setShowDropdown(false));
      if (typeof window !== 'undefined') {
        import('alertifyjs').then((alertify) => {
          alertifyRef.current = alertify;
        });
      }
    }, []);

   useEffect(() => {
      initSkill();
    }, [course]);

   const getCourse = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if(course) setCourse(null)
      try {
         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}cms/course/search`,
            { 'courseName': e.target.value }, {
            headers: { 'Content-Type': 'application/json' },
         });
         const dataResponse = response.data.data;
         setFind("block");
         setCourse(dataResponse);
         
      } catch (errors) {
         setFind("hidden");
         alertifyRef.current.error(errors.response.data.errors[0]);
         console.log(errors);
      }
   };

   const ListSkill = async (search: string | null) => {
      const query = search || "";
      setSearchSkill(query);
      try {
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/skill?search=${query}`);
         const data:Skill[] = response.data.data.items;
         setListSkill(data);
         setShowDropdown(true);
      } catch (e) {
         console.log(e);
         setListSkill([]); 
      }
   };

   const initSkill = async() => {
      try{
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/program-skill/show-by-category/${course.course.categoryid}`);
         const data:Skill[] = await response.data.map(item => item.skill)
         setAddSkill(data)
      }catch(e){
         // alertifyRef.current.error('Add new mapping skill');
         console.log(e)
      }
   }

   const handleSkillSelect = (skill: Skill) => {
      setAddSkill(prevSkills => {
        const skills = prevSkills ?? [];
        if (!skills.some(existingSkill => existingSkill.id === skill.id)) {
          return [...skills, skill];
        }
        return skills;
      });
      setSearchSkill(""); 
      setShowDropdown(false); 
    };

   const ListCertificate = async (search: string | null) => {
      const query = search || "";
      setGetCertificates(query); // Update the state with search query
      try {
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/certificate?search=${query}`);
         const data:Certificate[] = response.data.data.items;
         // Pastikan `data` adalah array, jika tidak, jadikan array
         setCertificates(data);
         setShowDropdownCertificate(true); // Show the dropdown when data is available
      } catch (e) {
         console.log(e);
         setCertificates([]); // Reset to empty array on error
      }
   };

   const Certificate = async(cert:Certificate) => {
      setUseCertificate(cert)
      const certificate = JSON.parse(cert.file)
      setThumbnail(certificate.thumbnail)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/badge/show/${cert.badgeId}`)
      const badge:Badge = await response.data
      setBadge(badge)
   }

   const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
      if (course.students === null) {
         alertifyRef.current.error('Participants have not been entered');
         return
      }
      if(useCertificate === null) {
         alertifyRef.current.error('Please select certificate');
         return
      }
      if (startDate === "") {
         alertifyRef.current.error('Please input start date');
         return
      }
      if (endDate === "") {
         alertifyRef.current.error('Please input end date');
         return
      }
      alertifyRef.current.success('Try add program');
      const data:PushCourse = {
         'certificateId': useCertificate.id?useCertificate.id.toString():"",
         'lmsCourseId': course.course.id?course.course.id.toString():"",
         'lmsCourseName': course.course.displayname?course.course.displayname:"",
         'lmsCategoryName': course.course.categoryname?course.course.categoryname:"",
         'lmsCategoryId': course.course.categoryid?course.course.categoryid.toString():"",
         'publishDate': null,
         'startDate': startDate?startDate:"",
         'endDate': endDate?endDate:"",
         'expiredDate': expiredDate?expiredDate:"",
         'description': description?description:"" ,
         'status': "unpublish",
         'createdBy': userData?.fullname,
         'students': course.students.map((student: any) => {
             const linkedinField = student.customfields?.find((field: any) => field.shortname === 'url');
             return {
                 'lmsUserId': student.id?student.id:0,
                 'programId': "",
                 'certificateNumber': "" ,
                 'lmsFullname': student.fullname?student.fullname:"",
                 "nameOnCertificate": student.fullname?student.fullname:"",
                 "lmsEmail": student.email?student.email:"",
                 "deliveryEmail": student.email?student.email:"",
                 "statusGraduation": "passed",
                 "linkAchievement": "",
                 "linkProfileBadge": "",
                 "linkCertificate": "",
                 "lmsLinkedin": linkedinField?.value,
                 "lmsProfilePicture": student.profileimageurl?student.profileimageurl:"",
                 "lmsDepartment": student.department?student.department:"",
                 "lmsPhone1": student.phone1?student.phone1:"",
                 "lmsPhone2": student.phone2?student.phone2:"",
                 "lmsAddress": student.address?student.address:"",
                 "lmsCompany": student.institution?student.institution:"",
                 "lmsBioDecription": student.description?student.description:"",
                 "createdBy": userData?.fullname?userData?.fullname:"admin"
             };
         }),
         'skills': addSkill.map((skill: { id: number }) => {return {'id': skill.id}}),
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
   const removeSkill = (skill: any) => {
      // logic to remove the skill from the addSkill array
      setAddSkill(addSkill.filter((s) => s !== skill));
    };

   return (
      <div className="ml-[65px]">
         <div className="w-max-container mx-auto mt-6 px-6">
            <Link href="/admin/programs"><SVGBack height={40} width={40} className=""/></Link>
            <div className="flex items-center mt-5">
               <h1 className="text-3xl font-bold text-gray-600 ">Get Program</h1>
            </div>
            <form className="my-5" action={submitForm}>
               <div className="lg:flex gap-5">
                  <div className="lg:w-2/3 mb-5">
                     <div className="grid bg-white border border-gray-300 p-5 pb-6 rounded-xl shadow gap-3">
                        <div className="text-sky-600 font-semibold">Program Name According to LMS <span className="text-red-600">*</span></div>
                        <textarea className="border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400" id="course" 
                        value={course?.course.fullname} onChange={getCourse} rows={1} cols={50} />
                     </div>
                     <div className={`${find} grid bg-white border border-gray-300 p-5 pb-6 rounded-xl shadow gap-3 mt-5`}>
                        <div className="text-sky-600 font-semibold">Description</div>
                        <textarea className="border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400"
                           value={description}
                           onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                           rows={8} cols={50}
                           placeholder="Input description..."/>
                     </div>
                     <div className={`${find} grid bg-white border border-gray-300 p-5 pb-6 rounded-xl shadow gap-3 mt-5`}>
                        <div className="text-sky-600 font-semibold">Skill Sets</div>
                        <input
                           type="text"
                           value={searchSkill}
                           onChange={(e) => ListSkill(e.target.value)}
                           onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
                           onFocus={() => setShowDropdown(true)}
                           placeholder="Search Skill"
                           className="border border-gray-300 rounded px-2 py-1 font-medium text-gray-700 bg-slate-100 focus:outline-gray-400"
                        />
                        {showDropdown && (
                           <div className="absolute w-2/6 z-10 bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto translate-y-[70px]">
                              {listSkill.map((skill, index) => (
                                 <div
                                    key={index}
                                    className="cursor-pointer px-2 py-1 hover:bg-gray-200"
                                    onMouseDown={() => handleSkillSelect(skill)}>
                                    {skill.label}
                                 </div>
                              ))}
                           </div>
                        )}
                        <div className="flex flex-wrap gap-5">
                           {addSkill.map((skill, index) => (
                              <div className="border bg-emerald-500 text-white text-sm rounded-full px-3 py-1 font-semibold" key={index}>
                                 {skill.label}
                                 <button className="ms-6 hover:text-red-500" onClick={() => removeSkill(skill)}>x</button>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className={`${find} flex gap-5`}>
                        <div className="grow grid  mt-5 bg-white border border-gray-300  p-5 pb-6 rounded-xl shadow gap-3">
                           <label className="text-sky-600 font-semibold">Expired Date</label>
                           <input className="border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400" type="date" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)}/>
                        </div>
                        <div className="grow grid  mt-5 bg-white border border-gray-300  p-5 pb-6 rounded-xl shadow gap-3">
                           <label className="text-sky-600 font-semibold">Start Date <span className="text-red-600">*</span></label>
                           <input className="border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                        </div>
                        <div className="grow grid  mt-5 bg-white border border-gray-300  p-5 pb-6 rounded-xl shadow gap-3">
                           <label className="text-sky-600 font-semibold">End Date <span className="text-red-600">*</span></label>
                           <input className="border border-gray-300 bg-slate-100 rounded-lg p-2 font-medium text-gray-700 focus:outline-gray-400" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                        </div>
                     </div>
                  </div>
                  <div className={`flex flex-col justify-between grow ${find}`} >
                     <div className="grid bg-white border border-gray-300 p-5 pb-6 rounded-xl shadow gap-3">
                        <div className="text-sky-600 font-semibold">Select Certificate <span className="text-red-600">*</span></div>
                        <input
                           type="text"
                           value={getCertificates}
                           onChange={(e) => ListCertificate(e.target.value)}
                           onBlur={() => setTimeout(() => setShowDropdownCertificate(false), 100)}
                           onFocus={() => setShowDropdownCertificate(true)}
                           placeholder="Search Certificate"
                           className="border border-gray-300 rounded px-2 py-1 w-full font-medium text-gray-700 bg-slate-100 focus:outline-gray-400"
                        />
                        {showDropdownCertificate && (
                           <div className="absolute w-1/4 z-10 bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto translate-y-[70px]">
                              {certificates.map((cert, index) => (
                                 <div
                                    onMouseDown={() => Certificate(cert)}
                                    key={index}
                                    className="cursor-pointer px-2 py-1 hover:bg-gray-200">
                                    {cert.label}
                                 </div>
                              ))}
                           </div>
                        )}
                        {thumbnail && <Image className="mx-auto mt-5"
                        src = {`data:image/png;base64,${thumbnail}`}
                        alt="Certificate"
                        width={400}
                        height={282.73}
                        />}
                        {badge && <Image className="mx-auto mt-3"
                        src={`data:image/svg+xml;base64,${badge.badgeFile}`}
                        alt="Badge"
                        width={200}
                        height={200}
                        />}
                     </div>
                     <button className={`${find} bg-sky-600 px-7 rounded-lg text-lg text-white font-medium py-2 mt-5 mb-5 hover:bg-sky-700 focus:bg-sky-900`} type="submit">Save</button>
                  </div>
               </div>               
            </form>
         </div>
      </div>
   );
}
