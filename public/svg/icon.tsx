type SVGData = {
   height: number;
   width: number;
   className: string
 }
export function SVGSearch():JSX.Element {
   return (
      <svg className="w-[15px] h-[15px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
         <path stroke="gray" strokeLinecap="round" strokeWidth="1.5" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
      </svg>
   )
}
export function SVGBack(data:SVGData):JSX.Element {
   return(
      <svg id="SVGBack" height={JSON.stringify(data.height)} width={JSON.stringify(data.width)} version="1.1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 499.2 499.2" fill="#000000">
         <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
         <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.9984"></g>
         <g id="SVGBack" className="cursor-pointer">
            <path  id="path1" style={{fill:"#059669"}} d="M489.6,229.6c-10.4,20.8-29.6,37.6-52.8,44c19.2,45.6,21.6,96.8,2.4,142.4c34.4-11.2,60-43.2,60-81.6 v-68.8C499.2,253.6,495.2,241.6,489.6,229.6z"></path>
            <path  id="path2" style={{fill:"#34d399"}} d="M413.6,177.6h-228c-47.2,0-86.4,38.4-86.4,85.6v58.4h232l0,0h82.4c33.6,0,64,20.8,77.6,49.6 c6.4-14.4,8-25.6,8-39.2v-68.8C499.2,216,460.8,177.6,413.6,177.6z"></path>
            <polygon  id="polygon" style={{fill:"#059669"}} points="123.2,249.6 219.2,153.6 219.2,30.4 0,249.6 219.2,468.8 219.2,345.6 "></polygon>
            <polyline id="polyline" style={{fill:"#34d399"}} points="1.6,249.6 219.2,468.8 219.2,345.6 124.8,249.6 219.2,153.6 "></polyline>
            </g>
      </svg>
   )
}

export function SVGPeople(data:SVGData):JSX.Element {
   return (
      <svg  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height={JSON.stringify(data.height)} width={JSON.stringify(data.width)} fill="none" viewBox="0 0 24 24">
         <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
      </svg>
   )
}

export function SVGGraduate(data:SVGData):JSX.Element {
return (
   <svg xmlns="http://www.w3.org/2000/svg" height={JSON.stringify(data.height)} width={JSON.stringify(data.width)} viewBox="0 0 150 150" fill="none">
         <g id="education-cap-student-graduation-university-svgrepo-com (1) 1" clip-path="url(#clip0_36_2)">
         <path id="Vector" d="M75 18.75L4.6875 56.25L75 93.75L145.312 56.25L75 18.75Z" stroke="currentColor" strokeWidth="10" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
         <path id="Vector_2" d="M32.8125 71.25V103.125C32.8125 113.437 51.5625 126.562 75 126.562C98.4375 126.562 117.188 113.437 117.188 103.125V71.25" stroke="currentColor" strokeWidth="10" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
         <path id="Vector_3" d="M145.312 56.25V117.188" stroke="currentColor" strokeWidth="10" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
         </g>
         <defs>
         <clipPath id="clip0_36_2">
         <rect width="150" height="150" fill="white"/>
         </clipPath>
         </defs>
      </svg>
   )
}

export function SVGMail(data:SVGData):JSX.Element {
   return(
   <svg xmlns="http://www.w3.org/2000/svg" height={JSON.stringify(data.height)} width={JSON.stringify(data.width)} viewBox="0 0 150 150" fill="none">
      <g id="mail-svgrepo-com 1">
      <path id="Vector" d="M18.75 50L52.812 72.7081C60.8309 78.0537 64.8406 80.7269 69.1737 81.7656C73.0037 82.6831 76.9963 82.6831 80.8263 81.7656C85.1594 80.7269 89.1694 78.0537 97.1881 72.7081L131.25 50M38.75 118.75H111.25C118.251 118.75 121.751 118.75 124.425 117.387C126.777 116.189 128.689 114.277 129.887 111.925C131.25 109.251 131.25 105.751 131.25 98.75V51.25C131.25 44.2494 131.25 40.749 129.887 38.0751C128.689 35.7231 126.777 33.8108 124.425 32.6124C121.751 31.25 118.251 31.25 111.25 31.25H38.75C31.7494 31.25 28.249 31.25 25.5751 32.6124C23.2231 33.8108 21.3108 35.7231 20.1124 38.0751C18.75 40.749 18.75 44.2493 18.75 51.25V98.75C18.75 105.751 18.75 109.251 20.1124 111.925C21.3108 114.277 23.2231 116.189 25.5751 117.387C28.249 118.75 31.7493 118.75 38.75 118.75Z" stroke="black" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
   </svg>
   )
}

