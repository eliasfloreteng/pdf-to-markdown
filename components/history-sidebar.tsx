"use client"

import { useState } from "react"
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
  X,
  Upload,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { ProcessedDocument } from "@/lib/types"

interface HistorySidebarProps {
  history: ProcessedDocument[]
  onSelect: (doc: ProcessedDocument) => void
  selectedId?: string
  onDelete?: (id: string) => void
  onClearAll?: () => void
  onNewUpload?: () => void
}

export function HistorySidebar({
  history,
  onSelect,
  selectedId,
  onDelete,
  onClearAll,
  onNewUpload,
}: HistorySidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  if (history.length === 0) return null

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sidebar-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-semibold text-sm">History</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hidden lg:flex"
            onClick={() => setIsCollapsed(true)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        {onNewUpload && (
          <Button onClick={() => { onNewUpload(); setIsOpen(false); }} className="w-full gap-2" size="sm">
            <Upload className="w-4 h-4" />
            New Upload
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {history.map((doc) => (
          <div
            key={doc.id}
            className={cn(
              "group relative rounded-lg transition-colors",
              selectedId === doc.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
            )}
          >
            <button
              onClick={() => { onSelect(doc); setIsOpen(false); }}
              className="w-full p-3 text-left"
            >
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0 pr-8">
                  <div className="font-medium text-sm truncate">
                    {doc.name}
                  </div>
                  <div className="text-xs text-sidebar-foreground/60 mt-1">
                    {formatRelativeTime(doc.timestamp)}
                  </div>
                </div>
              </div>
            </button>

            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(doc.id)
                }}
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-sidebar-border">
        {onClearAll && history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => { onClearAll(); setIsOpen(false); }}
            className="w-full text-xs gap-2"
          >
            <Trash2 className="w-3 h-3" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile drawer trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden bg-card/80 backdrop-blur-sm border border-border"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:block border-r border-border bg-sidebar transition-all duration-300 flex-shrink-0 sticky top-0 h-screen",
          isCollapsed ? "w-12" : "w-64",
        )}
      >
        {!isCollapsed && <SidebarContent />}

        {isCollapsed && (
          <div className="h-full flex items-start p-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsCollapsed(false)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </aside>
    </>
  )
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}
