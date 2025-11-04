/**
 * Parses markdown into blocks with their original source preserved.
 * This allows us to map selections back to markdown source.
 */
export interface MarkdownBlock {
  type: string
  source: string // Original markdown
  startLine: number
  endLine: number
}

/**
 * Splits markdown content into semantic blocks (paragraphs, headings, code blocks, etc.)
 * while preserving the original markdown source for each block.
 */
export function parseMarkdownIntoBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.split('\n')
  const blocks: MarkdownBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Empty lines - skip
    if (line.trim() === '') {
      i++
      continue
    }

    // Code blocks (```)
    if (line.trim().startsWith('```')) {
      const startLine = i
      let endLine = i + 1

      // Find closing ```
      while (endLine < lines.length && !lines[endLine].trim().startsWith('```')) {
        endLine++
      }

      if (endLine < lines.length) {
        endLine++ // Include closing ```
      }

      blocks.push({
        type: 'code',
        source: lines.slice(startLine, endLine).join('\n'),
        startLine,
        endLine: endLine - 1,
      })

      i = endLine
      continue
    }

    // Math blocks ($$)
    if (line.trim().startsWith('$$')) {
      const startLine = i
      let endLine = i + 1

      // Find closing $$
      while (endLine < lines.length && !lines[endLine].trim().startsWith('$$')) {
        endLine++
      }

      if (endLine < lines.length) {
        endLine++ // Include closing $$
      }

      blocks.push({
        type: 'math',
        source: lines.slice(startLine, endLine).join('\n'),
        startLine,
        endLine: endLine - 1,
      })

      i = endLine
      continue
    }

    // Headings
    if (line.trim().match(/^#{1,6}\s/)) {
      blocks.push({
        type: 'heading',
        source: line,
        startLine: i,
        endLine: i,
      })
      i++
      continue
    }

    // Blockquotes
    if (line.trim().startsWith('>')) {
      const startLine = i
      let endLine = i

      // Continue while lines start with >
      while (endLine + 1 < lines.length && lines[endLine + 1].trim().startsWith('>')) {
        endLine++
      }

      blocks.push({
        type: 'blockquote',
        source: lines.slice(startLine, endLine + 1).join('\n'),
        startLine,
        endLine,
      })

      i = endLine + 1
      continue
    }

    // Lists
    if (line.trim().match(/^[-*+]\s/) || line.trim().match(/^\d+\.\s/)) {
      const startLine = i
      let endLine = i

      // Continue while lines are list items or indented
      while (endLine + 1 < lines.length) {
        const nextLine = lines[endLine + 1].trim()
        if (nextLine === '' || nextLine.match(/^[-*+]\s/) || nextLine.match(/^\d+\.\s/) || lines[endLine + 1].startsWith('  ')) {
          endLine++
        } else {
          break
        }
      }

      blocks.push({
        type: 'list',
        source: lines.slice(startLine, endLine + 1).join('\n'),
        startLine,
        endLine,
      })

      i = endLine + 1
      continue
    }

    // Tables (lines with |)
    if (line.includes('|')) {
      const startLine = i
      let endLine = i

      // Continue while lines contain |
      while (endLine + 1 < lines.length && lines[endLine + 1].includes('|')) {
        endLine++
      }

      blocks.push({
        type: 'table',
        source: lines.slice(startLine, endLine + 1).join('\n'),
        startLine,
        endLine,
      })

      i = endLine + 1
      continue
    }

    // Default: paragraph
    const startLine = i
    let endLine = i

    // Continue until empty line or special syntax
    while (endLine + 1 < lines.length) {
      const nextLine = lines[endLine + 1]
      if (nextLine.trim() === '' ||
          nextLine.trim().startsWith('#') ||
          nextLine.trim().startsWith('```') ||
          nextLine.trim().startsWith('$$') ||
          nextLine.trim().startsWith('>') ||
          nextLine.trim().match(/^[-*+]\s/) ||
          nextLine.trim().match(/^\d+\.\s/) ||
          nextLine.includes('|')) {
        break
      }
      endLine++
    }

    blocks.push({
      type: 'paragraph',
      source: lines.slice(startLine, endLine + 1).join('\n'),
      startLine,
      endLine,
    })

    i = endLine + 1
  }

  return blocks
}