export function SVGWarning(data:SVGData):JSX.Element {
   return(
      <svg className="SVGWarning" xmlns="http://www.w3.org/2000/svg" height={JSON.stringify(data.height)} width={JSON.stringify(data.width)} viewBox="0 0 150 150" fill="none">
         <path className="Vector" d="M75 43.75V81.25" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
         <path className="Vector_2" d="M75 106.25C78.4518 106.25 81.25 103.452 81.25 100C81.25 96.5482 78.4518 93.75 75 93.75C71.5482 93.75 68.75 96.5482 68.75 100C68.75 103.452 71.5482 106.25 75 106.25Z" fill="currentColor"/>
         <path className="Vector_3" d="M43.75 20.8614C52.9429 15.5436 63.6162 12.5 75 12.5C109.517 12.5 137.5 40.4822 137.5 75C137.5 109.517 109.517 137.5 75 137.5C40.4822 137.5 12.5 109.517 12.5 75C12.5 63.6162 15.5436 52.9429 20.8614 43.75" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
      </svg>
   )
}

export function SVGChevronLeft(data:SVGData):JSX.Element {
   return(
      <svg className="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height={JSON.stringify(data.height)} width={JSON.stringify(data.width)} fill="none" viewBox="0 0 24 24">
         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/>
      </svg>
   )
}

export function SVGChevronRight(data:SVGData):JSX.Element {
   return(
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height={JSON.stringify(data.height)} width={JSON.stringify(data.width)} fill="none" viewBox="0 0 24 24">
         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
      </svg>

   )
}

export function SVGLinkedin(data:SVGData):JSX.Element {
   return(
      <svg className={data.className} height={JSON.stringify(data.height)} width={JSON.stringify(data.width)} xmlns="http://www.w3.org/2000/svg" aria-label="LinkedIn" role="img" viewBox="0 0 512 512" fill="#ffffff"><rect height='512' width='512' rx="15%" fill="#0077b5"/><circle cx="142" cy="138" r="37"/><path stroke="#ffffff" stroke-width="66" d="M244 194v198M142 194v198"/><path d="M276 282c0-20 13-40 36-40 24 0 33 18 33 45v105h66V279c0-61-32-89-76-89-34 0-51 19-59 32"/></svg>
   )
}

export function SVGWhatsapp(data:SVGData):JSX.Element {
   return(
      <svg className={data.className} height={JSON.stringify(data.height)} width={JSON.stringify(data.width)} xmlns="http://www.w3.org/2000/svg" aria-label="WhatsApp" role="img" viewBox="0 0 512 512"><rect height='512' width='512' rx="15%" fill="#25d366"/><path fill="#25d366" stroke="#ffffff" stroke-width="26" d="M123 393l14-65a138 138 0 1150 47z"/><path fill="#ffffff" d="M308 273c-3-2-6-3-9 1l-12 16c-3 2-5 3-9 1-15-8-36-17-54-47-1-4 1-6 3-8l9-14c2-2 1-4 0-6l-12-29c-3-8-6-7-9-7h-8c-2 0-6 1-10 5-22 22-13 53 3 73 3 4 23 40 66 59 32 14 39 12 48 10 11-1 22-10 27-19 1-3 6-16 2-18"/></svg>
   )
}

