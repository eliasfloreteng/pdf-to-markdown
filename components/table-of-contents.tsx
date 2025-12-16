"use client"

import { useMemo } from "react"
import { extractHeadings, type TocItem } from "@/lib/extract-headings"
import { List } from "lucide-react"

interface TableOfContentsProps {
  markdown: string
  onNavigate?: (headingId: string) => void
}

export function TableOfContents({ markdown, onNavigate }: TableOfContentsProps) {
  const headings = useMemo(() => extractHeadings(markdown), [markdown])

  const handleClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id)
    }
  }

  if (headings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <List className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-sm sm:text-base text-muted-foreground">
          No headings found in this document
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {headings.map((heading, index) => (
        <button
          key={`${heading.id}-${index}`}
          onClick={() => handleClick(heading.id)}
          className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors group"
          style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
        >
          <div className="flex items-start gap-2">
            <span className="text-xs text-muted-foreground mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              H{heading.level}
            </span>
            <span className="text-sm text-foreground group-hover:text-accent-foreground break-words">
              {heading.text}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
