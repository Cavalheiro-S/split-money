"use client"

import Link from 'next/link'
import { useNavigationLoadingContext } from '@/contexts/navigation-loading-context'
import { usePathname } from 'next/navigation'
import { ComponentProps, ReactNode } from 'react'

interface LoadingLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  href: string
  children: ReactNode
  className?: string
}

export function LoadingLink({ href, children, onClick, className, ...props }: LoadingLinkProps) {
  const { startLoading } = useNavigationLoadingContext()
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Só ativa loading se estiver navegando para uma página diferente
    if (href !== pathname) {
      startLoading()
    }
    
    // Chama o onClick original se existir
    onClick?.(e)
  }

  return (
    <Link 
      href={href} 
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </Link>
  )
}
