import { Sparkles, Github, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 md:py-16 text-center">
        <a
          href="https://mistral.ai/news/mistral-ocr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-xs sm:text-sm font-medium mb-4 sm:mb-6 hover:bg-accent/30 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Powered by Mistral OCR</span>
          <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </a>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4 text-balance px-2">
          Transform Documents into Perfect Markdown
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed mb-3 sm:mb-4 px-2">
          State-of-the-art OCR with 99% accuracy. Convert PDFs and images to
          markdown with flawless handling of math, tables, figures, and 100+
          languages.
        </p>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
          Built on Mistral AI's groundbreaking OCR technology that processes
          2000 pages/min with 94.89% overall accuracy. Perfect for digitizing
          scientific research, preserving heritage documents, and making any PDF
          AI-ready.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
          <Button variant="outline" size="sm" asChild className="gap-2 w-full sm:w-auto">
            <a
              href="https://github.com/eliasfloreteng/pdf-to-markdown"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild className="gap-2 w-full sm:w-auto">
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

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground px-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent" />
            <span>100+ Languages</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent" />
            <span>Math & Tables</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent" />
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </div>
  )
}
