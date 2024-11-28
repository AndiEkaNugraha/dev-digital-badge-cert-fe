"use client";

import { SVGBack, SVGPeople, SVGGraduate, SVGWarning } from "@/public/svg/icon";
import alertify from "alertifyjs";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useState, useEffect } from "react";
import ModalsProgram from "./_editProgram";
import ModalsGeneratePDF from "./_generatePdf";
import { useRouter } from 'next/navigation'
import Loading from "../loading";
import {genearetBundingPDF} from '@/components/helperCanvas'
import {useAuth} from '@/components/context/authContext'

export default function UnpublishProgram({ params: {detailProgram} }: { params: { detailProgram: string } }) {
  const router = useRouter()
  const {userData} = useAuth()
  const [host, setHost] = useState("");
  const [program, setProgram] = useState(null);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [participants, setParticipants] = useState([]);
  const [collectedSend, setCollectedSend] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isPublish, setIsPublish] = useState<boolean>(false);

  const getProgram = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}cms/published-program/show/${detailProgram}`
      );
      const data = response.data;
      setProgram(data);
      setThumbnail(JSON.parse(data.certificate.file).thumbnail);
      setParticipants(data.publishedParticipants);
      if(data.status !== "unpublish") setIsPublish(true);
    } catch (e) {
      console.error("Failed to fetch program data:", e);
      alertify.error("Failed to fetch program data");
    }
  };

  useEffect(() => {
    getProgram();
    setHost(window.location.origin);
  }, []);

  const updateParticipant = async (
    index: number,
    updatedData: JSON
  ) => {
    const participant = participants[index];
    const newParticipant = { ...participant, ...updatedData };
    if (JSON.stringify(participant) === JSON.stringify(newParticipant)) {
      return;
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}cms/published-participant/${participant.id}`,
        {
          ...updatedData,
          updatedBy: userData?.fullname,
        }
      );
      const newParticipants = [...participants];
      newParticipants[index] = newParticipant;
      setParticipants(newParticipants);
      await getProgram();
      alertify.success("Participant updated successfully");
    } catch (error) {
      console.error("Failed to update participant:", error);
      alertify.error("Failed to update participant");
    }
  };

  const collectSend = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectValue = e.target.value;

    if (selectValue === "collected") {
      alertify
        .prompt(
          "Collect Email",
          "Please enter the email address:",
          "",
          async function (evt: Event, value: string) {
            if (!value) {
              alertify.error("Email address is required");
              return;
            }
            try {
              const data = {
                deliveryEmail: value,
                updatedBy: userData?.fullname,
                partcipantIds: participants.map((participant) => participant.id),
              };
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}cms/published-participant/delivery-email`,
                data
              );

              if (response.status === 200) {
                const updatedParticipants = participants.map((participant) => ({
                  ...participant,
                  deliveryEmail: value,
                }));
                setParticipants(updatedParticipants);
                setCollectedSend(true);
                alertify.success("Emails sent successfully");
              } else {
                alertify.error("Failed to send emails");
                e.target.value = "custom";
              }
            } catch (error) {
              console.error("Error sending emails:", error);
              alertify.error("Failed to send emails");
              e.target.value = "custom";
            }
          },
          function () {
            alertify.error("Email collection canceled");
            e.target.value = "custom";
          }
        )
        .set("type", "email");
      return;
    }

    if (selectValue === "sameAsLms") {
      alertify.confirm(
        "Collect Sent",
        "Are you sure you want to send emails to the LMS email addresses?",
        async function () {
          try {
            const updatePromises = participants.map((participant) =>
              axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}cms/published-participant/${participant.id}`,
                {
                  deliveryEmail: participant.lmsEmail,
                  nameOnCertificate: participant.nameOnCertificate,
                  statusGraduation: participant.statusGraduation,
                  updatedBy: userData?.fullname,
                }
              )
            );

            await Promise.all(updatePromises);

            const updatedParticipants = participants.map((participant) => ({
              ...participant,
              deliveryEmail: participant.lmsEmail,
            }));

            setParticipants(updatedParticipants);
            setCollectedSend(true);
            alertify.success("Emails updated successfully");
          } catch (error) {
            console.error("Failed to update emails:", error);
            alertify.error("Failed to update emails");
            e.target.value = "custom";
          }
        },
        function () {
          alertify.error("Email sending canceled");
          e.target.value = "custom";
        }
      );
      return;
    }

    setCollectedSend(false);
  };

  if (!program) {
    return (Loading);
  }

  const publishProgram = async () => {
    if (program.description === "") {
      alertify.error("Description program is required");
      return;
    }
    try {
      alertify.success("Trying to publish program");
      // Memublikasikan program
      const publish = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}cms/published-program/publish`, {
        programId: program.id
      });
  
      alertify.success("Program published successfully");
  
      // Filter peserta yang lulus
      const passedParticipants = participants
        .filter(participant => participant.statusGraduation === "passed")
        .map(participant => participant.id);
  
      // Mengirim email dalam batch berisi 10 peserta
      for (let i = 0; i < passedParticipants.length; i += 10) {
        const batch = passedParticipants.slice(i, i + 10); // Membuat batch 10 peserta
        
        if (batch.length > 0) {
          const sendEmail = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}cms/published-program/send-certificate`, {
            participantIds: batch
          });
          
          alertify.success(`Emails sent successfully for batch ${i / 10 + 1}`);
        }
      }
      alertify.success("Send Email successfully");
      router.push("/admin/programs");
    } catch (error) {
      alertify.error("Failed to publish program");
      console.error("Error publishing program:", error);
    }
  };

  const generateCertificate = async () => {
    genearetBundingPDF(participants, JSON.parse(program.certificate.file))
  }
  

  let translateY:string;
  let padding:string;
  switch(program.certificate.badge.id) {
    case 4:
      translateY = '74px';
      padding = '25px';
      break;
    case 3:
      translateY = '65px';
      padding = '25px';
      break;
    case 2:
      translateY = '67px';
      padding = '40px';
      break;
    case 1:
      translateY = '74px';
      padding = '25px';
      break;
    default:
      translateY = '0px';
      padding = '25px';
  }

  return (
    <div className="ml-[65px]">
      <div className="w-max-container mx-auto my-6 px-6 grid pb-6">
        <Link href="/admin/programs">
          <SVGBack height={40} width={40} className=""/>
        </Link>
        <div className="flex mt-5 gap-3">
          {/* Program Details */}
          <div className="w-2/3 bg-white p-6 rounded-xl border border-gray-100 shadow">
            <div className="flex">
              <p
                className={`px-4 py-1 text-xs text-white rounded-full ${
                  program.status === "unpublish"
                    ? "bg-orange-500"
                    : "bg-emerald-500"
                }`}
              >
                {program.status}
              </p>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mt-3">
              {program.lmsCourseName}
            </h1>

            <div className="flex gap-5 mt-3">
              <p className="text-sky-600 font-medium text-lg">
                {program.lmsCategoryName}
              </p>
              <p className="text-lg font-medium text-slate-900">|</p>
              <p className="text-gray-600 font-medium text-lg">
                {new Date(program.startDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                -{" "}
                {new Date(program.endDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <hr className="mt-4 border-t-2" />
            <div className="flex mt-3 font-medium">
              <p className="text-emerald-500 me-2">Publish on</p>
              <p className="text-gray-600">{program.publishDate}</p>
            </div>
            <div className="flex mt-3 font-medium">
              <p className="text-emerald-500 me-2">Expired on</p>
              <p className="text-gray-600">{program.expiredDate}</p>
            </div>
            <div className="mt-3 flex gap-4 font-medium">
              <div className="flex items-center gap-2">
                <p className="p-[5px] bg-sky-600 rounded-full text-white">
                  <SVGPeople height={20} width={20} className=""/>
                </p>
                <p>{program.publishedParticipants.length} Participant</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="p-[5px] bg-sky-600 rounded-full text-white">
                  <SVGGraduate height={20} width={20} className=""/>
                </p>
                <p>
                  {
                    program.publishedParticipants.filter(
                      (participant) => participant.statusGraduation === "passed"
                    ).length
                  }{" "}
                  Graduate
                </p>
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-sky-600 font-medium text-lg">Description</h2>
              <p className="text-md font-medium text-slate-900">
                {program.description}
              </p>
            </div>
            <div className="mt-4">
              <h2 className="text-sky-600 font-medium text-lg">Skill Set</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {program.programSkills.map((skill, index) => (
                  <p
                    key={index}
                    className="bg-gray-200 px-4 text-sm py-2 rounded-full font-medium text-gray-700"
                  >
                    {skill.skill.label}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Certificate and Badge */}
          <div className="bg-white p-5 rounded-xl shadow border border-gray-100 grow h-fit">
            <div className="grid gap-3">
              <h2 className="text-sky-600 font-medium text-lg">Certificate</h2>
              <div className="mx-auto">
                <Image
                  width={400}
                  height={283}
                  src={`data:image/png;base64,${thumbnail}`}
                  alt={program.certificate.label}
                />
              </div>
            </div>
            <div className="grid gap-3 mt-4">
              <h2 className="text-sky-600 font-medium text-lg">Badge</h2>
              <div className="mx-auto">
              <div className='w-[180px] h-[50px] text-gray-600 absolute text-center overflow-hidden grid'
                  style={{ transform: `translateY(${translateY})`, paddingInline: `${padding}` }}>
                    <p className='text-[11px] font-semibold mt-auto items-end leading-normal uppercase'>{program.lmsCategoryName}</p>
                </div>
                <Image
                  width={180}
                  height={180}
                  alt={program.certificate.badge.label}
                  src={`data:image/svg+xml;base64,${program.certificate.badge.badgeFile}`}
                />
                
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center my-7">
          <button className="bg-sky-600 text-white w-[100px] py-2 rounded font-medium hover:bg-sky-700 active:bg-sky-900 transition" onClick={(e) => setIsGenerateModalOpen(true)}>Certificate</button>
          <Link href={`${detailProgram}/badge/${program.slug}/${program.publishedParticipants[0].slug1}`}><button className="bg-orange-600 text-white w-[100px] py-2 rounded font-medium hover:bg-orange-700 active:bg-orange-900 transition">Preview</button></Link>
          <button className="bg-sky-600 text-white w-[100px] py-2 rounded font-medium hover:bg-sky-700 active:bg-sky-900 transition" onClick={(e)=> setIsEditModalOpen(true)}>Edit</button>
          {!isPublish && <button className="bg-green-500 text-white w-[100px] py-2 rounded font-medium hover:bg-green-700 active:bg-green-900 transition"  onClick={publishProgram}>Publish</button>}
        </div>

        {/* Edit Modal */}
        <ModalsProgram
          program={program}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateProgram={getProgram}
        />

        {/* Generate Certificate */}
        <ModalsGeneratePDF
          program={program}
          participants = {participants}
          certificate = {JSON.parse(program.certificate.file)}
          isOpen = {isGenerateModalOpen}
          onClose = {() => setIsGenerateModalOpen(false)}
        />

        {/* Participants Table */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow">
          <div className="flex gap-4 items-center mb-4">
            <h2 className="text-xl font-semibold">Collect Send</h2>
            <select
              name="collectSend"
              id="collectSend"
              onChange={collectSend}
              className="border border-gray-300 rounded-md p-2"
              disabled = {isPublish}
            >
              <option value="custom">Custom</option>
              <option value="sameAsLms">Same as Email on LMS</option>
              <option value="collected">Collect to Specific Email</option>
            </select>
          </div>
          <table className="w-full text-center rounded-lg table-auto">
            <thead>
              <tr>
                <th className="px-1 text-emerald-900 bg-green-300 rounded-tl-xl py-3 font-semibold border-r-4 border-white">
                  ID
                </th>
                <th className="px-4 text-emerald-900 bg-green-300 py-3 font-semibold border-x-4 border-white">
                  Name on Certificate
                </th>
                <th className="px-4 text-emerald-900 bg-green-300 py-3 font-semibold border-x-4 border-white">
                  Send Email To
                </th>
                <th className="text-emerald-900 bg-green-300 py-3 font-semibold border-x-4 border-white">
                  Status
                </th>
                <th className="text-emerald-900 bg-green-300 rounded-tr-xl py-3 font-semibold border-l-4 border-white">
                  Information
                </th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr
                key={participant.id + participant.deliveryEmail}
                  className="odd:bg-white even:bg-gray-200"
                >
                  <td className="py-2 border-4 font-medium text-sm border-white">
                    {participant.id}
                  </td>
                  <td className="px-2 py-2 border-4 border-white text-left">
                    <input
                      disabled = {isPublish}
                      className={`w-full font-medium text-sm focus:border-none outline-none bg-transparent ${isPublish? "text-gray-500" : ""}`}
                      type="text"
                      defaultValue={participant.nameOnCertificate}
                      onBlur={(e) =>
                        updateParticipant(index, {
                          nameOnCertificate: e.target.value,
                          deliveryEmail: participant.deliveryEmail,
                          statusGraduation: participant.statusGraduation
                        })
                      }
                    />
                  </td>
                  <td className="px-2 py-2 border-4 font-medium text-sm text-left border-white">
                    <input
                      className={`w-full font-medium text-sm focus:border-none outline-none bg-transparent ${
                        collectedSend || isPublish ? "text-gray-500" : ""
                      }`}
                      type="text"
                      defaultValue={participant.deliveryEmail}
                      onBlur={(e) =>
                        updateParticipant(index, {
                          deliveryEmail: e.target.value,
                          nameOnCertificate: participant.nameOnCertificate,
                          statusGraduation: participant.statusGraduation
                        })
                      }
                      disabled={collectedSend || isPublish}
                    />
                  </td>
                  <td className="py-2 border-4 font-medium text-sm border-white">
                    <button
                      disabled = {isPublish}
                      onClick={() =>
                        updateParticipant(index, {
                          statusGraduation:
                            participant.statusGraduation === "passed"
                              ? "failed"
                              : "passed",
                            deliveryEmail: participant.deliveryEmail,
                            nameOnCertificate: participant.nameOnCertificate,
                        })
                      }
                      className={`mx-auto w-fit px-4 py-1 text-xs text-white rounded-full transition-all ${
                        participant.statusGraduation !== "passed" && !isPublish
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-emerald-500 hover:bg-emerald-600"
                      } ${isPublish? "bg-gray-500 hover:bg-gray-500" : ""}`}
                    >
                      {participant.statusGraduation}
                    </button>
                  </td>
                  <td className="py-2 border-4 font-medium text-sm border-white relative">
                    <button className="detail text-sky-600 w-fit mx-auto">
                      <SVGWarning height={25} width={25} />
                      <div className="detail-content cursor-text p-3 bg-white rounded-md text-left absolute text-gray-900 translate-x-[-105%] translate-y-[-40%] text-sm border border-gray-100 shadow w-max z-0">
                        <h2 className="font-semibold mb-1">Name on LMS</h2>
                        <p className="font-normal">
                          Name: {participant.lmsFullname}
                        </p>
                        <p className="font-normal">
                          Email: {participant.lmsEmail}
                        </p>
                      </div>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
