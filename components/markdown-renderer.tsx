"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkBreaks from "remark-breaks"
import rehypeKatex from "rehype-katex"
import { ImageWithActions } from "./image-with-actions"
import "katex/dist/katex.min.css"

interface MarkdownRendererProps {
  content: string
  imageMap?: Record<string, string>
}

export function MarkdownRenderer({
  content,
  imageMap = {},
}: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold text-foreground mt-8 mb-4 text-balance">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold text-foreground mt-6 mb-3 text-balance">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-foreground leading-relaxed mb-4 text-pretty">
            {children}
          </p>
        ),
        code: ({ inline, className, children, ...props }: any) => {
          if (inline) {
            return (
              <code
                className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            )
          }
          return (
            <code
              className={`${className} block p-4 rounded-lg bg-muted text-foreground font-mono text-sm overflow-x-auto`}
              {...props}
            >
              {children}
            </code>
          )
        },
        table: ({ children }) => (
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse border border-border">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-border bg-muted px-4 py-2 text-left font-semibold text-foreground">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border px-4 py-2 text-foreground">
            {children}
          </td>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-2 mb-4 text-foreground">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-2 mb-4 text-foreground">
            {children}
          </ol>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground my-4">
            {children}
          </blockquote>
        ),
        img: ({ src, alt }) => {
          // If src matches an image ID in the imageMap, use the base64 data URL
          const srcString = typeof src === "string" ? src : ""
          const imageSrc =
            srcString && imageMap[srcString] ? imageMap[srcString] : srcString
          const altString = typeof alt === "string" ? alt : ""

          return (
            <ImageWithActions
              src={imageSrc || "/placeholder.svg"}
              alt={altString}
              className="rounded-lg max-w-full h-auto my-6"
            />
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
