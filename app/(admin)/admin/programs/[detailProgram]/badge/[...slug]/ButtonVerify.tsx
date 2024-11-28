"use client"
import { useState, useEffect  } from 'react';
import Image from 'next/image';
import {SVGVerify, SVGClose} from '@/public/svg/icon';
export default function ButtonVerify({value}) {
   const [showPopup, setShowPopup] = useState(false);
   const [popupVisible, setPopupVisible] = useState(false);

   const [issuedOnText, setIssuedOnText] = useState<React.ReactNode>('Checking...');
   const [issuedByText, setIssuedByText] = useState<React.ReactNode>('Checking...');
   const [issuedToText, setIssuedToText] = useState<React.ReactNode>('Checking...');
   const [acceptedOnText, setAcceptedOnText] = useState<React.ReactNode>('Checking...');
   const [lastUpdateText, setLastUpdateText] = useState<React.ReactNode>('Checking...');
   const [verify, setVerify] = useState<React.ReactNode>('Checking...');

   const publishDate = value.publishDate? new Date(value.publishDate).toLocaleDateString('en-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) : "";
   const participantName = value.publishedParticipants[0].nameOnCertificate;
   const badgeUpdate = new Date(value.updatedAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
   const participantUpdate = new Date(value.publishedParticipants[0].updatedAt).toLocaleDateString('id-ID', {
         day: 'numeric',
         month: 'long',
         year: 'numeric',
      })
   const openPopup = () => {
      setPopupVisible(true);
      setTimeout(() => {
        setShowPopup(true);
        setTimeout(() => setIssuedOnText(<><SVGVerify height={18} width={18} className='text-emerald-500' /> Issued on {publishDate}</>), 300);
      setTimeout(() => setIssuedByText(<><SVGVerify height={18} width={18} className='text-emerald-500' /> Issued by Prasetiya Mulya ELI</>), 600);
      setTimeout(() => setIssuedToText(<><SVGVerify height={18} width={18} className='text-emerald-500' /> Issued to {participantName}</>), 900);
      // setTimeout(() => setAcceptedOnText(<><SVGVerify height={18} width={18} className='text-emerald-500' /> Accepted on {publishDate}</>), 1200);
      setTimeout(() => setLastUpdateText(<><SVGVerify height={18} width={18} className='text-emerald-500' /> Last Update {badgeUpdate > participantUpdate ? badgeUpdate : participantUpdate}</>), 1200);
      setTimeout(() => setVerify(<><SVGVerify height={18} width={18} className='text-emerald-500' /> VERIFIED </>), 1500);
      }, 50); // Delay to match the popup in animation
    };
   const closePopup = () => {
      setShowPopup(false);
      setTimeout(() => {
        setPopupVisible(false);
      }, 500);
    };
   return (
      <div>
         <button onClick={() => openPopup()} className='bg-emerald-500 text-white px-7 py-2 rounded-md transition hover:bg-emerald-600 active:bg-emerald-700 flex gap-3 items-center'><SVGVerify height={20} width={20} className=''/> Verify</button>

         {popupVisible && (
         <div className={`fixed inset-0 flex justify-center bg-black bg-opacity-50 z-50  ${showPopup ? 'opacity-100' : 'opacity-0'} transition duration-300`}>
            <div className={`absolute translate-y-[20vh] bg-white p-6 rounded-lg shadow-lg min-w-[345px] mx-4 ${showPopup ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'} transition duration-300`}>
               <button onClick={closePopup} className="absolute top-3 right-4 text-gray-600 hover:text-gray-900">
               <SVGClose height={15} width={15} className='hover:rotate-90 transition' />
               </button>
               <h2 className="text-xl font-semibold mb-4 text-center">Verification</h2>
               <div className='flex gap-9 md:mt-9 mt-5'>
               <div className='hidden md:block'>
                  <Image src={"/img/verified.png"} height={100} width={350} alt='verivied'/>
               </div>
               <div className='flex flex-col gap-4 font-normal my-auto md:w-[400px]'>
                  <p className={`flex items-center gap-3 transition-opacity duration-300`}>{issuedOnText}</p>
                  <p className={`flex items-center gap-3 transition-opacity duration-300`}>{issuedByText}</p>
                  <p className={`flex items-center gap-3 transition-opacity duration-300`}>{issuedToText}</p>
                  {/* <p className={`flex items-center gap-3 transition-opacity duration-300`}>{acceptedOnText}</p> */}
                  <p className={`flex items-center gap-3 transition-opacity duration-300`}>{lastUpdateText}</p>
                  <p className={`flex items-center gap-3 font-semibold transition-opacity duration-300`}>{verify}</p>
               </div>
               </div>
               
            </div>
         </div>
         )}
      </div>
   )
}