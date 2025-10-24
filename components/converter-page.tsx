"use client"

import { useState, useEffect } from "react"
import { Hero } from "./hero"
import { UploadZone } from "./upload-zone"
import { ProcessingView } from "./processing-view"
import { ResultsView } from "./results-view"
import { HistorySidebar } from "./history-sidebar"
import type { ProcessedDocument } from "@/lib/types"
import { convertDocumentToMarkdown } from "@/app/actions/convert-document"
import { toast } from "sonner"
import { getAllDocuments, saveDocument, deleteDocument } from "@/lib/storage"

export function ConverterPage() {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([])
  const [processingFiles, setProcessingFiles] = useState<File[]>([])
  const [selectedDocument, setSelectedDocument] =
    useState<ProcessedDocument | null>(null)
  const [history, setHistory] = useState<ProcessedDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load persisted documents on mount
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const savedDocuments = await getAllDocuments()
        if (savedDocuments.length > 0) {
          // Convert timestamp strings back to Date objects
          const documentsWithDates = savedDocuments.map((doc) => ({
            ...doc,
            timestamp: new Date(doc.timestamp),
          }))
          setHistory(documentsWithDates)
        }
      } catch (error) {
        console.error("Failed to load documents from storage:", error)
        toast.error("Failed to load saved documents")
      } finally {
        setIsLoading(false)
      }
    }

    loadDocuments()
  }, [])

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

        // Save each document to IndexedDB
        for (const doc of processed) {
          try {
            await saveDocument(doc)
          } catch (error) {
            console.error("Failed to save document to storage:", error)
            toast.error(`Failed to save ${doc.name} to storage`)
          }
        }

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

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id)
      setHistory((prev) => prev.filter((doc) => doc.id !== id))

      // If the deleted document was selected, clear selection
      if (selectedDocument?.id === id) {
        setSelectedDocument(null)
      }

      toast.success("Document deleted")
    } catch (error) {
      console.error("Failed to delete document:", error)
      toast.error("Failed to delete document")
    }
  }

  const handleClearAll = async () => {
    try {
      const { clearAllDocuments } = await import("@/lib/storage")
      await clearAllDocuments()
      setHistory([])
      setSelectedDocument(null)
      setDocuments([])
      toast.success("All documents cleared")
    } catch (error) {
      console.error("Failed to clear documents:", error)
      toast.error("Failed to clear documents")
    }
  }

  return (
    <div className="min-h-screen flex">
      <HistorySidebar
        history={history}
        onSelect={handleDocumentSelect}
        selectedId={selectedDocument?.id}
        onDelete={handleDeleteDocument}
        onClearAll={handleClearAll}
        onNewUpload={handleNewUpload}
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

        {selectedDocument && <ResultsView document={selectedDocument} />}

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
