"use client"

import { useAuth } from "@/components/context/authContext"

export default function Generator() {
   const { userData } = useAuth()
   return (
      <div className='w-max-container container mx-auto'>
         <div className="text-end mt-9">
            <h1 className="text-2xl font-bold text-sky-600">Welcome, {userData?.fullname}</h1>
         </div>
      </div>
   )
}