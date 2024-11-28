"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LayoutAssets({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <div>
        <div className='bg-white justify-center flex gap-10 text-[16px] shadow-md relative'>
          <button className={`pt-5 grid text-emerald-500 text-lg transition-all ${pathname === '/admin/assets'? 'font-semibold duration -100': 'font-normal duration-200'}`}>
            <Link href="/admin/assets">Certificates</Link>
            <div className={`mt-3  w-[100%] bg-emerald-500 transition-all ${pathname === '/admin/assets'? 'h-[3px] duration-100' : 'h-0 duration-200'}`}></div>
          </button>
          <button className={`pt-5 grid text-emerald-500 text-lg transition-all ${pathname === '/admin/assets/badges'? 'font-semibold duration -100': 'font-normal duration-200'}`}>
            <Link href="/admin/assets/badges">Badges</Link>
            <div className={`mt-3  w-[100%] bg-emerald-500 transition-all ${pathname === '/admin/assets/badges' ? 'h-[3px] duration-100' : 'h-0 duration-200'}`}>
            </div>
          </button>
          <button className={`pt-5 grid text-emerald-500 text-lg transition-all ${pathname === '/admin/assets/skillset'? 'font-semibold duration -100': 'font-normal duration-200'}`}>
            <Link href="/admin/assets/skillset">Skill Set</Link>
            <div className={`mt-3  w-[100%] bg-emerald-500 transition-all ${pathname === '/admin/assets/skillset' ? 'h-[3px] duration-100' : 'h-0 duration-200'}`}></div>
          </button>
        </div>
        <div className='ml-[65px]'>
        {children}
        </div>
        
      </div>
    </>
  )
}
