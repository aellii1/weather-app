import { describeWeather } from "../WeatherCodes";

export default function CurrentWeather({ location, weather }) {
  const [label, icon] = describeWeather(weather.weather_code);

  return (
    <section className="current" aria-live="polite">
      <p className="place">
        {location.city}, {location.country}
      </p>
      <div className="headline">
        <span className="icon" aria-hidden="true">{icon}</span>
        <span className="temp">{Math.round(weather.temperature_2m)}°</span>
      </div>
      <p className="label">{label}</p>

      <dl className="details">
        <div>
          <dt>Feels like</dt>
          <dd>{Math.round(weather.apparent_temperature)}°C</dd>
        </div>
        <div>
          <dt>Humidity</dt>
          <dd>{weather.relative_humidity_2m}%</dd>
        </div>
        <div>
          <dt>Wind</dt>
          <dd>{Math.round(weather.wind_speed_10m)} km/h</dd>
        </div>
      </dl>
    </section>
  );
}