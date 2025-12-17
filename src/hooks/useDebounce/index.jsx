import { useEffect, useState } from "react"


const useDebounce=(value,delay=500)=>{
    const [debounceValue,setDebouceValue]=useState(value)

    useEffect(()=>{
        const timer=setTimeout(()=>setDebouceValue(value,delay))
        return ()=>clearTimeout(timer)
    },[value,delay])
    return  debounceValue
}
export default useDebounce