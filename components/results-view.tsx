"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Download, FileArchive, Upload, Check } from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"
import { ImageGallery } from "./image-gallery"
import type { ProcessedDocument } from "@/lib/types"

interface ResultsViewProps {
  document: ProcessedDocument
  onNewUpload: () => void
}

export function ResultsView({ document, onNewUpload }: ResultsViewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyMarkdown = async () => {
    await navigator.clipboard.writeText(document.markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadMarkdown = () => {
    const blob = new Blob([document.markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement("a")
    a.href = url
    a.download = `${document.name.replace(/\.[^/.]+$/, "")}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadZip = () => {
    // Mock ZIP download
    alert("ZIP download would include markdown file and all extracted images")
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {document.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Processed {document.timestamp.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyMarkdown}
              className="gap-2 bg-transparent"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadMarkdown}
              className="gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              Markdown
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadZip}
              className="gap-2 bg-transparent"
            >
              <FileArchive className="w-4 h-4" />
              ZIP
            </Button>

            <Button size="sm" onClick={onNewUpload} className="gap-2">
              <Upload className="w-4 h-4" />
              New
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MarkdownRenderer content={document.markdown} />
          </div>

          {document.images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Extracted Images ({document.images.length})
              </h3>
              <ImageGallery images={document.images} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
