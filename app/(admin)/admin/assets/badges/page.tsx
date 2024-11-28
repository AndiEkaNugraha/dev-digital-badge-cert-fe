"use client"
import axios from 'axios'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Badges () {
   const [badge, setBadge] = useState([])
   const getBadges = async () => {
      try {
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}cms/badge/all`)
         const data = await response.data
         setBadge(data)
      } catch (err) {
         console.log(err)
      }
   }

   useEffect(() => {
      getBadges()
      
   },[])
   
   return (
      <>
      <div className='w-max-container mx-auto py-6 mt-14'>
         <div className='flex flex-wrap gap-14 justify-center pt-14'>
            {badge.map((item, index) => (
               <div className='grid bg-white rounded-[15px]' style={{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
                  <div className="relative py-7 px-3 rounded-[15px] shadow-lg" style={{background: 'linear-gradient(to bottom, #46e297, #3da2f4)'}}>
                     <div className="absolute inset-[2px] rounded-[13px] bg-white"></div>
                     <div className="relative px-9">
                        <Image
                           key={index}
                           src={`data:image/svg+xml;base64,${item.badgeFile}`}
                           alt={`Badge ${index + 1}`}
                           width={200}
                           height={200}
                        />
                     </div>
                     
                  </div>
                  <div className='font-semibold text-emerald-600 my-4 px-5 '>{item.label}</div>
               </div>
            ))}
         </div>
      </div>
      </>
   )
}
