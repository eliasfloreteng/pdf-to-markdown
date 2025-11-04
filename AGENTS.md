# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PDF to Markdown Converter - A Next.js application that converts PDF documents and images to Markdown using Mistral AI's OCR API. The application features client-side document history storage via IndexedDB and renders extracted content with mathematical equations, tables, and embedded images.

## Common Commands

**Development:**

```bash
bun dev          # Start development server on http://localhost:3000
npm run dev      # Alternative with npm
```

**Build & Deploy:**

```bash
bun run build    # Production build
bun start        # Start production server
```

**Code Quality:**

```bash
bun run lint     # Run ESLint
```

## Architecture

### Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Runtime:** Bun (can also use npm/node)
- **OCR:** Mistral AI OCR API
- **State Management:** React hooks with local state
- **Storage:** Browser IndexedDB for document history
- **Math Rendering:** KaTeX via rehype-katex
- **Markdown:** react-markdown with remark-gfm, remark-math, remark-breaks

### Key Configuration

- **Server Actions:** Body size limit set to 200mb in `next.config.ts` to handle large PDFs
- **React Compiler:** Enabled for performance optimization
- **Environment:** Requires `MISTRAL_API_KEY` in `.env.local`

### Application Flow

1. **Document Upload** (`components/upload-zone.tsx`):
   - Accepts PDF and image files via drag-and-drop or file picker
   - Batch processing support for multiple files

2. **OCR Processing** (`app/actions/convert-document.ts`):
   - Server action that interfaces with Mistral OCR API
   - Converts files to base64 for API transmission
   - PDFs sent as `document_url` type, images as `image_url` type
   - Extracts embedded images with `includeImageBase64: true`
   - Returns `ProcessedDocument` with markdown, images, and metadata

3. **Storage Layer** (`lib/storage.ts`):
   - IndexedDB wrapper for persisting documents client-side
   - Functions: `saveDocument`, `getAllDocuments`, `getDocument`, `deleteDocument`, `clearAllDocuments`
   - Documents stored with id, name, timestamp, markdown, images, imageMap, pageCount, fileSize

4. **State Management** (`components/converter-page.tsx`):
   - Main orchestrator component handling upload → processing → results flow
   - Manages history sidebar, document selection, and view transitions
   - Loads persisted documents from IndexedDB on mount
   - Toast notifications for user feedback

5. **Markdown Rendering** (`components/markdown-renderer.tsx`):
   - Custom ReactMarkdown component with styled elements
   - Math equations via remark-math + rehype-katex
   - Image references resolved through `imageMap` (maps image IDs to base64 data URLs)
   - Tables, code blocks, and GFM features supported

### Data Types (`lib/types.ts`)

```typescript
ProcessedDocument {
  id: string              // Unique identifier
  name: string            // Original filename
  timestamp: Date         // Processing time
  markdown: string        // Combined markdown from all pages
  images: ImageItem[]     // Extracted images
  imageMap?: Record<string, string>  // Image ID → base64 URL mapping
  pageCount?: number      // Number of pages (PDFs)
  fileSize?: number       // Original file size in bytes
}
```

### Component Structure

- `app/page.tsx`: Entry point, renders `ConverterPage`
- `components/converter-page.tsx`: Main state container and view router
- `components/hero.tsx`: Landing hero section
- `components/upload-zone.tsx`: File input interface
- `components/processing-view.tsx`: Loading state during OCR
- `components/results-view.tsx`: Displays converted markdown and images
- `components/markdown-renderer.tsx`: Markdown rendering with custom styling
- `components/history-sidebar.tsx`: Document history navigation
- `components/image-gallery.tsx`: Grid view of extracted images
- `components/image-with-actions.tsx`: Image viewer with copy/download actions
- `components/ui/*`: shadcn/ui component library

### Image Handling

The application extracts images from PDFs via the Mistral API:

- Images returned with unique IDs and base64 data
- `imageMap` created to resolve markdown image references `![](image-id)` to actual base64 URLs
- Custom img component in markdown renderer handles this mapping
- Extracted images displayed separately in image gallery

### Important Notes

- All OCR processing happens server-side via Next.js Server Actions to protect the API key
- Documents are stored entirely client-side in IndexedDB (nothing persisted on server)
- Multi-page PDFs processed as single API call, pages combined with markdown separators
- Mathematical expressions automatically detected and rendered with KaTeX
- Base64 encoding used for both file upload and image extraction to avoid file system operations
