"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Copy, Download, FileArchive, Upload, Check } from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"
import { ImageGallery } from "./image-gallery"
import { useCopyMarkdown } from "@/lib/copy-markdown-context"
import type { ProcessedDocument } from "@/lib/types"
import JSZip from "jszip"

interface ResultsViewProps {
  document: ProcessedDocument
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

export function ResultsView({ document }: ResultsViewProps) {
  const [copied, setCopied] = useState(false)
  const { enabled, setEnabled } = useCopyMarkdown()

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

  const [activeTab, setActiveTab] = useState<"document" | "images">("document")

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "document" | "images")} className="flex-1 flex flex-col">
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground truncate">
                {document.name}
              </h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>Processed {document.timestamp.toLocaleString()}</span>
                {document.pageCount && (
                  <>
                    <span>•</span>
                    <span>
                      {document.pageCount}{" "}
                      {document.pageCount === 1 ? "page" : "pages"}
                    </span>
                  </>
                )}
                {document.fileSize && (
                  <>
                    <span>•</span>
                    <span>{formatFileSize(document.fileSize)}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleCopyMarkdown} className="gap-2">
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
                Download
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
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <TabsList className="grid max-w-md grid-cols-2">
              <TabsTrigger value="document">
                Document
              </TabsTrigger>
              <TabsTrigger value="images">
                Images ({document.images.length})
              </TabsTrigger>
            </TabsList>

            {activeTab === "document" && (
              <div className="flex items-center gap-2">
                <Label htmlFor="copy-markdown-toggle" className="text-sm text-muted-foreground cursor-pointer">
                  Copy as Markdown
                </Label>
                <Switch
                  id="copy-markdown-toggle"
                  checked={enabled}
                  onCheckedChange={setEnabled}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <TabsContent value="document" className="mt-0">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <MarkdownRenderer
                content={document.markdown}
                imageMap={document.imageMap}
              />
            </div>
          </TabsContent>

          <TabsContent value="images" className="mt-0">
            {document.images.length > 0 ? (
              <ImageGallery images={document.images} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No images extracted from this document
              </div>
            )}
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}
