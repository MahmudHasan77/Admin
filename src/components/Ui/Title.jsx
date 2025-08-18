import React from 'react'
import { Cn } from './Cn'
const Title = ({children,className}) => {
  return (
    <h1 className={Cn('text-2xl font-semibold ' , className)}>
      {children}
    </h1>
  )
}

export default Title
