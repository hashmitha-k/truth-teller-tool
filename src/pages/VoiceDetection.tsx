import { useState, useRef, useCallback } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResultCard from "@/components/ResultCard";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LANGUAGES = [
  { code: "", label: "Auto-detect" },
  { code: "en-US", label: "English" },
  { code: "es-ES", label: "Spanish" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "hi-IN", label: "Hindi" },
  { code: "ar-SA", label: "Arabic" },
  { code: "zh-CN", label: "Chinese" },
  { code: "ja-JP", label: "Japanese" },
  { code: "ko-KR", label: "Korean" },
  { code: "pt-BR", label: "Portuguese" },
  { code: "ru-RU", label: "Russian" },
  { code: "it-IT", label: "Italian" },
  { code: "tr-TR", label: "Turkish" },
  { code: "nl-NL", label: "Dutch" },
  { code: "pl-PL", label: "Polish" },
  { code: "ta-IN", label: "Tamil" },
  { code: "te-IN", label: "Telugu" },
  { code: "bn-IN", label: "Bengali" },
  { code: "ur-PK", label: "Urdu" },
];

const VoiceDetection = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [selectedLang, setSelectedLang] = useState("en-US");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    prediction: string;
    uncertainty: string;
    reasons: string[];
  } | null>(null);
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const startRecording = useCallback(() => {
    setError("");
    setResult(null);

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setError(
        "Speech recognition is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    // Request microphone permission first
    navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
      const recognition = new SpeechRecognitionAPI() as SpeechRecognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang || "en-US";

      let finalTranscript = "";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += t + " ";
          } else {
            interim = t;
          }
        }
        setTranscript(finalTranscript + interim);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setError("Microphone access denied. Please allow microphone access in your browser settings.");
        } else if (event.error === "no-speech") {
          setError("No speech detected. Please try speaking louder or closer to the microphone.");
        } else if (event.error !== "aborted") {
          setError(`Speech recognition error: ${event.error}. Try selecting a specific language instead of auto-detect.`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      setTranscript("");
    }).catch((err) => {
      console.error("Microphone access error:", err);
      setError("Microphone access denied. Please allow microphone access and try again.");
    });
  }, [selectedLang]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const analyzeVoice = async () => {
    const trimmed = transcript.trim();
    if (!trimmed) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-news", {
        body: { text: trimmed, type: "voice" },
      });

      if (fnError) throw fnError;

      if (data?.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
        return;
      }

      setResult({
        prediction: data.prediction || "Uncertain",
        uncertainty: `Confidence: ${data.confidence || 50}%`,
        reasons: data.reasons || [],
      });
    } catch (e) {
      console.error("Analysis failed:", e);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze voice input. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
            Voice Detection
          </h1>
          <p className="text-muted-foreground">
            Speak in any language — we'll transcribe and analyze it for
            misinformation using AI.
          </p>
        </div>

        {/* Language selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Language
          </label>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            disabled={isRecording}
            className="w-full sm:w-64 h-10 rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Recording controls */}
        <div className="flex flex-col items-center gap-6 p-8 rounded-xl bg-card border border-border">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`relative p-6 rounded-full transition-all duration-300 ${
              isRecording
                ? "bg-destructive/15 text-destructive shadow-[0_0_40px_hsl(var(--destructive)/0.2)]"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {isRecording && (
              <span className="absolute inset-0 rounded-full animate-ping bg-destructive/20" />
            )}
            {isRecording ? (
              <MicOff className="h-8 w-8 relative z-10" />
            ) : (
              <Mic className="h-8 w-8 relative z-10" />
            )}
          </button>

          <p className="text-sm font-mono text-muted-foreground">
            {isRecording
              ? "Listening… tap to stop"
              : "Tap the mic to start recording"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Transcript
              </label>
              <div className="p-4 rounded-xl bg-card border border-border font-mono text-sm text-foreground min-h-[100px] whitespace-pre-wrap">
                {transcript}
              </div>
            </div>

            <Button
              onClick={analyzeVoice}
              disabled={!transcript.trim() || isProcessing}
              className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Analyze Voice Input
                </>
              )}
            </Button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-8">
            <ResultCard {...result} />
          </div>
        )}
      </main>
    </div>
  );
};

export default VoiceDetection;
