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

    const systemPrompt = `You are a fake news detection expert. Analyze the following ${type === "ocr" ? "text extracted from an image" : type === "voice" ? "transcribed speech" : "news text"} and classify it.

IMPORTANT CLASSIFICATION RULES:
- If the news sounds plausible, uses professional language, and matches real-world events or common reporting patterns, classify it as "True News" even without a source URL.
- Only classify as "Fake News" if there are CLEAR signs: conspiracy theories, impossible claims, known hoaxes, pseudoscience, extreme sensationalism, or verifiably false statements.
- Only classify as "Uncertain" if the text is genuinely ambiguous — a mix of credible and suspicious elements. Do NOT default to Uncertain just because a source is missing.
- Short news snippets from live matches, press conferences, or breaking events are typically TRUE — they don't need citations to be credible.
- Use your training knowledge to verify facts when possible. If something aligns with known events, say "True News".

You MUST respond with valid JSON in this exact format (no markdown, no extra text):
{
  "prediction": "True News" or "Fake News" or "Uncertain",
  "confidence": a number between 0 and 100,
  "reasons": ["reason1", "reason2", "reason3"]
}

Evaluate based on:
- Does the claim match known real-world events or plausible scenarios?
- Sensationalist or clickbait language patterns
- Extraordinary claims that defy science or logic
- Emotional manipulation tactics
- Known misinformation or conspiracy patterns
- Logical consistency of the statements`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-5-mini",
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
