"use client"

import { useState } from "react"
import { Hero } from "./hero"
import { UploadZone } from "./upload-zone"
import { ProcessingView } from "./processing-view"
import { ResultsView } from "./results-view"
import { HistorySidebar } from "./history-sidebar"
import type { ProcessedDocument } from "@/lib/types"

export function ConverterPage() {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([])
  const [processingFiles, setProcessingFiles] = useState<File[]>([])
  const [selectedDocument, setSelectedDocument] =
    useState<ProcessedDocument | null>(null)
  const [history, setHistory] = useState<ProcessedDocument[]>([])

  const handleFilesSelected = async (files: File[]) => {
    setProcessingFiles(files)

    // Mock processing with delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const processed: ProcessedDocument[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      timestamp: new Date(),
      markdown: generateMockMarkdown(file.name),
      images: generateMockImages(),
    }))

    setDocuments(processed)
    setHistory((prev) => [...processed, ...prev])
    setProcessingFiles([])

    if (processed.length === 1) {
      setSelectedDocument(processed[0])
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

function generateMockMarkdown(filename: string): string {
  return `# ${filename.replace(/\.[^/.]+$/, "")}

## Introduction

This document demonstrates the **state-of-the-art OCR capabilities** powered by Mistral AI. The system achieves 99% accuracy across multiple languages and handles complex elements seamlessly.

### Mathematical Equations

The quadratic formula is given by:

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

For inline math, we can write $$E = mc^2$$ directly in the text.

## Tables

| Feature | Accuracy | Languages |
|---------|----------|-----------|
| Text Recognition | 99% | 100+ |
| Math Equations | 98% | Universal |
| Table Extraction | 97% | N/A |

## Code Blocks

\`\`\`python
def process_document(file_path):
    """Process a document using Mistral AI OCR"""
    result = mistral_ocr.convert(file_path)
    return result.markdown
\`\`\`

## Images

![Sample Figure](/placeholder.svg?height=300&width=500&query=scientific+diagram)

The figure above demonstrates the extraction quality for complex diagrams.

## Lists

1. **High Accuracy**: 99% recognition rate
2. **Multi-language**: Support for 100+ languages
3. **Complex Elements**: Tables, equations, figures
4. **Fast Processing**: Results in seconds

### Bullet Points

- Seamless PDF processing
- Image format support
- Batch conversion
- Export options (Markdown, ZIP)

## Conclusion

This technology represents a significant advancement in document digitization, making it perfect for LLM ingestion and knowledge management systems.`
}

function generateMockImages() {
  return [
    {
      id: "1",
      url: "/scientific-diagram.jpg",
      alt: "Scientific diagram extracted from document",
    },
    {
      id: "2",
      url: "/data-visualization-chart.png",
      alt: "Data visualization chart",
    },
  ]
}
