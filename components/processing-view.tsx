"use client"

import { Loader2, FileText, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

interface ProcessingViewProps {
  files: File[]
}

export function ProcessingView({ files }: ProcessingViewProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    "Analyzing document structure",
    "Extracting text and images",
    "Processing mathematical equations",
    "Formatting markdown output",
  ]

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 2
      })
    }, 60)

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 750)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [])

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-4">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
          </div>

          <h2 className="text-2xl font-semibold text-foreground">
            Processing {files.length} {files.length === 1 ? "document" : "documents"}
          </h2>

          <p className="text-muted-foreground">Using Mistral AI to extract content with 99% accuracy</p>
        </div>

        <div className="space-y-4">
          <Progress value={progress} className="h-2" />

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="animate-pulse">{steps[currentStep]}</span>
          </div>
        </div>

        <div className="space-y-3">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-secondary-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">{file.name}</div>
                <div className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>

              <div className="flex-shrink-0">
                <Loader2 className="w-5 h-5 text-accent animate-spin" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
