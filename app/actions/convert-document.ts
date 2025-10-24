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

    // Create a map of image IDs to their base64 data URLs
    const imageMap = new Map<string, string>()
    const extractedImages: ImageItem[] = []

    pages.forEach((page) => {
      if (page.images && page.images.length > 0) {
        page.images.forEach((img) => {
          if (img.imageBase64) {
            // The imageBase64 already includes the data URL prefix
            const imageUrl = img.imageBase64
            imageMap.set(img.id, imageUrl)
            extractedImages.push({
              id: img.id,
              url: imageUrl,
              alt: `Extracted image ${img.id} from page ${page.index}`,
            })
          }
        })
      }
    })

    // Combine all page markdown content and replace image references
    const combinedMarkdown = pages.map((page) => page.markdown).join("\n")

    // Convert imageMap to plain object for serialization
    const imageMapObject: Record<string, string> = {}
    imageMap.forEach((url, id) => {
      imageMapObject[id] = url
    })

    // Create processed document
    const processedDocument: ProcessedDocument = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      timestamp: new Date(),
      markdown: combinedMarkdown,
      images: extractedImages,
      imageMap: imageMapObject,
    }

    return processedDocument
  } catch (error) {
    console.error("Error converting document:", error)
    throw new Error(
      `Failed to convert document: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}
