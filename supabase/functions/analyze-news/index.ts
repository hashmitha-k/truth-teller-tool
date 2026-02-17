import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { text, type } = await req.json(); // type: "text" | "voice" | "ocr"
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "No text provided for analysis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a fake news detection expert. Analyze the following ${type === "ocr" ? "text extracted from an image" : type === "voice" ? "transcribed speech" : "news text"} and determine if it is likely true news, fake news, or uncertain.

You MUST respond with valid JSON in this exact format (no markdown, no extra text):
{
  "prediction": "True News" or "Fake News" or "Uncertain",
  "confidence": a number between 0 and 100,
  "reasons": ["reason1", "reason2", "reason3"]
}

Consider these factors:
- Sensationalist or clickbait language
- Unverifiable or extraordinary claims
- Emotional manipulation tactics
- Lack of credible sources
- Logical consistency
- Known misinformation patterns
- Whether the claims are factually verifiable`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let result;
    try {
      // Try to parse JSON from the response, handling potential markdown wrapping
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      result = {
        prediction: "Uncertain",
        confidence: 50,
        reasons: ["Could not parse AI response"],
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-news error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
