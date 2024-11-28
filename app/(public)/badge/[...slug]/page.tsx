import axios from 'axios';
import Image from 'next/image';
import LogoEli from '@/public/img/logo-eli.svg';
import QRCode from 'react-qr-code';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ButtonVerify from './ButtonVerify';
import { headers } from 'next/headers';
import type { Metadata } from 'next'

// Dynamic metadata
export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const slugPart1 = params.slug[0];
  const slugPart2 = params.slug[1];
  const detailBadge = await fetchData(slugPart1, slugPart2);

  if (!detailBadge) {
    return {
      title: 'Badge Not Found',
    };
  }

  const participantName = detailBadge[0].publishedParticipants[0].nameOnCertificate
    ? detailBadge[0].publishedParticipants[0].nameOnCertificate
    : '';
  const program = detailBadge[0].lmsCourseName
    ? detailBadge[0].lmsCourseName
    : '';

  return {
    title: `Badge - ${participantName}`,
    description: program,
  };
}
// Function to fetch data from the API
async function fetchData(slug1: string, slug2: string) {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}user/badge/show/${slug1}/${slug2}`);
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default async function Badge({ params }: { params: { slug: string[] } }) {
  const slugPart1 = params.slug[0];
  const slugPart2 = params.slug[1];
  const headersList = headers();

  if (!slugPart1 || !slugPart2) {
    redirect('/badge-not-found');
  }

  const detailBadge = await fetchData(slugPart1, slugPart2);

  if (!detailBadge || detailBadge[0].status !== "Published" || detailBadge[0].publishedParticipants[0].statusGraduation === "failed") {
    redirect('/badge-not-found');
  }

  const programName = detailBadge[0].lmsCourseName ? detailBadge[0].lmsCourseName : "";
  const programCat = detailBadge[0].lmsCategoryName;
  const programDesc = detailBadge[0].description;
  const startDate = new Date(detailBadge[0].startDate).toLocaleDateString('en-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const endDate = new Date(detailBadge[0].endDate).toLocaleDateString('en-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const publishDate = detailBadge[0].publishDate
    ? new Date(detailBadge[0].publishDate).toLocaleDateString('en-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : "";
  const expiredDate = detailBadge[0].expiredDate?new Date(detailBadge[0].expiredDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }):null;
  const participantName = detailBadge[0].publishedParticipants[0].nameOnCertificate?detailBadge[0].publishedParticipants[0].nameOnCertificate:'';
  const badgeData = detailBadge[0].certificate.badge?detailBadge[0].certificate.badge:0;
  const fileBadge = badgeData.badgeFile?badgeData.badgeFile:'';
  const skill = detailBadge[0].programSkills?detailBadge[0].programSkills:null;
  const badgeId = detailBadge[0].certificate.badge.id?detailBadge[0].certificate.badge.id:'';
  let date = (startDate === endDate)? startDate:startDate + ' - ' + endDate;
  let translateY: string;
  let padding: string;
  switch (badgeId) {
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

  const certificateUrl = `/certificate/${slugPart2}/${slugPart1}`;

  return (
    <div className='w-max-container mx-auto grid gap-7 py-8'>
      
      <div className="relative py-14 px-3 sm:px-8 rounded-[15px] shadow-lg" style={{background: 'linear-gradient(to bottom, #46e297, #3da2f4)'}}>
        <div className="absolute inset-[3px] rounded-[13px] bg-white"/>
        <div className='max-w-6xl mx-auto lg:flex grid relative gap-4 justify-center'>
          <div className='grid items-center font-medium'>
            <p className='text-center lg:text-left' >This badge was issued to <text className='font-semibold'>{participantName}</text> on <text>{publishDate}</text></p>
            {expiredDate && <p className='text-emerald-500 text-center lg:text-left'>Expired on <text className='text-gray-500'>{expiredDate}</text></p>}
          </div>
          <div className='ms-auto me-auto lg:me-0  content-center font-semibold end'>
            <ButtonVerify value={detailBadge[0]}/>
          </div>
        </div>
        
      </div>
      <div className="relative py-14 px-3 sm:px-8 rounded-[15px] shadow-lg" style={{background: 'linear-gradient(to bottom, #46e297, #3da2f4)'}}>
        <div className="absolute inset-[3px] rounded-[13px] bg-white"/>
        <div className='relative lg:flex grid gap-20 items-center max-w-6xl mx-auto'>
          <div className='w-fit min-w-[180px] grid mx-auto scale-75'>
            <Image
              src={`data:image/svg+xml;base64,${fileBadge}`}
              alt='Badge'
              width={180}
              height={180}
            />
            <div className='w-[180px] h-[50px] text-gray-600 absolute text-center overflow-hidden grid'
            style={{ transform: `translateY(${translateY})`, paddingInline: `${padding}` }}>
              <p className='text-[11px] font-semibold mt-auto items-end leading-normal uppercase'>{programCat}</p>
            </div>
          </div>
          <div className='lg:grow'>
            <h1 className={`md:text-5xl text-3xl font-semibold `}>{participantName}</h1>
            <h2 className={`font-semibold md:text-2xl text-xl mt-3`}>{programName}</h2>
            <p className='mt-2 text-gray-500 text-lg font-medium'>
                {date}
            </p>
            <p className={`mt-2 text-base font-normal`}>{programDesc}</p>
          </div>
        </div>
        <div className='relative md:flex max-w-6xl mx-auto justify-between'>
          <div className='mt-12'>
            <div className='flex flex-col'>
              <p className='text-gray-500 text-lg font-medium'>Organizer</p>
              <Link className='w-fit' href='https://prasmul-eli.co/id/' rel="noopener" target="_blank">
                <Image
                  className='mt-2'
                  src={LogoEli}
                  height={100}
                  width={200}
                  alt='Organizer'
                />
              </Link>
            </div>
            {skill.length > 0 && 
            <div className='mt-8'>
              <p className='text-gray-500 text-lg font-medium'>Skill Set</p>
              <div className="flex flex-wrap gap-3 mt-4">
                {skill.map((s, index:number) => (
                  <p
                    key={index}
                    className={`px-4 text-sm py-2 rounded-md font-normal shadow bg-neutral-100`}
                  >
                    {s.skill.label}
                  </p>
                ))}
              </div>
            </div>}
          </div>
          <div className='mt-12 md:px-10 flex-none'>
          {expiredDate &&<div className={`flex text-gray-500 text-lg font-medium w-fit mx-auto md:mx-0`}>
              <p className='text-emerald-500'>Verified until</p>
              <p className={` ms-3`}>
                {expiredDate}
              </p>
            </div>}
            <div className='mt-4'>
              <p className='flex text-lg font-medium w-fit mx-auto'>Certificate</p>
              <div className='mt-2 w-fit mx-auto' style={{
                  backgroundImage: `url('/img/focus.svg')`,
                  backgroundSize: 'contain',
                  padding: '23px',
                }}>
                <Link target='_blank' href={certificateUrl} >
                  <QRCode
                    className='mx-auto '
                    value={ headersList.get('host') + certificateUrl}
                    size={130}
                    bgColor={'#ffffff'}
                    fgColor={'#000000'}
                  />
                </Link>
              </div>
              <p className='flex text-md font-normal justify-center mt-3 italic'>(click/scan for view)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
