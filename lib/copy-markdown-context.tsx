"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface CopyMarkdownContextType {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
}

const CopyMarkdownContext = createContext<CopyMarkdownContextType | undefined>(
  undefined,
)

export function CopyMarkdownProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true) // Default on

  return (
    <CopyMarkdownContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </CopyMarkdownContext.Provider>
  )
}

export function useCopyMarkdown() {
  const context = useContext(CopyMarkdownContext)
  if (context === undefined) {
    throw new Error("useCopyMarkdown must be used within CopyMarkdownProvider")
  }
  return context
}
