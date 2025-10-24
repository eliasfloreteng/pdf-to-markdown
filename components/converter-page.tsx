"use client"

import { useState } from "react"
import { Hero } from "./hero"
import { UploadZone } from "./upload-zone"
import { ProcessingView } from "./processing-view"
import { ResultsView } from "./results-view"
import { HistorySidebar } from "./history-sidebar"
import type { ProcessedDocument } from "@/lib/types"
import { convertDocumentToMarkdown } from "@/app/actions/convert-document"
import { toast } from "sonner"

export function ConverterPage() {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([])
  const [processingFiles, setProcessingFiles] = useState<File[]>([])
  const [selectedDocument, setSelectedDocument] =
    useState<ProcessedDocument | null>(null)
  const [history, setHistory] = useState<ProcessedDocument[]>([])

  const handleFilesSelected = async (files: File[]) => {
    setProcessingFiles(files)

    try {
      const processed: ProcessedDocument[] = []

      // Process each file
      for (const file of files) {
        try {
          const formData = new FormData()
          formData.append("file", file)

          const result = await convertDocumentToMarkdown(formData)
          processed.push(result)
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error)
          toast.error(`Failed to process ${file.name}`, {
            description:
              error instanceof Error ? error.message : "Unknown error",
          })
        }
      }

      if (processed.length > 0) {
        setDocuments(processed)
        setHistory((prev) => [...processed, ...prev])

        if (processed.length === 1) {
          setSelectedDocument(processed[0])
        }

        toast.success(
          `Successfully processed ${processed.length} document${processed.length > 1 ? "s" : ""}`,
        )
      }
    } catch (error) {
      console.error("Error processing files:", error)
      toast.error("Failed to process documents")
    } finally {
      setProcessingFiles([])
    }
  }

  const handleDocumentSelect = (doc: ProcessedDocument) => {
    setSelectedDocument(doc)
  }

  const handleNewUpload = () => {
    setDocuments([])
    setSelectedDocument(null)
    setProcessingFiles([])
  }

  return (
    <div className="min-h-screen flex">
      <HistorySidebar
        history={history}
        onSelect={handleDocumentSelect}
        selectedId={selectedDocument?.id}
      />

      <main className="flex-1 flex flex-col">
        {!selectedDocument &&
          documents.length === 0 &&
          processingFiles.length === 0 && (
            <>
              <Hero />
              <div className="flex-1 flex items-center justify-center px-4 pb-16">
                <UploadZone onFilesSelected={handleFilesSelected} />
              </div>
            </>
          )}

        {processingFiles.length > 0 && (
          <ProcessingView files={processingFiles} />
        )}

        {selectedDocument && (
          <ResultsView
            document={selectedDocument}
            onNewUpload={handleNewUpload}
          />
        )}

        {documents.length > 1 &&
          !selectedDocument &&
          processingFiles.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  {documents.length} documents processed
                </h2>
                <p className="text-muted-foreground">
                  Select a document from the list to view results
                </p>
                <div className="grid gap-3 mt-6 max-w-2xl">
                  {documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => handleDocumentSelect(doc)}
                      className="p-4 border border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors text-left"
                    >
                      <div className="font-medium text-foreground">
                        {doc.name}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {doc.timestamp.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
      </main>
    </div>
  )
}
