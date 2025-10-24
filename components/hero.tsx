import { Sparkles, Github, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 text-center">
        <a
          href="https://mistral.ai/news/mistral-ocr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-6 hover:bg-accent/30 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>Powered by Mistral OCR</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
          Transform Documents into Perfect Markdown
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed mb-4">
          State-of-the-art OCR with 99% accuracy. Convert PDFs and images to
          markdown with flawless handling of math, tables, figures, and 100+
          languages.
        </p>

        <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-8">
          Built on Mistral AI's groundbreaking OCR technology that processes
          2000 pages/min with 94.89% overall accuracy. Perfect for digitizing
          scientific research, preserving heritage documents, and making any PDF
          AI-ready.
        </p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild className="gap-2">
            <a
              href="https://github.com/eliasfloreteng/pdf-to-markdown"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild className="gap-2">
            <a
              href="https://mistral.ai/news/mistral-ocr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              About Mistral OCR
            </a>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>100+ Languages</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Math & Tables</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </div>
  )
}
