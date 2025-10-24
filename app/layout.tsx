import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
// import { Analytics } from '@vercel/analytics/next'
import "./globals.css"
import { Toaster } from "sonner"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PDF to Markdown",
  description:
    "Transform Documents into Perfect Markdown. State-of-the-art OCR with 99% accuracy. Convert PDFs and images to markdown with flawless handling of math, tables, figures, and 100+ languages.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        {/* <Analytics /> */}
        <Toaster />
      </body>
    </html>
  )
}
