import React from 'react'
import '@/styles/css/globals.css'
// import {montserrat} from '@/styles/fonts'
import '@/styles/css/public.css'
import type { Metadata } from 'next'
import {Montserrat} from 'next/font/google';

const montserrat = Montserrat({
   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
   subsets: ['latin'],
   variable: '--font-montserrat',
})
 
// either Static metadata
export const metadata: Metadata = {
  title: 'Badge & Certificate',
}

export default function RootLayout({children,}: {children: React.ReactNode}) {
   return (
      <>
      <html lang="en" className={montserrat.variable}>
      <head>
         <link rel="icon" href="/img/favicon.png" sizes="any" />
         <link rel="apple-touch-icon" href="/img/apple-touch-icon.png" sizes="any"/>
      </head>
      <body className='font-montserrat'>
         {children}
      </body>
      </html>
     </>
   )
 }