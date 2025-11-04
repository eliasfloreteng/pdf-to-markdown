"use client"
import { useRef, useMemo, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkBreaks from "remark-breaks"
import rehypeKatex from "rehype-katex"
import { ImageWithActions } from "./image-with-actions"
import { parseMarkdownIntoBlocks } from "@/lib/markdown-blocks"
import { useCopyMarkdown } from "@/lib/copy-markdown-context"
import { useShowImages } from "@/lib/show-images-context"
import "katex/dist/katex.min.css"

interface MarkdownRendererProps {
  content: string
  imageMap?: Record<string, string>
}

export function MarkdownRenderer({
  content,
  imageMap = {},
}: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { enabled } = useCopyMarkdown()
  const { enabled: showImages } = useShowImages()

  // Parse markdown into blocks with original source
  const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content])

  // Set up copy event handler
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleCopy = (e: ClipboardEvent) => {
      // Only intercept if feature is enabled
      if (!enabled) return

      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      // Get all selected elements with data-markdown attribute
      const range = selection.getRangeAt(0)
      const startContainer = range.startContainer
      const endContainer = range.endContainer

      // Find all markdown blocks within the selection
      const markdownBlocks = new Set<string>()

      // Helper to collect markdown from an element and its parents
      const collectMarkdown = (node: Node) => {
        let element = node.nodeType === Node.ELEMENT_NODE
          ? node as Element
          : node.parentElement

        while (element && element !== container) {
          if (element.hasAttribute('data-markdown')) {
            const markdown = element.getAttribute('data-markdown')
            if (markdown) {
              markdownBlocks.add(markdown)
            }
            break // Found the block, no need to go further up
          }
          element = element.parentElement
        }
      }

      // Collect from start and end
      collectMarkdown(startContainer)
      if (endContainer !== startContainer) {
        collectMarkdown(endContainer)
      }

      // If selection spans multiple blocks, find all blocks in between
      const allBlockElements = container.querySelectorAll('[data-markdown]')
      let collectingBlocks = false

      allBlockElements.forEach((el) => {
        if (el.contains(startContainer) || el === startContainer.parentElement) {
          collectingBlocks = true
        }

        if (collectingBlocks && el.hasAttribute('data-markdown')) {
          const markdown = el.getAttribute('data-markdown')
          if (markdown) {
            markdownBlocks.add(markdown)
          }
        }

        if (el.contains(endContainer) || el === endContainer.parentElement) {
          collectingBlocks = false
        }
      })

      // If we found markdown source, use it
      if (markdownBlocks.size > 0) {
        e.preventDefault()
        e.clipboardData?.setData('text/plain', Array.from(markdownBlocks).join('\n\n'))
      }
    }

    container.addEventListener('copy', handleCopy)
    return () => container.removeEventListener('copy', handleCopy)
  }, [enabled])

  return (
    <div ref={containerRef} className="min-w-0">
      {blocks.map((block, index) => (
        <div key={index} data-markdown={block.source} className="min-w-0">
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
          // If images are disabled, don't render them
          if (!showImages) {
            return null
          }

          // If src matches an image ID in the imageMap, use the base64 data URL
          const srcString = typeof src === "string" ? src : ""
          const imageSrc =
            srcString && imageMap[srcString] ? imageMap[srcString] : srcString
          const altString = typeof alt === "string" ? alt : ""

          return (
            <div className="w-full max-w-full my-6">
              <ImageWithActions
                src={imageSrc || "/placeholder.svg"}
                alt={altString}
                className="rounded-lg max-w-full w-full h-auto"
              />
            </div>
          )
        },
          }}
          >
            {block.source}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  )
}
