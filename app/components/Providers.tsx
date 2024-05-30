'use client'

import { Toaster } from "react-hot-toast" 
import { FC, ReactNode } from "react"

interface ProividerProps {
    children:ReactNode
}

const Providers: FC<ProividerProps> = ({children}) => {
  return (
    <>
        <Toaster position="top-center" reverseOrder={false}/>
        {children}
    </>
  )
}

export default Providers