import {clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'

export const Cn = (...inputs) =>{
    return twMerge(clsx(inputs))
}