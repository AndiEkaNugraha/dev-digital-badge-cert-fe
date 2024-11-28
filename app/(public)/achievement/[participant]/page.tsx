import { notFound, redirect } from 'next/navigation';
import Sidebar from './_sidebar';
import axios from 'axios';
import Image from 'next/image';
import { SVGShare, SVGLinkedin, SVGCopy, SVGSuccess } from '@/public/svg/icon';
import Link from 'next/link';
import ButtonShare from './buttonShare';
import type { Metadata } from 'next'
 
// either Static metadata
export const metadata: Metadata = {
  title: 'Achievement',
}

async function  fetchData(params:string) {
   try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}user/certificate/${params}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
}

export default async function Achievement({ params: { participant } }: { params: { participant: string } }) {
   const slugParticipant = participant;
   if (slugParticipant === null) {
      redirect('/user-not-found');
   }
   const data = await fetchData(slugParticipant);
   if (data === null) {
      redirect('/user-not-found');
   }
   const formatDate = (dateString:string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-ID', { day: 'numeric', month: 'long' });
   };

   return (
      <div className='min-h-screen px-3 md:flex gap-9 w-max-container mx-auto'>
         <Sidebar {...data} />
         <div className='md:ms-24 md:mt-[65px] pb-4'>
            <h1 className='text-sky-600 font-semibold md:text-3xl text-xl mt-7 md:mt-0'>Your Achievement,</h1>
            <div className='grid xl:grid-cols-2 gap-5 md:mt-16 mt-3'>
              {data.map((item, index:number) => {
                  if (item.status != "Published" || item.publishedParticipants[0].statusGraduation === "failed") {
                  return null
                  }
                  let date = (item.startDate === item.endDate)? formatDate(item.startDate) + ', ' + new Date(item.endDate).getFullYear():formatDate(item.startDate) + ' - ' + formatDate(item.endDate)+ ', ' + new Date(item.endDate).getFullYear();
                  let translateY:string;
                  let padding:string
                  switch(item.certificate.badgeId) {
                  case 4:
                     translateY = '34px';
                     padding = '10px'
                     break;
                  case 3:
                     translateY = '29px';
                     padding = '10px'
                     break;
                  case 2:
                     translateY = '30px';
                     padding = '12px'
                     break;
                  case 1:
                     translateY = '34px';
                     padding = '10px'
                     break;
                  default:
                     translateY = '0px';
                     padding = '10px'
                  }
                  return(
                  <div key={index} className='bg-white p-5 rounded-xl shadow-lg border border-gray-200 flex gap-5 min-w-[350px] md:max-w-[580px]'>
                     <Image className='self-start'
                        src={`data:image/svg+xml;base64,${item.certificate.badge.badgeFile}`}
                        alt={`Badge ${index + 1}`}
                        height={80}
                        width={80}
                        />
                     <div  className='absolute w-[80px] h-[23px] overflow-hidden grid'
                        style={{ transform: `translateY(${translateY})`, paddingInline:`${padding}` }}>
                        <p className='text-[5px] text-center font-semibold uppercase text-gray-700 leading-normal mt-auto'>{item.lmsCategoryName}</p>               
                     </div>
                     <div>
                        <Link prefetch={false} href={`/badge/${item.slug}/${participant}`}><h2 className='text-sky-600 font-semibold hover:text-sky-800 transition'>{item.lmsCourseName}</h2></Link>
                        <p className='mt-2 text-sm font-medium'>{`${date}`}</p>
                     </div>
                     <div className='mt-auto ms-auto'>
                        <ButtonShare data={item}/>
                     </div>
                  </div>
                  )})}

            </div>
          </div>
      </div>
      
   )
}