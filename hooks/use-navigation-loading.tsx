"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  const startLoading = () => {
    setIsLoading(true)
  }
  
  const stopLoading = () => {
    setIsLoading(false)
  }

  return { isLoading, startLoading, stopLoading }
}
