import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Weather code to condition mapping
function getWeatherCondition(weatherCode: number): string {
  // WMO Weather interpretation codes
  if (weatherCode === 0) return "sunny";
  if (weatherCode <= 3) return "cloudy";
  if (weatherCode >= 51 && weatherCode <= 67) return "rainy";
  if (weatherCode >= 71 && weatherCode <= 77) return "rainy";
  if (weatherCode >= 80 && weatherCode <= 82) return "rainy";
  if (weatherCode >= 95) return "rainy";
  if (weatherCode >= 45 && weatherCode <= 48) return "humid";
  return "cloudy";
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { latitude, longitude } = await req.json();

    if (!latitude || !longitude) {
      console.error("Missing coordinates");
      return new Response(
        JSON.stringify({ error: "Latitude and longitude are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching weather for coordinates: ${latitude}, ${longitude}`);

    // Fetch current weather from Open-Meteo (free, no API key needed)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,precipitation&daily=precipitation_sum&timezone=auto`;

    const response = await fetch(weatherUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Open-Meteo API error: ${response.status}`, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to fetch weather data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    
    const current = data.current;
    const daily = data.daily;

    // Calculate average annual rainfall (approximate from daily data)
    const dailyPrecipitation = daily?.precipitation_sum || [];
    const avgDailyRainfall = dailyPrecipitation.reduce((a: number, b: number) => a + (b || 0), 0) / dailyPrecipitation.length;
    const estimatedAnnualRainfall = Math.round(avgDailyRainfall * 365);

    const weatherCondition = getWeatherCondition(current?.weather_code || 0);
    const temperature = Math.round(current?.temperature_2m || 25);
    const humidity = current?.relative_humidity_2m || 60;

    // Adjust weather condition based on humidity
    let finalCondition = weatherCondition;
    if (humidity > 80 && weatherCondition === "cloudy") {
      finalCondition = "humid";
    } else if (humidity < 40 && weatherCondition === "sunny") {
      finalCondition = "dry";
    }

    const result = {
      temperature,
      humidity,
      rainfall: estimatedAnnualRainfall > 0 ? estimatedAnnualRainfall : 900, // Default to 900mm if no data
      weather: finalCondition,
      weatherCode: current?.weather_code,
      location: {
        latitude,
        longitude,
        timezone: data.timezone,
      },
    };

    console.log("Weather result:", JSON.stringify(result));

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("get-weather error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
