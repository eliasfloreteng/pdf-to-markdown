"use server"

import { Mistral } from "@mistralai/mistralai"
import type { ProcessedDocument, ImageItem } from "@/lib/types"

const apiKey = process.env.MISTRAL_API_KEY

if (!apiKey) {
  throw new Error("MISTRAL_API_KEY is not set in environment variables")
}

const client = new Mistral({ apiKey })

export async function convertDocumentToMarkdown(
  formData: FormData,
): Promise<ProcessedDocument> {
  try {
    const file = formData.get("file") as File
    if (!file) {
      throw new Error("No file provided")
    }

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Content = buffer.toString("base64")

    // Determine file type and create appropriate document object
    const isPdf = file.type === "application/pdf"
    const isImage = file.type.startsWith("image/")

    let documentUrl: string
    if (isPdf) {
      documentUrl = `data:application/pdf;base64,${base64Content}`
    } else if (isImage) {
      // Determine image MIME type
      const mimeType = file.type || "image/jpeg"
      documentUrl = `data:${mimeType};base64,${base64Content}`
    } else {
      throw new Error(`Unsupported file type: ${file.type}`)
    }

    // Call Mistral OCR API
    const ocrResponse = await client.ocr.process({
      model: "mistral-ocr-latest",
      document: isPdf
        ? {
            type: "document_url",
            documentUrl,
          }
        : {
            type: "image_url",
            imageUrl: documentUrl,
          },
      includeImageBase64: true,
    })

    // Process the response
    const pages = ocrResponse.pages || []

    // Combine all page markdown content
    const combinedMarkdown = pages
      .map((page) => {
        // Add page separator for multi-page documents
        const pageHeader =
          pages.length > 1 ? `\n\n---\n\n# Page ${page.index}\n\n` : ""
        return pageHeader + page.markdown
      })
      .join("\n\n")

    // Extract all images from all pages
    const extractedImages: ImageItem[] = []
    pages.forEach((page) => {
      if (page.images && page.images.length > 0) {
        page.images.forEach((img) => {
          if (img.imageBase64) {
            extractedImages.push({
              id: img.id,
              url: `data:image/jpeg;base64,${img.imageBase64}`,
              alt: `Extracted image ${img.id} from page ${page.index}`,
            })
          }
        })
      }
    })

    // Create processed document
    const processedDocument: ProcessedDocument = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      timestamp: new Date(),
      markdown: combinedMarkdown,
      images: extractedImages,
    }

    return processedDocument
  } catch (error) {
    console.error("Error converting document:", error)
    throw new Error(
      `Failed to convert document: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}
