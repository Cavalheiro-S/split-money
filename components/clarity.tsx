'use client'
import { useEffect } from 'react'
import Clarity from '@microsoft/clarity'

interface ClarityProps {
  projectId: string
}

export default function ClarityProvider({ projectId }: ClarityProps) {
  useEffect(() => {
    if (projectId) {
      Clarity.init(projectId)
    }
  }, [projectId])
  return null
}

