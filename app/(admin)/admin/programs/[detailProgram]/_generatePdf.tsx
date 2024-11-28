import { useState,useRef, useEffect } from "react";
import { Template } from "@/packages/common";
import { Designer } from "@/packages/ui";
import {
  getFontsData,
  getPlugins,
  genearetBundingPDF,
  mergePDFs
} from "@/components/helperCanvas";
import Loading from "@/components/loading";

export default function ModalsGeneratePDF({
  program,
  participants,
  certificate,
  isOpen,
  onClose,
}) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const designerRef = useRef<HTMLDivElement | null>(null);
  const designer = useRef<Designer | null>(null);
  const [prevDesignerRef, setPrevDesignerRef] = useState<Designer | null>(null);
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (designerRef !== prevDesignerRef) {
        if (prevDesignerRef && designer.current) {
          designer.current.destroy();
        }
        buildDesigner();
        setPrevDesignerRef(designerRef);
      }
    } else {
      setTimeout(() => setIsVisible(false), 500); // Match this with your animation duration
    }
  }, [isOpen]);

  const buildDesigner = async () => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { day: 'numeric', month: 'long' };
      return date.toLocaleDateString('en-ID', options);
    };
    
    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-ID', options);
    const file = certificate.design;
    const templateId = program.certificate.certificateTemplateId ? program.certificate.certificateTemplateId : null;
    const start = formatDate(program.startDate);
    const end = formatDate(program.endDate);
    const year = new Date(program.startDate).getFullYear();
    const lmsCourseName = program.lmsCourseName;
    const lmsCategoryName = program.lmsCategoryName;
  
    // Simpan blobs PDF
    let pdfBlobs = [];
  
    // Looping melalui setiap peserta
    for (let i = 0; i < participants.length; i++) {
      if(participants[i].statusGraduation === "failed") continue;
      const noCertif = participants[i].certificateNumber;
      const participant = participants[i].nameOnCertificate;
  
      // Update schema berdasarkan peserta saat ini
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
  
      // Ambil font data dan generate PDF untuk setiap peserta
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
      pdfBlobs.push(pdfBlob);
    }
    if (pdfBlobs.length > 0) {
      console.log(pdfBlobs);
      await mergePDFs(pdfBlobs);
    }
    onClose();
  };
  

  if (!isVisible) return <div/>;

  return (
    <div className="top-0 left-0 fixed bg-white w-screen h-screen opacity-90 z-40">
      <div ref={designerRef} style={{ display: 'none'}} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"><Loading/></div>
    </div>
  );
}
