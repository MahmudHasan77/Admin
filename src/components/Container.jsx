import React from 'react'
import { Cn } from './Ui/Cn'



const Container = ({children , className}) => {
  return (
    <div className={Cn("mx-auto px-2 py-5" , className)}>
      {children}
    </div>
  )
}

export default Container
