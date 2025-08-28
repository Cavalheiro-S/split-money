"use client"

import React, { createContext, useContext, ReactNode, Suspense } from 'react'
import { useNavigationLoading } from '@/hooks/use-navigation-loading'

type NavigationLoadingContextType = {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType | undefined>(undefined)

function NavigationLoadingProviderInner({ children }: { children: ReactNode }) {
  const navigationLoading = useNavigationLoading()

  return (
    <NavigationLoadingContext.Provider value={navigationLoading}>
      {children}
    </NavigationLoadingContext.Provider>
  )
}

export function NavigationLoadingProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <NavigationLoadingProviderInner>
        {children}
      </NavigationLoadingProviderInner>
    </Suspense>
  )
}

export function useNavigationLoadingContext() {
  const context = useContext(NavigationLoadingContext)
  if (context === undefined) {
    throw new Error('useNavigationLoadingContext must be used within a NavigationLoadingProvider')
  }
  return context
}
