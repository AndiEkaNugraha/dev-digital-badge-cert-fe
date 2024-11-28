"use client"

import { useEffect, useRef } from 'react';
import Images from 'next/image';
import { SVGEmail, SVGWhatsapp, SVGLinkedin } from '@/public/svg/icon';
import Link from 'next/link';
import LogoEli from '@/public/img/logo-eli.svg';

export default function Sidebar(data) {
   const pict = data[0].publishedParticipants[0].lmsProfilePicture?data[0].publishedParticipants[0].lmsProfilePicture:'';
   const name = data[0].publishedParticipants[0].lmsFullname?data[0].publishedParticipants[0].lmsFullname:'';
   const companyName = data[0].publishedParticipants[0].lmsCompany?data[0].publishedParticipants[0].lmsCompany:'';
   const Department = data[0].publishedParticipants[0].lmsDepartment?data[0].publishedParticipants[0].lmsDepartment:'';
   const bio = (data[0].publishedParticipants[0].lmsBioDecription)?(data[0].publishedParticipants[0].lmsBioDecription).replace(/style="[^"]*"/g, ''):'';
   const Linkedin = data[0].publishedParticipants[0].lmsLinkedin?data[0].publishedParticipants[0].lmsLinkedin:'';
   let Wa = data[0].publishedParticipants[0].lmsPhone2?data[0].publishedParticipants[0].lmsPhone2:'';
   if (Wa.startsWith('0')) {
      Wa = '62' + Wa.substring(1);
   }
   const mail = data[0].publishedParticipants[0].lmsEmail?data[0].publishedParticipants[0].lmsEmail:'';
   
   // Gunakan useRef untuk mereferensikan elemen
   const nameRef = useRef(null);
   const line1Ref = useRef(null);
   const line2Ref = useRef(null);
   useEffect(() => {
      if (typeof window !== 'undefined') {
         document.title = `Achievement - ${name}`;
      }
   }, [name]);
   useEffect(() => {
      const handleResize = () => {
         // Pastikan elemen sudah ada sebelum mengakses offsetHeight
         if (nameRef.current) {
            const height = nameRef.current.offsetHeight;
            if (height>35) {
               line1Ref.current.style.display = "none"
               line2Ref.current.style.display = "none"
            }
            if(height<=35) {
               line1Ref.current.style.display = "block"
               line2Ref.current.style.display = "block"
            }
            console.log('Name element height:', height);
         }
      };
      handleResize();
      window.addEventListener('resize', handleResize);

      // Cleanup event listener ketika komponen unmount
      return () => window.removeEventListener('resize', handleResize);
   }, []); // Kosong berarti ini hanya akan dijalankan sekali saat komponen di-mount

   return (
      <>
      <div className="min-w-[300px] h-fit grid justify-items-center content-start md:h-auto min-h-[100vh]">
         <div className='mt-9 grid justify-items-center h-fit'>
            <Images src={LogoEli} alt="logo" height={48.55} width={180} />
            <h2 className='text-[14px] text-[#0C86D9]'>we <strong>fit</strong> rather than <strong>fix</strong></h2>
         </div>
         <div className='md:h-full grid content-center py-9'>
            <div className='min-h-[68px] max-w-[280px]'>
               <h2 ref={nameRef} className='text-center font-semibold text-[23px]'>{name}</h2>
               <h2 className='text-center text-[12px]'>{Department}</h2>
               <h2 className='text-center text-[12px]'>{companyName}</h2>
            </div>
            
            <div className='mt-12'>
               <Images className='mx-auto rounded-full shadow'
                  src={pict}
                  height={200}
                  width={200}
                  alt='name'
               />
            </div>
            <div className='text-center mt-3 max-w-[280px] text-[14px]' dangerouslySetInnerHTML={{ __html: bio }}/>
            <div className='flex justify-center mt-4 gap-5'>
               {Linkedin && <Link prefetch={false} target='' href={Linkedin?Linkedin:"./#"}><SVGLinkedin height={30} width={30} className={'hover:scale-110 transition-all'}/></Link>}
               {Wa && <Link prefetch={false} href={Wa?`https://wa.me/${Wa}`:"./#"}><SVGWhatsapp height={30} width={30} className={'hover:scale-110 transition-all'}/></Link>}
               {mail &&<Link prefetch={false} href={mail?`mailto:${mail}`:"./#"}><SVGEmail height={30} width={30} className={'hover:scale-110 transition-all'}/></Link>}
            </div>
         </div>
         <div className='hidden md:block overflow-hidden '>
            <div className={`absolute bottom-0 w-[70px] bg-gradient-to-b from-emerald-400 to-blue-400 
               translate-x-[183px] rounded-t-lg`} style={{ height: 'calc(100% - 263px)' }}/>
            <div className={`absolute h-[100px] top-0 w-[70px] bg-gradient-to-b from-emerald-400 to-blue-400 
               translate-x-[158px] rounded-b-lg`}/>
            <div className='absolute h-[45px]  w-[45px] top-[155px] translate-x-[183px] bg-black rounded-lg'/>
            <div ref={line1Ref} className="absolute rounded-br-[15px] top-[-2px]" style={{background: 'linear-gradient(to top, #46e297 60%, #3da2f4)',height: '232px', width: '4000px',zIndex: -1, transform: 'translateX(calc(-3745.5px))'}}>
               <div className="absolute inset-[1.5px] rounded-br-[13px] bg-white"/>
            </div>
            <div className="absolute rounded-tl-[15px] top-[129px] bg-gradient-to-b from-emerald-400 to-blue-400" style={{height: 'calc(100% - 129.5px)', width: '4000px',zIndex: -1, transform: 'translateX(calc(155.5px))'}}>
               <div className="absolute inset-[1.5px] rounded-tl-[13px] bg-white"/>
               <div ref={line2Ref} className="absolute rounded-tl-[15px] rounded-br-[15px]" style={{background: '#46e297',height: '101px', width: '99px'}}>
                  <div className="absolute inset-[1.5px] rounded-tl-[13px] rounded-br-[13px] bg-white"/>
               </div>
            </div>
         </div>
         
      </div>
      </>
      
   )
}