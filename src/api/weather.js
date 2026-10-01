const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchCity(name) {
  const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(name)}&count=1`);
  if (!res.ok) throw new Error("Could not reach the location service.");
  const data = await res.json();
  if (!data.results?.length) throw new Error(`No city found for "${name}".`);
  const { name: city, country, latitude, longitude } = data.results[0];
  return { city, country, latitude, longitude };
}

export async function getCurrentWeather({ latitude, longitude }) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
    timezone: "auto",
  });
  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error("Could not load weather data.");
  const { current } = await res.json();
  return current;
}