export function SVGEmail (data:SVGData):JSX.Element {
   return(
      <svg className={data.className} height={JSON.stringify(data.height)} width={JSON.stringify(data.width)} xmlns="http://www.w3.org/2000/svg" aria-label="Mail" role="img" viewBox="0 0 512 512"><rect height='512' width='512' rx="15%" fill="#328cff"/><path d="m250 186c-46 0-69 35-69 74 0 44 29 72 68 72 43 0 73-32 73-75 0-44-34-71-72-71zm-1-37c30 0 57 13 77 33 0-22 35-22 35 1v150c-1 10 10 16 16 9 25-25 54-128-14-187-64-56-149-47-195-15-48 33-79 107-49 175 33 76 126 99 182 76 28-12 41 26 12 39-45 19-168 17-225-82-38-68-36-185 67-248 78-46 182-33 244 32 66 69 62 197-2 246-28 23-71 1-71-32v-11c-20 20-47 32-77 32-57 0-108-51-108-108 0-58 51-110 108-110" fill="#ffffff"/></svg>
   )
}

export function SVGShare (data:SVGData):JSX.Element {
 return(
   <svg  xmlns="http://www.w3.org/2000/svg"  className={data.className} height={JSON.stringify(data.height)} width={JSON.stringify(data.width)} viewBox="0 0 24 24" fill="none">
      <path d="M20.7914 12.6075C21.0355 12.3982 21.1575 12.2936 21.2023 12.1691C21.2415 12.0598 21.2415 11.9403 21.2023 11.831C21.1575 11.7065 21.0355 11.6019 20.7914 11.3926L12.3206 4.13202C11.9004 3.77182 11.6903 3.59172 11.5124 3.58731C11.3578 3.58348 11.2101 3.6514 11.1124 3.77128C11 3.90921 11 4.18595 11 4.73942V9.03468C8.86532 9.40813 6.91159 10.4898 5.45971 12.1139C3.87682 13.8846 3.00123 16.176 3 18.551V19.163C4.04934 17.8989 5.35951 16.8766 6.84076 16.166C8.1467 15.5395 9.55842 15.1684 11 15.0706V19.2607C11 19.8141 11 20.0909 11.1124 20.2288C11.2101 20.3487 11.3578 20.4166 11.5124 20.4128C11.6903 20.4084 11.9004 20.2283 12.3206 19.8681L20.7914 12.6075Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
   </svg>
 )}

 export function SVGCopy (data:SVGData):JSX.Element{
   return(
      <svg xmlns="http://www.w3.org/2000/svg" className={data.className} height={JSON.stringify(data.height)} width={JSON.stringify(data.width)} viewBox="0 0 24 24" fill="none">
         <rect width="24" height="24" fill=""/>
         <rect x="4" y="8" width="12" height="12" rx="1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
         <path d="M8 6V5C8 4.44772 8.44772 4 9 4H19C19.5523 4 20 4.44772 20 5V15C20 15.5523 19.5523 16 19 16H18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 2"/>
      </svg>
   )
 }

 export function SVGSuccess (data:SVGData):JSX.Element {
   return(
      <svg xmlns="http://www.w3.org/2000/svg" className={data.className} height={JSON.stringify(data.height)} width={JSON.stringify(data.width)} viewBox="0 0 117 117" version="1.1">
         <g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1">
         <g fill-rule="nonzero" id="correct">
         <path d="M34.5,55.1 C32.9,53.5 30.3,53.5 28.7,55.1 C27.1,56.7 27.1,59.3 28.7,60.9 L47.6,79.8 C48.4,80.6 49.4,81 50.5,81 C50.6,81 50.6,81 50.7,81 C51.8,80.9 52.9,80.4 53.7,79.5 L101,22.8 C102.4,21.1 102.2,18.5 100.5,17 C98.8,15.6 96.2,15.8 94.7,17.5 L50.2,70.8 L34.5,55.1 Z" fill="#17AB13" id="Shape"/>
         <path d="M89.1,9.3 C66.1,-5.1 36.6,-1.7 17.4,17.5 C-5.2,40.1 -5.2,77 17.4,99.6 C28.7,110.9 43.6,116.6 58.4,116.6 C73.2,116.6 88.1,110.9 99.4,99.6 C118.7,80.3 122,50.7 107.5,27.7 C106.3,25.8 103.8,25.2 101.9,26.4 C100,27.6 99.4,30.1 100.6,32 C113.1,51.8 110.2,77.2 93.6,93.8 C74.2,113.2 42.5,113.2 23.1,93.8 C3.7,74.4 3.7,42.7 23.1,23.3 C39.7,6.8 65,3.9 84.8,16.2 C86.7,17.4 89.2,16.8 90.4,14.9 C91.6,13 91,10.5 89.1,9.3 Z" fill="currentColor" id="Shape"/>
         </g>
         </g>
      </svg>
   )
 }

 export function SVGVerify ({ height, width, className }: SVGData):JSX.Element {
   return(
      <svg xmlns="http://www.w3.org/2000/svg" className={className} height={height} width={width} viewBox="0 0 28 28" fill="none">
         <path d="M27.145 12.2675L25.275 10.095C24.9175 9.68249 24.6287 8.91249 24.6287 8.36249V6.02499C24.6287 4.56749 23.4325 3.37124 21.975 3.37124H19.6375C19.1012 3.37124 18.3175 3.08249 17.905 2.72499L15.7325 0.854989C14.7837 0.0437391 13.23 0.0437391 12.2675 0.854989L10.1087 2.73874C9.69624 3.08249 8.91249 3.37124 8.37624 3.37124H5.99749C4.53999 3.37124 3.34374 4.56749 3.34374 6.02499V8.37624C3.34374 8.91249 3.05499 9.68249 2.71124 10.095L0.854991 12.2812C0.0574915 13.23 0.0574915 14.77 0.854991 15.7187L2.71124 17.905C3.05499 18.3175 3.34374 19.0875 3.34374 19.6237V21.975C3.34374 23.4325 4.53999 24.6287 5.99749 24.6287H8.37624C8.91249 24.6287 9.69624 24.9175 10.1087 25.275L12.2812 27.145C13.23 27.9562 14.7837 27.9562 15.7462 27.145L17.9187 25.275C18.3312 24.9175 19.1012 24.6287 19.6512 24.6287H21.9887C23.4462 24.6287 24.6425 23.4325 24.6425 21.975V19.6375C24.6425 19.1012 24.9312 18.3175 25.2887 17.905L27.1587 15.7325C27.9562 14.7837 27.9562 13.2162 27.145 12.2675ZM19.72 11.4012L13.0787 18.0425C12.8862 18.235 12.625 18.345 12.35 18.345C12.075 18.345 11.8137 18.235 11.6212 18.0425L8.29374 14.715C7.89499 14.3162 7.89499 13.6562 8.29374 13.2575C8.69249 12.8587 9.35249 12.8587 9.75124 13.2575L12.35 15.8562L18.2625 9.94374C18.6612 9.54499 19.3212 9.54499 19.72 9.94374C20.1187 10.3425 20.1187 11.0025 19.72 11.4012Z" fill="currentColor"/>
      </svg>
   )
 }

 export function SVGClose (data:SVGData):JSX.Element {
   return(
      <svg xmlns="http://www.w3.org/2000/svg" className={data.className} height={JSON.stringify(data.height)} width={JSON.stringify(data.width)} viewBox="0 0 37 37" fill="none">
         <path d="M1 1L36 35.8833" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
         <path d="M1 36L36 1.11672" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg> )
}

export function SVGFilter (data:SVGData):JSX.Element {
   return(
      <svg  xmlns="http://www.w3.org/2000/svg"  className={data.className} height={JSON.stringify(data.height)} width={JSON.stringify(data.width)}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 8h4v4h-4z" /><path d="M6 4l0 4" /><path d="M6 12l0 8" /><path d="M10 14h4v4h-4z" /><path d="M12 4l0 10" /><path d="M12 18l0 2" /><path d="M16 5h4v4h-4z" /><path d="M18 4l0 1" /><path d="M18 9l0 11" /></svg>
   )
}