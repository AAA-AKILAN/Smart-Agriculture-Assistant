import { supabase } from "@/integrations/supabase/client";

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  weather: string;
  weatherCode?: number;
  location?: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

export async function getCurrentLocation(): Promise<{ coords: { latitude: number; longitude: number } }> {
  try {
    // First try the browser's Geolocation API
    return await new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        (err) => reject(err),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  } catch (error) {
    // Fallback: Live Location Tracker API (IP-based)
    console.log("Browser geolocation failed, falling back to Live Location API...");
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      
      if (data && data.latitude && data.longitude) {
        return {
          coords: {
            latitude: data.latitude,
            longitude: data.longitude
          }
        };
      }
      throw new Error("Invalid location data from API");
    } catch (fallbackError) {
      console.log("ipapi.co failed, falling back to ipwho.is...");
      try {
        const response2 = await fetch("https://ipwho.is/");
        const data2 = await response2.json();
        
        if (data2 && data2.success && data2.latitude && data2.longitude) {
          return {
            coords: {
              latitude: data2.latitude,
              longitude: data2.longitude
            }
          };
        }
        throw new Error("Invalid location data from ipwho.is");
      } catch (finalError) {
        console.log("All location services failed. Using default location (New Delhi).");
        return {
          coords: {
            latitude: 28.6139,
            longitude: 77.2090
          }
        };
      }
    }
  }
}

export async function fetchWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
  try {
    const { data, error } = await supabase.functions.invoke("get-weather", {
      body: { latitude, longitude },
    });

    if (error) {
      throw new Error(error.message || "Failed to fetch weather data from Supabase");
    }

    if (data && data.error) {
      throw new Error(data.error);
    }

    return data as WeatherData;
  } catch (error) {
    console.log("Supabase Edge Function failed, falling back to Open-Meteo API...", error);
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain,weather_code`);
      
      if (!response.ok) {
        throw new Error("Could not fetch weather from Open-Meteo API");
      }
      
      const weatherData = await response.json();
      
      const wc = weatherData.current.weather_code;
      let weatherString = 'sunny';
      if (wc > 0 && wc <= 3) weatherString = 'cloudy';
      else if (wc >= 51 && wc <= 67) weatherString = 'rainy';
      else if (wc >= 71 && wc <= 77) weatherString = 'rainy'; // snow
      else if (wc >= 80 && wc <= 99) weatherString = 'rainy'; // showers/thunderstorm

      return {
        temperature: weatherData.current.temperature_2m,
        humidity: weatherData.current.relative_humidity_2m,
        rainfall: weatherData.current.rain,
        weather: weatherString,
        weatherCode: wc
      };
    } catch (fallbackError) {
      throw new Error("Could not fetch weather"); // This ensures the toast shows "Could not fetch weather" gracefully or allows fallback Error
    }
  }
}

export async function getWeatherForCurrentLocation(): Promise<WeatherData> {
  const position = await getCurrentLocation();
  return fetchWeatherData(position.coords.latitude, position.coords.longitude);
}
