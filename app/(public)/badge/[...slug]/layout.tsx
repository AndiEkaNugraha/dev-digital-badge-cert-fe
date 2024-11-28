import React from 'react'

export default function Layout({children}: {children: React.ReactNode}) {
   return (
      <>
      <div className='bg-blue-50 min-h-screen'>
         <div className='w-full'>
            {children}
         </div>
      </div>
      </>
   )
}