import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ResultCard from "@/components/ResultCard";
import Navbar from "@/components/Navbar";

const TextAnalysis = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{
    prediction: string;
    uncertainty: string;
    reasons: string[];
  } | null>(null);

  const analyzeText = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    let prediction = "";
    let uncertainty = "";
    let reasons: string[] = [];

    if (trimmed.length < 50) {
      prediction = "Uncertain";
      uncertainty = "Uncertainty: 60%";
      reasons = [
        "Text length is too short for reliable analysis",
        "Insufficient contextual information available",
        "Source credibility cannot be determined",
      ];
    } else if (
      trimmed.toLowerCase().includes("shocking") ||
      trimmed.toLowerCase().includes("breaking") ||
      trimmed.toLowerCase().includes("click here")
    ) {
      prediction = "Fake News";
      uncertainty = "Uncertainty: 15%";
    } else {
      prediction = "True News";
      uncertainty = "Uncertainty: 20%";
    }

    setResult({ prediction, uncertainty, reasons });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
            Text Analysis
          </h1>
          <p className="text-muted-foreground">
            Paste any news article or claim to analyze its authenticity.
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste news text here..."
            className="min-h-[200px] bg-card border-border font-mono text-sm resize-none focus-visible:ring-primary"
          />

          <Button
            onClick={analyzeText}
            disabled={!text.trim()}
            className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold"
          >
            <Search className="h-4 w-4" />
            Analyze Text
          </Button>
        </div>

        {result && (
          <div className="mt-8">
            <ResultCard {...result} />
          </div>
        )}
      </main>
    </div>
  );
};

export default TextAnalysis;
