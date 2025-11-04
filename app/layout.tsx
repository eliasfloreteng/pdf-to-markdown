import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { CopyMarkdownProvider } from "@/lib/copy-markdown-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: "PDF to Markdown | Mistral OCR - Convert PDFs & Images to Markdown",
  description:
    "Transform Documents into Perfect Markdown. State-of-the-art OCR with 99% accuracy powered by Mistral AI. Convert PDFs and images to markdown with flawless handling of math, tables, figures, and 100+ languages. Free, open-source, and AI-ready.",
  keywords: [
    "PDF to Markdown",
    "OCR",
    "Mistral OCR",
    "document conversion",
    "PDF converter",
    "image to markdown",
    "mathematical equations",
    "multilingual OCR",
    "document understanding",
    "AI document processing",
    "scientific papers",
    "LaTeX conversion",
    "open source",
  ],
  authors: [
    { name: "Elias Floreteng", url: "https://github.com/eliasfloreteng" },
  ],
  creator: "Elias Floreteng",
  publisher: "Elias Floreteng",
  metadataBase: new URL("https://pdf2mdown.vercel.app"),
  openGraph: {
    title: "PDF to Markdown | Mistral OCR",
    description:
      "State-of-the-art OCR with 99% accuracy. Convert PDFs and images to markdown with flawless handling of math, tables, figures, and 100+ languages.",
    url: "https://pdf2mdown.vercel.app",
    siteName: "PDF to Markdown",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Markdown | Mistral OCR",
    description:
      "Transform documents into perfect markdown with 99% accuracy. Powered by Mistral AI.",
    creator: "@eliasfloreteng",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <CopyMarkdownProvider>
          {children}
          <Analytics />
          <Toaster />
        </CopyMarkdownProvider>
      </body>
    </html>
  )
}
