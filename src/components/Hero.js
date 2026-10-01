import SearchBar from "./SearchBar";

const QUICK_CITIES = ["Cebu", "Manila", "Tokyo", "London", "New York"];

export default function Hero({ onSearch, disabled, compact }) {
  return (
    <header className={compact ? "hero hero--compact" : "hero"}>
      <h1 className="hero-title">
        {compact ? "Weather" : "Check the weather anywhere."}
      </h1>

      {!compact && (
        <p className="hero-sub">
          Search any city for its current temperature, wind, and humidity.
        </p>
      )}

      <SearchBar onSearch={onSearch} disabled={disabled} />

      {!compact && (
        <ul className="quick" aria-label="Popular cities">
          {QUICK_CITIES.map((city) => (
            <li key={city}>
              <button
                type="button"
                onClick={() => onSearch(city)}
                disabled={disabled}
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}