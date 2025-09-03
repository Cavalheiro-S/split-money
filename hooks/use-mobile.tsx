import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isMounted, setIsMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    setIsMounted(true)
    
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    checkIsMobile()
    
    const onChange = () => {
      checkIsMobile()
    }
    
    mql.addEventListener("change", onChange)
    
    return () => {
      mql.removeEventListener("change", onChange)
    }
  }, [])

  // Retorna false durante SSR para evitar problemas de hidratação
  if (!isMounted) {
    return false
  }

  return isMobile
}
