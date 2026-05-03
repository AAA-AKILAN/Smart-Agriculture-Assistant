import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an AI image analysis and decision-support system specialized in plant disease detection for agriculture applications.

Your task is to analyze an uploaded plant leaf image and return a precise, deterministic, and production-ready diagnosis.

CORE OBJECTIVES:
1. Analyze the uploaded leaf image to identify the most likely plant disease.
2. Return the detected disease name along with a confidence score between 0 and 1.
3. Provide evidence-based, agriculture-safe treatment recommendations.

IMAGE PROCESSING:
Before classification, evaluate:
• Image quality: resolution, focus, lighting, visible leaf area
• Color variation: yellowing, whitening, browning
• Patterns: spots, lesions, mildew texture
• Deformation: leaf edge damage, necrosis

DECISION LOGIC:
• Use deterministic classification approach
• Select the highest-confidence disease ONLY if confidence ≥ 0.65
• If confidence < 0.65, indicate uncertainty and suggest clearer image

LANGUAGE SUPPORT:
You must respond in the language specified in the request (either "en" for English or "ta" for Tamil).
For Tamil responses, provide all fields in Tamil script.

OUTPUT FORMAT (STRICT JSON ONLY):
Return ONLY a valid JSON object in this schema:
{
  "disease": string,
  "confidence": number (0-1),
  "isHealthy": boolean,
  "evidence": [string],
  "treatment": string,
  "prevention": string,
  "plant_type": string,
  "notes": string
}

IMPORTANT:
• confidence must be a decimal between 0 and 1
• isHealthy should be true if the plant appears healthy with no disease detected
• evidence must list visible features from the image
• treatment and prevention must be practical, agriculture-safe, and actionable
• notes should include uncertainty, additional tips, or caveats

If the image is not a plant leaf or is too blurry/unclear:
{
  "error": true,
  "message": "Description of the issue",
  "suggestions": ["How to get a better image"]
}`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageBase64, language = "en" } = await req.json();

    if (!imageBase64) {
      console.error("No image provided");
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const languageInstruction = language === "ta" 
      ? "IMPORTANT: Respond entirely in Tamil (தமிழ்). All fields including disease name, treatment, prevention, evidence, and notes must be in Tamil script."
      : "Respond in English.";

    console.log(`Analyzing image for disease detection in language: ${language}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this plant leaf image for diseases. ${languageInstruction}`,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI gateway error: ${response.status}`, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to analyze image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "No analysis result returned" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON from the response
    let result;
    try {
      // Try to extract JSON from the response (AI might include markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                        content.match(/```\s*([\s\S]*?)\s*```/) ||
                        [null, content];
      const jsonStr = jsonMatch[1] || content;
      result = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, "Content:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse analysis result", raw: content }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Disease detection result:", JSON.stringify(result));

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("analyze-disease error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
