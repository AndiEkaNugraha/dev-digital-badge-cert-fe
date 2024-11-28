export default function Layout({children}: {children: React.ReactNode}) {
   return (
      <>
      <div className='min-h-screen relative overflow-x-hidden' >
         <div id='parent' className=''>
            {children}
         </div>
      </div>
      </>
   )
}