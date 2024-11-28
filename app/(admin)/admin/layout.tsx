"use client"

import React, { useEffect } from 'react'
import Sidebar from '@/components/admin/layout/sidebar'
import '@/styles/css/admin.css'
import '@/styles/css/alertify.css';
import { useAuth } from '@/components/context/authContext';
import { redirect } from 'next/navigation';

export default function Layout({children}: {children: React.ReactNode}) {
   const {userData} = useAuth();
   useEffect(() => {
      if (window !== undefined) {
         if (userData === null) {
            return redirect('https://my.prasmul-eli.co/');
         }
      }
   },[userData])
   return (
         <div className='flex bg-blue-50 min-h-screen'>
            <Sidebar/>
            <div className='w-[calc(100vw)]'>
               {children}
            </div>
         </div>
   )
}