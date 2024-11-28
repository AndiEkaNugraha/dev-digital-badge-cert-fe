"use client"
import { SVGShare, SVGLinkedin, SVGCopy, SVGSuccess } from '@/public/svg/icon';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ButtonShare(data) {
   const [show, setShow] = useState(false);  
   const [isVisible, setIsVisible] = useState(false); // Mengontrol mounting modal
   const [selectedItem, setSelectedItem] = useState(null);
   const [copySuccess, setCopySuccess] = useState(<SVGCopy height={25} width={25} className=''/>);
   const [host, setHost] = useState('');
   const handleClick = (item) => {
      setHost(window.location.origin  )
      setSelectedItem(item.data);
      setIsVisible(true);
      setShow(true);
    };
  
    const closeModal = () => {
      setShow(false);
      setTimeout(() => {
        setIsVisible(false);
      }, 300); // Durasi animasi
    };
  
    const handleCopy = () => {
      const url = `/badge/${selectedItem.slug}/${data.data.publishedParticipants[0].slug1}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopySuccess(<SVGSuccess height={25} width={25} className='p-[2px]'/>);
        setTimeout(() => {
          setCopySuccess(<SVGCopy height={25} width={25} className=''/>);
        }, 2000); // Reset status setelah 2 detik
      });
    };
   return (
      <>
         {isVisible && selectedItem && (
         <div
            className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-300 ${
               show ? 'bg-black bg-opacity-50 opacity-100' : 'opacity-0'
            }`}
         >
            <div
               className={`bg-white p-5 rounded-lg shadow-lg max-w-lg w-full relative transform transition-all duration-300 ${
               show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
               }`}
            >
               <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
               X
               </button>
               <h2 className="text-lg font-medium text-gray-800 mb-11">Share Achievement</h2>
               <div className="flex flex-col gap-6 justify-center w-full">
               <Link prefetch={false} href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&
name=${selectedItem.lmsCourseName}&
organizationId=6643620&
issueYear=${selectedItem.publishDate?new Date (selectedItem.publishDate).getFullYear():new Date (selectedItem.endDate).getFullYear()}
&issueMonth=${selectedItem.publishDate?new Date (selectedItem.publishDate).getMonth():new Date (selectedItem.endDate).getMonth()}&
expirationYear=${new Date (selectedItem.expiredDate).getFullYear()}&expirationMonth=${new Date (selectedItem.expiredDate).getMonth()}&
certUrl=${host}/badge/${selectedItem.slug}/${selectedItem.publishedParticipants[0].slug1}&
certId=${selectedItem.publishedParticipants[0].certificateNumber}`} className='w-full text-center'>
                  <button>
                     <SVGLinkedin height={40} width={40} className='hover:scale-110 transition'/>
                  </button>
               </Link>
               
               <div className="flex items-center gap-2 w-full mb-3">
                  <input
                     type="text"
                     disabled
                     value={`/badge/${selectedItem.slug}/${data.data.publishedParticipants[0].slug1}`}
                     className="border border-gray-300 rounded px-2 py-1 w-[-webkit-fill-available] text-sm shadow"
                  />
                  <button onClick={handleCopy} className=" text-gray-700 rounded hover:text-gray-900 transition">
                     {copySuccess && <p className="">{copySuccess}</p>}
                  </button>
               </div>
               </div>
            </div>
         </div>
         )}
         <button onClick={() => handleClick(data)}>
            <SVGShare height={25} width={25} className='text-emerald-400 hover:scale-110 hover:text-emerald-600 transition' />
         </button>
      </>
   )
}