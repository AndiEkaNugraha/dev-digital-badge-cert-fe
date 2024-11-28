import { useState, useEffect } from "react";
import axios from "axios";
import alertify from "alertifyjs";
import Image from "next/image";
import dynamic from "next/dynamic"; // Digunakan untuk import Quill secara dinamis
import { useAuth } from "@/components/context/authContext";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false }); // Import Quill secara dinamis
import 'react-quill/dist/quill.snow.css'; // Import CSS Quill

interface ModalsProgramProps {
  program: Program | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProgram: () => void;
}

export default function ModalsProgram({
  program,
  isOpen,
  onClose,
  onUpdateProgram,
}: ModalsProgramProps) {
  const {userData} = useAuth()
  const [titleEmail, setTitleEmail] = useState<string>("");
  const [bodyEmail, setBodyEmail] = useState<string>("");
  const [lmsCourseName, setLmsCourseName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [skills, setSkill] = useState([])
  const [searchSkill, setSearchSkill] = useState([]);
  const [expiredDate, setExpiredDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dropDownSkills, setDropDownSkills] = useState<boolean>(false)
  const [certificate, setCertificate] = useState<any[]>([]);
  const [thumbnailCertificate, setThumbnailCertificate] = useState<any>(null);
  const [dropDownCertificate, setDropDownCertificate] = useState<boolean>(false)
  const [searchCertificate, setSearchCertificate] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 500); // Match this with your animation duration
    }
  }, [isOpen]);

  useEffect(() => {
    if (program) {
      setLmsCourseName(program.lmsCourseName);
      setDescription(program.description);
      setSkill(program.programSkills.map(item => item.skill))
      setExpiredDate(program.expiredDate);
      setStartDate(program.startDate);
      setEndDate(program.endDate);
      setCertificate(program.certificate);
      setThumbnailCertificate(JSON.parse(program.certificate.file));
    }
  }, [program]);

  
  const removeSkill = (skill: JSON) => {
    setSkill((prevSkills) => prevSkills.filter((s) => s !== skill));
  };

  const getSkills = async (search: string | null) => {
    const query = search || "";
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/skill?search=${query}`);
      const data = response.data.data.items;
      setSearchSkill(data);
    } catch (e) {
      // console.log(e);
      setSearchSkill([]);
    }
  };

  const getCertificate = async (search: string | null) => {
    const query = search || "";
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/certificate?search=${query}`);
      const data = response.data.data.items;
      setSearchCertificate(data);
    } catch (e) {
      console.log(e);
      setCertificate([]);
    }
  };

  const handleSkillSelect = (skill: string) => {
    // console.log(skill)
    setSkill((prevSkills) => {
       if (!prevSkills.some(existingSkill => existingSkill.id === skill.id)) {
          return [...prevSkills, skill];
       }
      //  console.log(prevSkills)
       return prevSkills; 
    }); 
    setDropDownSkills(false); 
  };

  const handleCertificateSelect = async (id: string) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/certificate/show/${id}`);
    const data = await response.data;
    setCertificate(data);
    setThumbnailCertificate(JSON.parse(data.file));
    setDropDownCertificate(false); 
  };

  const handleRepublish = async () => {
    if (titleEmail === "" || bodyEmail === "") {
      alertify.error("Please fill Title and Body Email");
      return;
    }
    alertify.warning("trying to republish program");
    try{
      const response = await handleSave()
      const participants = program.publishedParticipants
      if (response !== "success") {
        return alertify.error("Failed to Send Email");
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}cms/published-program/republish`, 
        {
          "programId": program.id,
          "title": titleEmail,
          "body": bodyEmail,
          "updatedBy": userData?.fullname
        })
      const passedParticipants = participants
        .filter(participant => participant.statusGraduation === "passed")
        .map(participant => participant.id);
        for (let i = 0; i < passedParticipants.length; i += 10) {
          const batch = passedParticipants.slice(i, i + 10); // Membuat batch 10 peserta
          
          if (batch.length > 0) {
            const sendEmail = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}cms/published-program/resend-certificate`, {
              "programId": program.id,
              participantIds: batch
            });
            
            alertify.warning(`Emails sent successfully for batch ${i / 10 + 1}`);
          }
        }
      alertify.success("Send Email successfully");
    }catch(e){
      alertify.error("Failed to Send Email");
    }
  }
  const handleSave = async () => {
    try {
      const updatedProgram = {
        "certificateId": certificate.id.toString(),
        "publishDate": program.publishDate,
        "startDate": startDate,
        "endDate": endDate,
        "expiredDate": expiredDate,
        "description": description,
        "status": program.status,
        "createdBy":program.createdBy,
        "updatedBy": userData?.fullname,
        "skills": skills.map((s) => ({
          "id": s.id
        })),
      };
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}cms/published-program/${program?.id}`,
        updatedProgram
      );
      onUpdateProgram();
      onClose();
      return "success";
    } catch (error) {
      alertify.error("Failed to update program");
    }
  };

  if (!isVisible) return <div/>;

  return (
    <div className={`overflow-y-auto fixed inset-0 bg-black flex justify-center items-center transition-all duration-300 ${isOpen ? "bg-opacity-50" : "bg-opacity-0"} z-10`}>
      <div
        className={`bg-white p-6 rounded-lg shadow-lg w-[90vw] transform transition-all duration-500 ease-in-out  translate-x-[32.5px] ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">{lmsCourseName}</h2>
        <div className="grid lg:flex gap-7">
          <div className="grow"> 
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-sm mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900"
              />
            </div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Skill Set</label>
            <input 
              type="text"  
              placeholder="Search skills..."
              onChange={(e) => getSkills(e.target.value)}
              onBlur={() => setTimeout(() => setDropDownSkills(false), 100)}
              onFocus={() => setDropDownSkills(true)}
              className="text-sm mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900" />
              {dropDownSkills && 
                <div className="absolute bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
                {searchSkill.map((s) => (
                  <div key={s} 
                  onMouseDown={() => handleSkillSelect(s)}
                  className="px-4 my-2 cursor-pointer py-1 hover:bg-gray-200">{s.label}</div>
                ))}
                </div>
              }
            
            <div className="flex flex-wrap">
                {skills.map((skill, index:number ) => (
                  <p className="bg-emerald-600 text-white py-1 px-4 rounded-full text-sm mt-2 mx-3" key={'skill'+index}>{skill.label}
                  <button className="ms-6 hover:text-red-500" onClick={() => removeSkill(skill)}>x</button>
                  </p>)
                  )}
            </div>
            </div>
            
            {program.status !== "unpublish" && <div className="mt-4">
              <div className="grid gap-1 items-center">
                <label className="block text-sm font-medium text-gray-700">Title Email</label>
                <input value={titleEmail} onChange={(e) => setTitleEmail(e.target.value)} placeholder="Input title email" className="grow mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 text-sm" type="text"/>
              </div>
              
              <label className="block text-sm font-medium text-gray-700 mt-3">
                Body Email
              </label>
              <ReactQuill  placeholder="Input body email"
                className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-1 text-gray-900 text-sm"
                value={bodyEmail}
                onChange={setBodyEmail}
              />
            </div>}
          </div>
          <div className="lg:w-[400px] w-full">
            <label className="block text-sm font-medium text-gray-700">
              Certificate
            </label>
            <input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 text-sm" type="text"
            placeholder="Search certificate..."
            onChange={(e) => getCertificate(e.target.value)}
            onBlur={() => setTimeout(() => setDropDownCertificate(false), 100)}
            onFocus={() => setDropDownCertificate(true)}/>
            <small className="text-gray-500">{certificate.label}</small>
            {dropDownCertificate && 
            <div className="absolute bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
              {searchCertificate.map((c) => (
                <div key={c}
                onMouseDown={() => handleCertificateSelect(c.id)}
                className="px-4 my-2 cursor-pointer py-1 hover:bg-gray-200">{c.label}</div>
              ))}
            </div>}
            <div className="flex py-4 items-center gap-4 ">
              <div className="ms-auto"><Image src={`data:image/png;base64,${thumbnailCertificate.thumbnail}`} alt={program.certificate.label} width={200} height={150}/></div>
              <div className="me-auto"><Image className="mx-auto" src={`data:image/svg+xml;base64,${certificate.badge.badgeFile}`} alt={program.certificate.badge.label} width={100} height={100}/></div>
            </div>
            <div className="grid gap-3">
                <div className="">
                  <label className="text-sm font-medium text-gray-700">Expired Date</label>
                  <div><input className="text-sm mt-1 border border-gray-300 rounded-md shadow-sm p-2" onChange={(e) => setExpiredDate(e.target.value)} value={expiredDate} type="date" name="expiredDate" id="expiredDate" /></div>
                </div>
                <div className="">
                  <label className="text-sm font-medium text-gray-700">Duration</label>
                  <div className="flex items-center">
                      <input className="text-sm mt-1 border border-gray-300 rounded-md shadow-sm p-2" onChange={(e) => setStartDate(e.target.value)} value={startDate} type="date" name="startDate" id="startDate" />
                      <span className="mx-2 mt-1">to</span>
                      <input className="text-sm mt-1 border border-gray-300 rounded-md shadow-sm p-2" onChange={(e) => setEndDate(e.target.value)} value={endDate} type="date" name="endDate" id="endDate" />
                  </div>
                </div>
            </div>
          </div>
        </div>
        
        
        
        <div className="flex justify-end gap-4 mt-7">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 rounded-lg text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={program.status === "unpublish"? handleSave : handleRepublish}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg"
          >
            {program.status === "unpublish"? 'Save' : 'Republish'}
          </button>
        </div>
      </div>
    </div>
  );
}
