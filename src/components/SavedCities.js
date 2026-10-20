export default function SavedCities({ savedCities, onSelectCity, onDeleteCity }) {
  if (!savedCities || savedCities.length === 0) {
    return (
      <section className="saved-cities-page">
        <h2>Saved Cities</h2>
        <p className="hint">No saved cities yet. Search for a city and save it!</p>
      </section>
    );
  }

  return (
    <section className="saved-cities-page">
      <h2>Saved Cities</h2>
      <ul className="saved-list">
        {savedCities.map((city) => {
          const cityName = city.name || city.city;
          return (
            <li key={cityName} className="saved-item">
              <button 
                type="button"
                className="city-select-btn"
                onClick={() => onSelectCity(city)}
              >
                {cityName}{city.country ? `, ${city.country}` : ""}
              </button>

              <button
                type="button"
                className="delete-btn"
                aria-label={`Remove ${cityName}`}
                onClick={() => onDeleteCity(cityName)}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}