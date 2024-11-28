"use client"

import { useAuth } from "@/components/context/authContext"

export default function Test () {
   const { userData } = useAuth()
   console.log(userData)
   return (
      <div>
         <h1>Test</h1>
      </div>
   )
}