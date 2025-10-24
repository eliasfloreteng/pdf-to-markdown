# PDF to Markdown Converter

A modern web application that converts PDF documents and images to Markdown using Mistral AI's state-of-the-art OCR technology.

## Features

- 🚀 **High-Accuracy OCR**: Powered by Mistral AI's OCR model with 99% accuracy
- 📄 **PDF Support**: Convert multi-page PDF documents to structured Markdown
- 🖼️ **Image Support**: Process images (PNG, JPEG, etc.) with OCR
- 🔢 **Math Equations**: Automatically extracts and renders LaTeX mathematical expressions with KaTeX
- 📊 **Tables & Figures**: Preserves complex layouts including tables and embedded images
- 🌍 **Multilingual**: Supports 100+ languages
- 📦 **Batch Processing**: Convert multiple documents at once
- 💾 **History**: Keep track of previously processed documents
- 🎨 **Modern UI**: Clean, responsive interface with dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Mistral AI API key (get one at [console.mistral.ai](https://console.mistral.ai/))

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pdf-to-markdown
```

2. Install dependencies:

```bash
bun install
# or
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

4. Add your Mistral AI API key to `.env.local`:

```env
MISTRAL_API_KEY=your_mistral_api_key_here
```

### Running the Development Server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Upload Documents**: Drag and drop or click to select PDF files or images
2. **Processing**: The application will automatically process your documents using Mistral OCR
3. **View Results**: See the extracted Markdown with properly formatted text, tables, and math equations
4. **Download**: Export the Markdown or view extracted images
5. **History**: Access previously processed documents from the sidebar

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **OCR**: Mistral AI OCR API
- **Math Rendering**: KaTeX
- **Markdown**: react-markdown with remark-math and rehype-katex
- **UI Components**: Radix UI
- **Package Manager**: Bun

## API Integration

This application uses Mistral AI's OCR API to convert documents:

- **PDF Processing**: Documents are converted to base64 and sent as `document_url` type
- **Image Processing**: Images are converted to base64 data URLs and sent as `image_url` type
- **Image Extraction**: Embedded images from PDFs are extracted and displayed
- **Server Actions**: All API calls are made server-side to keep API keys secure

## Features in Detail

### Mathematical Equations

The application automatically detects and renders mathematical expressions using KaTeX:

- Inline math: `$E = mc^2$`
- Block math: `$$\int_0^\infty e^{-x^2} dx$$`

### Multi-Page PDFs

Multi-page PDFs are processed with:

- Page separators in the output
- Combined markdown from all pages
- Page-specific image extraction

### Error Handling

- Individual file error handling for batch processing
- User-friendly error messages via toast notifications
- Detailed error logging for debugging

## Learn More

- [Mistral AI OCR Documentation](https://docs.mistral.ai/capabilities/document_ai/basic_ocr)
- [Next.js Documentation](https://nextjs.org/docs)
- [KaTeX Documentation](https://katex.org/)

## License

This project is open source and available under the MIT License.
