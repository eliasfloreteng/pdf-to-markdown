import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import type { Root, Content } from "mdast"

/**
 * Represents a block of markdown with its original source preserved.
 * This allows us to map selections back to markdown source.
 */
export interface MarkdownBlock {
  type: string
  source: string // Original markdown
  position: {
    start: { line: number; column: number; offset: number }
    end: { line: number; column: number; offset: number }
  }
}

/**
 * Splits markdown content into semantic blocks using remark parser.
 * Preserves the original markdown source for each block.
 */
export function parseMarkdownIntoBlocks(markdown: string): MarkdownBlock[] {
  // Parse markdown into AST
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)

  const ast = processor.parse(markdown)
  const blocks: MarkdownBlock[] = []

  // Extract each top-level node as a block
  if (ast.type === "root") {
    const root = ast as Root

    root.children.forEach((node: Content) => {
      if (!node.position) return

      // Extract the source text for this node
      const { start, end } = node.position
      const source = markdown.substring(start.offset ?? 0, end.offset ?? 0)

      blocks.push({
        type: node.type,
        source,
        position: {
          start: {
            line: start.line,
            column: start.column,
            offset: start.offset ?? 0,
          },
          end: {
            line: end.line,
            column: end.column,
            offset: end.offset ?? 0,
          },
        },
      })
    })
  }

  return blocks
}
