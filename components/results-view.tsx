"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, FileArchive, Upload, Check } from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"
import { ImageGallery } from "./image-gallery"
import type { ProcessedDocument } from "@/lib/types"
import JSZip from "jszip"

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

  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip()

      // Add markdown file
      const baseFilename = document.name.replace(/\.[^/.]+$/, "")
      zip.file(`${baseFilename}.md`, document.markdown)

      // Add images at the same level as markdown (so references resolve)
      if (document.images.length > 0) {
        for (const image of document.images) {
          // Convert base64 data URL to blob
          const response = await fetch(image.url)
          const blob = await response.blob()

          // Use image ID as-is (already includes extension like "img-0.jpeg")
          zip.file(image.id, blob)
        }
      }

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" })

      // Download ZIP
      const url = URL.createObjectURL(zipBlob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `${baseFilename}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to create ZIP:", error)
      alert("Failed to create ZIP file. Please try again.")
    }
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
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Tabs defaultValue="document" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="document">Document</TabsTrigger>
              <TabsTrigger value="images">
                Images ({document.images.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="document" className="mt-6">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <MarkdownRenderer
                  content={document.markdown}
                  imageMap={document.imageMap}
                />
              </div>
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              {document.images.length > 0 ? (
                <ImageGallery images={document.images} />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No images extracted from this document
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
