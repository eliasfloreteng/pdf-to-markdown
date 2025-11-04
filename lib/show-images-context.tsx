"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface ShowImagesContextType {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
}

const ShowImagesContext = createContext<ShowImagesContextType | undefined>(
  undefined,
)

export function ShowImagesProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true) // Default on

  return (
    <ShowImagesContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </ShowImagesContext.Provider>
  )
}

export function useShowImages() {
  const context = useContext(ShowImagesContext)
  if (context === undefined) {
    throw new Error("useShowImages must be used within ShowImagesProvider")
  }
  return context
}
