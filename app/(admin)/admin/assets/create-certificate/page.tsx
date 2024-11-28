"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import Image from "next/image";
import { Template, checkTemplate } from "@/packages/common";
import { Designer } from "@/packages/ui";
import {
  getFontsData,
  getPlugins,
  generateTemplate
} from "@/components/helperCanvas";
import {baseImageCanvaslogo} from "@/public/base64"
import { useAuth } from "@/components/context/authContext";

const headerHeight = 60;

export default function CreateCertificate() {
  const {userData} = useAuth()
  const alertifyRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams()
  const designerRef = useRef<HTMLDivElement | null>(null);
  const designer = useRef<Designer | null>(null);
  const [nametemplate, setTemplateName] = useState<string>('');
  const [mockups, setMockups] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedMockup, setSelectedMockup] = useState();
  const [selectedBadge,setSelectedBadge] = useState();
  const [prevDesignerRef, setPrevDesignerRef] = useState<Designer | null>(null);

  const getMockup = async() => {
    try{
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/certificate-template/all`);
      const data = await response.data;
      setMockups(data)
    }catch(err){
      alertifyRef.current.error('Failed to get mockup');
    }
  }

  const getBadge= async () => {
    try{
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/badge/all`);
      const data = await response.data;
      setBadges(data)
    } catch(err) {
      alertifyRef.current.error('Failed to get badge');
    }
  }

  const getCertificate = async () => {
    try{
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/certificate/show/${searchParams.get('id')}`);
      const data = await response.data;
      const selectBadge = await badges.find((badge) => badge.id === data.badgeId);
      setSelectedBadge(selectBadge);
      const selectMockup = await mockups.find((mockup) => mockup.id === data.certificateTemplateId);
      setSelectedMockup(selectMockup);
      setTemplateName(data.label)
      const template = JSON.parse(data.file)
      buildDesigner(template.design)
    } catch(err) {
      alertifyRef.current.error('Failed to get certificate');
    }
  }
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('alertifyjs').then((alertify) => {
        alertifyRef.current = alertify;
      });
      getMockup()
      getBadge()
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
    const search = searchParams.get('id');
    if (search && badges.length > 0 && mockups.length > 0) {
      getCertificate();
    }}
  }, [badges, mockups]);

  const buildDesigner = (Template) => {
    let template: Template = Template?Template:{"schemas":[{"field1":{"type":"text","content":"Select Mockup","position":{"x":0,"y":51.74},"width":297,"height":92.02,"rotate":0,"alignment":"center","verticalAlignment":"middle","fontSize":94,"lineHeight":1,"characterSpacing":0,"fontColor":"#94a3b8","backgroundColor":"","opacity":1,"strikethrough":false,"underline":false,"required":false,"readOnly":false,"fontName":"Roboto"}}],"basePdf":{"width":297,"height":210,"padding":[0,0,0,0]}};

    getFontsData().then((font) => {
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
    });
  };

  const onChangeTemplatePresets = (e: React.ChangeEvent<HTMLSelectElement>) => {   
    const selectedTemplate = mockups.find((mockup) => mockup.label === e.target.value);
    setSelectedMockup(selectedTemplate);
    // console.log(selectedTemplate.file);
    buildDesigner(JSON.parse(selectedTemplate.file));
  };

  const onChangeBadgePresets = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectBadge = badges.find((badge) => badge.label === e.target.value);
    // console.log(selectBadge);
    setSelectedBadge(selectBadge);
  };

  const onChangeTemplateName = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplateName(e.target.value);
  }

  if (designerRef !== prevDesignerRef) {
    if (prevDesignerRef && designer.current) {
      designer.current.destroy();
    }
    buildDesigner();
    setPrevDesignerRef(designerRef);
  }

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const template = designer.current.getTemplate();
    const checkEmptyField = (field, defaultValue, message) => {
      if (field && (field.content === '' || field.content === defaultValue)) {
        alertifyRef.current.error(message);
        return true;
      }
      return false;
    };
    const fieldsToCheck = [
      { field: template.schemas[0].logo, defaultValue: baseImageCanvaslogo(), message: 'Add client logo' },
      { field: template.schemas[0].Client, defaultValue: 'Company name', message: 'Add client Company name' },
      { field: template.schemas[0].ttd, defaultValue: baseImageCanvaslogo(), message: 'Add client signature' },
      { field: template.schemas[0].pic, defaultValue: 'PIC Name', message: 'Add client PIC Name' },
      { field: template.schemas[0].picPosition, defaultValue: 'PIC Position', message: 'Add client PIC Position' }
    ];
    const isAnyFieldEmpty = fieldsToCheck.some(({ field, defaultValue, message }) =>
      checkEmptyField(field, defaultValue, message)
    );
    if (isAnyFieldEmpty) return;
    if (nametemplate === '') {
      alertifyRef.current.error('Add template name');
      return;
    }
    if (selectedBadge === undefined) {
      alertifyRef.current.error('Select badge');
      return;
    }
    if (selectedMockup === undefined) {
      alertifyRef.current.error('Select mockup');
      return;
    }
    alertifyRef.current.success('Try add template');
    if (designer.current && nametemplate && selectedMockup && selectedBadge) {
      
      try {
        const thumbnail = await generateTemplate(designer.current, nametemplate);
        const data = {
            'badgeId': selectedBadge.id,
            'certificateTemplateId': selectedMockup?.id,
            'label': nametemplate,
            'file': JSON.stringify({
              'thumbnail': thumbnail,
              'design': designer.current.getTemplate()
            }),
            'createdBy': userData?.fullname
          }
        if (searchParams.get('id')){
          const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}cms/certificate/${searchParams.get('id')}`, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
        else {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}cms/certificate`,data,{
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }
        alertifyRef.current.success('Success add template');
        router.push('/admin/assets');
      }catch(err) {
        alertifyRef.current.error('Failed to add template');
      }
    }
    else {
      alertifyRef.current.error('Complete the data!');
    }
  };

  return (
    <div className="flex">
      <div ref={designerRef} style={{ width: "100%", height: `calc(100vh - ${headerHeight}px)` }} />
      <div className="flex flex-col bg-white p-6 text-[14px]">
        <form className="grid h-full" onSubmit={handleSubmit}>
          <div>
            <div>
              {/* <label htmlFor="longTextInput" className="font-semibold text-lg text-sky-600">Template Name</label> */}
              <textarea className="max-w-[300px] border border-gray-200 shadow p-2 mt-2 text-lg rounded-lg bg-slate-100 font-semibold text-sky-600"
                id="longTextInput"
                value={nametemplate}
                onChange={onChangeTemplateName}
                rows={3}        
                cols={50}        
                placeholder="Input Template Name"
              />
            </div>
            
            <div className="grid mt-3">
              <p className="font-semibold text-md text-sky-600">Template Preset</p>
              <select className="border border-gray-200 shadow p-2 mt-2 rounded-lg bg-slate-100 font-medium text-gray-700"
                id="template-select" 
                value={selectedMockup?.label || ""} 
                onChange={onChangeTemplatePresets}
              >
                <option value="" disabled>
                  Select a template
                </option>
                {mockups.map(mockup => (
                  <option value={mockup.label}>
                    {mockup.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid mt-3">
              <p className="font-semibold text-md text-sky-600">Badge</p>
              <select className="border border-gray-200 shadow p-2 mt-2 rounded-lg bg-slate-100 font-medium text-gray-700" 
                name="badge" 
                id="select-badge" 
                value={selectedBadge?.label || ""} 
                onChange={onChangeBadgePresets}
              >
                <option value="" disabled>Select a badge</option>
                {badges.map(badge => (
                  <option value={badge.label}>
                    {badge.label}
                  </option>
                ))}
              </select>
              {selectedBadge && (
                <Image className="mt-7 mx-auto pb-3"
                  src={`data:image/svg+xml;base64,${selectedBadge.badgeFile}`}
                  alt={selectedBadge.label || "BADGE"}
                  width={150}
                  height={150}
                />
              )}
            </div>
          </div>
        
          <div className="flex mt-auto w-[300px]">     
            <button type="submit" className="transition grow bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded">Save</button>
            
          </div>
        </form>
        <Link className="grid" href={'/admin/assets'}><button className="transition-all mt-2 border-2 border-sky-600 hover:bg-sky-700 hover:text-white text-sky-600 font-bold py-2 px-4 rounded">Cancel</button></Link>
      </div>
    </div>
  );
}
