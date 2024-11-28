import React from 'react'
import { AuthProvider } from '@/components/context/authContext';

export default function Layout({children}: {children: React.ReactNode}) {
   return (
      <AuthProvider>
         {children}
      </AuthProvider>
   )
}