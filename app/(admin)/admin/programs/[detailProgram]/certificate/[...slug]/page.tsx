"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from 'axios'
import { Template } from "@/packages/common";
import { Designer } from "@/packages/ui";
import {
  getFontsData,
  getPlugins,
  generatePDF
} from "@/components/helperCanvas";
import {useRouter} from "next/navigation";
import Loading from "@/components/loading";

export default function Certificate({ params }: { params: { slug: string[] } }) {
  const router = useRouter()
  const designerRef = useRef<HTMLDivElement | null>(null);
  const designer = useRef<Designer | null>(null);
  const [prevDesignerRef, setPrevDesignerRef] = useState<Designer | null>(null);

  const buildDesigner = async() => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { day: 'numeric', month: 'long' };
      return date.toLocaleDateString('en-ID', options);
    };
    
    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-ID', options);
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}user/certificate/show/${params.slug[0]}/${params.slug[1]}`);
    const data = await res.data;
    // if(data.status !== "Published" || data.publishedParticipants[0].statusGraduation === "failed") {
    //   return router.push('/certificate-not-found')
    // }
    const templateId = data.certificate.certificateTemplateId?data.certificate.certificateTemplateId:null
    const fileData = JSON.parse(data.certificate.file)
    const file = fileData.design
    const start = formatDate(data.startDate);
    const end = formatDate(data.endDate);
    const year = new Date(data.startDate).getFullYear();
    const noCertif = data.publishedParticipants[0].certificateNumber;
    if(file.schemas[0].noCertificate) {
      file.schemas[0].noCertificate.content = noCertif
    }
    if(file.schemas[0].participant) {
      file.schemas[0].participant.content = data.publishedParticipants[0].nameOnCertificate
    }
    if(file.schemas[0].program) {
      if(templateId === 7) {
        file.schemas[0].program.content = `"${data.lmsCourseName}"`;
      }else {
      file.schemas[0].program.content = data.lmsCourseName;
    }
    }
    if(file.schemas[0].date) {
      if(templateId === 7) {
        file.schemas[0].date.content = `${year}`
      }else {
        file.schemas[0].date.content = (start === end) ? `${start}, ${year}` : `${start} - ${end}, ${year}`;
      }
    }
    if(file.schemas[0].dateNow) {
      if(templateId === 7) {
        file.schemas[0].dateNow.content = `Jakarta, ${formattedDate}`
      }else {
        file.schemas[0].dateNow.content= formattedDate
      }
      
    }
    if(file.schemas[0].categoryProgram){
      file.schemas[0].categoryProgram.content = data.lmsCategoryName
    }
    if(file.schemas[0].qrcode){
      file.schemas[0].qrcode.content =  window.location.host + "/badge/" + params.slug[1] + "/" + params.slug[0]
    }    
    let template: Template = file;

    getFontsData().then(async(font) => {
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
      function isPopupAllowed() {
        // Coba buka jendela baru
        const newWindow = window.open("", "_blank", "width=1,height=1");
      
        if (newWindow) {
          // Jika berhasil membuka pop-up, langsung tutup kembali
          newWindow.close();
          return true; // Pop-up diizinkan
        } else {
          // Pop-up diblokir, tampilkan pesan konfirmasi kepada pengguna
          return window.confirm("Pop-up telah diblokir oleh browser. Harap izinkan pop-up untuk melanjutkan!");
        }
      }
      
      if (isPopupAllowed()) {
        // Jika pop-up diizinkan, atau pengguna setuju melanjutkan tanpa pop-up
        const pdf = await generatePDF(designer.current, data.lmsCourseName + ' - ' + data.publishedParticipants[0].nameOnCertificate)
        if (pdf === true) {
          try {
            (window.history.length > 1)?window.history.back():(router.push('/admin/programs'))
            } catch (e) {
              alert("Dokumen selesai dibuat.");
            }
        }
        else {
          alert("Gagal membuat PDF. Silakan coba lagi.");
          console.log(pdf)
        }
      } else {
        // Jika pop-up diblokir dan pengguna memilih untuk tidak melanjutkan
        alert("Pop-up telah diblokir oleh browser. Harap izinkan pop-up untuk melanjutkan.");
      }
      
    });
  };
  

  if (designerRef !== prevDesignerRef) {
    if (prevDesignerRef && designer.current) {
      designer.current.destroy();
    }
    buildDesigner();
    setPrevDesignerRef(designerRef);
  }

  return (
    <div>
      <div ref={designerRef} style={{ display: 'none'}} />
      <div><Loading/></div>
    </div>
  );
}
