import { Sparkles } from "lucide-react"

export function Hero() {
  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Mistral AI</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
          Transform Documents into Perfect Markdown
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
          State-of-the-art OCR with 99% accuracy. Convert PDFs and images to
          markdown with flawless handling of math, tables, figures, and 100+
          languages.
        </p>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Multi-language</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Math & Tables</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>LLM-Ready</span>
          </div>
        </div>
      </div>
    </div>
  )
}
