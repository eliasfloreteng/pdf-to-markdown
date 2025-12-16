import { unified } from "unified"
import remarkParse from "remark-parse"
import { visit } from "unist-util-visit"
import type { Heading } from "mdast"

export interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * Generate a URL-friendly slug from heading text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
}

/**
 * Extract headings from markdown content to generate a table of contents
 */
export function extractHeadings(markdown: string): TocItem[] {
  const headings: TocItem[] = []
  const slugCounts = new Map<string, number>()

  const tree = unified().use(remarkParse).parse(markdown)

  visit(tree, "heading", (node: Heading) => {
    // Extract text content from heading
    let text = ""
    visit(node, "text", (textNode: any) => {
      text += textNode.value
    })

    if (text) {
      // Generate unique slug
      let baseSlug = slugify(text)
      const count = slugCounts.get(baseSlug) || 0
      slugCounts.set(baseSlug, count + 1)

      const id = count > 0 ? `${baseSlug}-${count}` : baseSlug

      headings.push({
        id,
        text,
        level: node.depth,
      })
    }
  })

  return headings
}
