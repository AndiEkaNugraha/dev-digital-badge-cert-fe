"use client"

import { useState, useRef, useEffect } from "react"
import { Template } from "@/packages/common";
import { Designer } from "@/packages/ui";
import dynamic from "next/dynamic";
import {
   getFontsData,
   getPlugins,
   genearetBundingPDF,
   mergePDFs,
 } from "@/components/helperCanvas";
 import Loading from "@/components/loading";
import axios from 'axios'
export default function ButtonGenerate(participants) {
   const alertifyRef = useRef(null);
   const designerRef = useRef<HTMLDivElement | null>(null);
   const designer = useRef<Designer | null>(null);
   const [certificate, setCertificate] = useState(null)
   const [loading, setLoading] = useState(false)
   const [showLoading, setShowLoading] = useState(false)
   const [show, setShow] = useState(false)
   useEffect(() => {
      if (typeof window !== 'undefined') {
         import('alertifyjs').then((alertify) => {
            alertifyRef.current = alertify;
          });
      }
   })
   useEffect(() => {
      if (loading === true) {
         setShow(true)
         setTimeout(() => {
            setShowLoading(true)
         },10)
      }else if (loading === false){
         setShowLoading(false)
         setTimeout(() => {
            setShow(false)
         },400)
      }
   },[loading])

   async function Generate(data) {
      if (data.participants.length === 0) return alertifyRef.current.error("Please select at least one participant");
      setLoading(true)
      const listData = data.participants
      const pdfPromises = listData.map(async (participant) => {
         if (!certificate || participant.publishProgram.certificateId !== certificate.id) {
            try {
               const getCertif = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/certificate/show/${participant.publishProgram.certificateId}`);
               const result = getCertif.data;
               console.log(result);
               setCertificate(result);
               return await buildDesigner(participant, result);
            } catch (e) {
               console.log(e);
            }
         } else {
            return await buildDesigner(participant, certificate);
         }
      });
      function isPopupAllowed() {
      const newWindow = window.open("", "_blank", "width=2,height=2");
         if (newWindow) {
            newWindow.close();
            return true; 
         } else {
            return false
         }
      }
      if (isPopupAllowed()) {
         const allBlobs = await Promise.all(pdfPromises);
         await mergePDFs(allBlobs);
         setCertificate(null);
         setLoading(false)
      } else {
      alert("Pop-up telah diblokir oleh browser. Harap izinkan pop-up untuk melanjutkan.");
      }
   }
   // var pdfBlobs = [];
   async function buildDesigner(dataParticipant,detailCertificate) {
      const formatDate = (dateString) => {
         const date = new Date(dateString);
         const options = { day: 'numeric', month: 'long' };
         return date.toLocaleDateString('en-ID', options);
      };
      
      const today = new Date();
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const formattedDate = today.toLocaleDateString('en-ID', options);
      const jsonFile = JSON.parse(detailCertificate.file);
      const file = jsonFile.design;
      const templateId = detailCertificate.certificateTemplateId ? detailCertificate.certificateTemplateId : null;
      const start = formatDate(dataParticipant.publishProgram.startDate);
      const end = formatDate(dataParticipant.publishProgram.endDate);
      const year = new Date(dataParticipant.publishProgram.startDate).getFullYear();
      const lmsCourseName = dataParticipant.publishProgram.lmsCourseName;
      const lmsCategoryName = dataParticipant.publishProgram.lmsCategoryName;
      const noCertif = dataParticipant.certificateNumber;
      const participant = dataParticipant.nameOnCertificate;
      
      if (file.schemas[0].noCertificate) {
         file.schemas[0].noCertificate.content = noCertif;
      }
      if (file.schemas[0].participant) {
      file.schemas[0].participant.content = participant;
      }
      if (file.schemas[0].program) {
      if (templateId === 7) {
         file.schemas[0].program.content = `"${lmsCourseName}"`;
      } else {
         file.schemas[0].program.content = lmsCourseName;
      }
      }
      if (file.schemas[0].date) {
      if (templateId === 7) {
         file.schemas[0].date.content = `${year}`;
      } else {
         file.schemas[0].date.content = (start === end) ? `${start}, ${year}` : `${start} - ${end}, ${year}`;
      }
      }
      if (file.schemas[0].dateNow) {
      if (templateId === 7) {
         file.schemas[0].dateNow.content = `Jakarta, ${formattedDate}`;
      } else {
         file.schemas[0].dateNow.content = formattedDate;
      }
      }
      if (file.schemas[0].categoryProgram) {
      file.schemas[0].categoryProgram.content = lmsCategoryName;
      }
      if (file.schemas[0].qrcode) {
      file.schemas[0].qrcode.content = window.location.host;
      }
      let template: Template = file;
      const font = await getFontsData();
      if (designerRef.current) {
      designer.current = new Designer({
         domContainer: designerRef.current,
         template: template as any,
         options: {
            font,
            labels: {
            clear: "🗑️", // Add custom labels to consume them in your own plugins
            },
            theme: {
            token: {
               colorPrimary: "#25c2a0",
            },
            },
            icons: {
            multiVariableText:
               '<svg fill="#000000" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.643,13.072,17.414,2.3a1.027,1.027,0,0,1,1.452,0L20.7,4.134a1.027,1.027,0,0,1,0,1.452L9.928,16.357,5,18ZM21,20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"/></svg>',
            },
         },
         plugins: getPlugins(),
      });
      }
      const pdfBlob = await genearetBundingPDF(designer.current);
      // pdfBlobs.push(pdfBlob);
      return pdfBlob
   }
   return (
      <>
      {show && <div className={`absolute top-0 left-0 w-full h-full bg-white ${showLoading?'opacity-80':'opacity-0'} transition-all duration-300'} z-20`}><Loading /></div>}
      <div ref={designerRef} style={{ display: 'none'}} />
      <button 
      onClick={() =>Generate(participants)}
      className=" px-4 py-[7px] border border-black
      rounded-lg font-medium hover:bg-emerald-600 hover:border-emerald-600 hover:text-white
      transition-all active:bg-emerald-700 active:border-emerald-700 active:text-white">Generate</button>
      </>
   )
}