"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link"
import {usePathname } from 'next/navigation';
import SidebarChild from "@/components/admin/layout/sidebarChild"
import {SvgHome, SvgAssets, SvgPrograms, SvgParticipant, SvgLogOut, SvgSidebarButton} from "@/public/svg/sidebar"

export default function Sidebar() {
   const [expand,setExpand] = useState(false)
   const router = usePathname()
   function handleClick() {
      const sidebar = document.getElementById('sidebar');
      const childSidebar = document.getElementById('sidebar__child');
      const sidebarButton = document.getElementById('sidebar__button');
      const sideBarLogo = document.getElementById('sidebar__logo');
      sideBarLogo.classList.toggle('show');      
      sidebar.classList.toggle('show');  
      childSidebar.classList.toggle('show');   
      sidebarButton.classList.toggle('show');
      if (sidebar.classList.contains('show')) {
         setExpand(true)
      }
      else {
         setExpand(false)
      }
   }
   const itemsSidebar:{icon: React.ReactNode; label: string, path: string }[] = [{
      icon: <SvgHome/>,
      label: "Dashboard",
      path: "/admin"
   },{
      icon: <SvgAssets/>,
      label: "Assets",
      path: "/admin/assets"
   },{
      icon: <SvgPrograms/>,
      label: "Programs",
      path: "/admin/programs"
   },{
      icon: <SvgParticipant/>,
      label: "Participants",
      path: "/admin/participants"
   }]

   return (
      <div className="fixed top-0 z-20">
         <button id="sidebar__button" className="absolute mt-12 z-30" onClick={handleClick}>
            <SvgSidebarButton/>
         </button>
         <div id="sidebar" className='bg-white justify-start shadow-xl border-gray-200 grid overflow-hidden'>
            <div id="sidebar__child" className="py-5 flex flex-col w-[250px]">
               <div id="sidebar__logo" className={`flex flex-wrap items-end `}>
                  <div className={`translate-x-[2px] transition-all duration-300 ${expand ? 'opacity-1' : 'opacity-0'}`}><Image priority={true} alt="prasmul-eli" src="/img/prasmul.png" width={93} height={24.21}/></div>
                  <div><Image priority={true} alt="icon" src="/img/eli-logo.png" width={24.39} height={34.29}/></div>
                  <div className={`mb-[5px] translate-x-[-5px] transition-all duration-300 ${expand ? 'opacity-1' : 'opacity-0'}`}><Image priority={true} alt="prasmul-eli" src="/img/eli.png" width={26.5} height={19.45}/></div>  
               </div>
               <div className="flex flex-col mt-20">
                  {itemsSidebar.map((itemsSidebar, index) => (
                     <SidebarChild
                     key={index}
                     path={itemsSidebar.path}
                     icon={itemsSidebar.icon}
                     label={itemsSidebar.label}
                     isActive={
                       itemsSidebar.path === '/admin'
                         ? router === itemsSidebar.path
                         : router.startsWith(itemsSidebar.path)
                     }
                   />
                  ))}
               </div>
               <button className="mt-auto sidebar__icon hover:font-[600] transition-all duration-400">
                  <Link className="flex gap-6 items-center px-5" href="https://my.prasmul-eli.co">
                     <div className="w-[25px] justify-center flex">
                        <SvgLogOut/>
                     </div>
                     <h2 className="text-center text-[16px] self-center">Log Out</h2>
                  </Link>
               </button>
         </div>
         </div>         
      </div> 
   )
}
