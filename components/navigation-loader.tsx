"use client"

import { useNavigationLoadingContext } from '@/contexts/navigation-loading-context'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NavigationLoader() {
  const { isLoading } = useNavigationLoadingContext()

  if (!isLoading) return null

  return (
    <>
      {/* Barra de progresso no topo - NÃO bloqueia interação */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20",
        "transition-all duration-300 ease-in-out pointer-events-none"
      )}>
        <div className={cn(
          "h-full bg-primary animate-pulse",
          "relative overflow-hidden"
        )}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
      
      {/* Indicador discreto no canto - NÃO bloqueia interação */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm border shadow-lg rounded-lg px-3 py-2 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-xs font-medium text-gray-600">
            Carregando...
          </span>
        </div>
      </div>
    </>
  )
}
