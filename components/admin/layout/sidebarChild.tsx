import React from "react";
import Link from "next/link";
interface sidebarChildProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  path:string;
}

export default function SidebarChild({ icon, label, isActive,path }: sidebarChildProps) {
  return (
<button className={`sidebar__icon ${isActive ? "active" : ""} hover:font-[600] transition-all duration-400`}>
  <Link
    className="relative flex gap-6 items-center px-5 overflow-hidden h-[50px]"
    href={path}
  >
    <div className="w-[25px] justify-center flex z-10">
      {icon}
    </div>
    <h2 className={`text-center ${isActive ? "font-[600]" : ""} text-[16px] self-center text-sky-900 z-10`}>
      {label}
    </h2>
    <span className={`absolute inset-0 bg-gradient-sidebar transform scale-x-0 origin-right transition-transform duration-500 ease-out ${isActive ? "scale-x-100" : ""}`}></span>

  </Link>
</button>


  );
}