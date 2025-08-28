"use client"

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Para a loading state quando a rota muda
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100) // Pequeno delay para evitar flicker

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  const startLoading = () => {
    setIsLoading(true)
  }
  
  const stopLoading = () => {
    setIsLoading(false)
  }

  return { isLoading, startLoading, stopLoading }
}
