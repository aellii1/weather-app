import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import CurrentWeather from "./components/CurrentWeather";
import SavedCities from "./components/SavedCities";
import { searchCity, getCurrentWeather } from "./api/weather";
import "./App.css";

function ComingSoon({ title }) {
  return (
    <section className="placeholder">
      <h2>{title}</h2>
      <p>This page is coming soon.</p>
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState("Home");
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("idle"); 
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Add cities to local storage
  const [savedCities, setSavedCities] = useState(() => {
    const saved = localStorage.getItem("savedCities");
    return saved ? JSON.parse(saved) : [];
  });

  // track saved city currently viewed
  const [activeSavedCityWeather, setActiveSavedCityWeather] = useState(null);
  const [activeSavedCity, setActiveSavedCity] = useState(null);

  // notification state
  const [notification, setNotification] = useState("");

  useEffect(() => {
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
  }, [savedCities]);

  async function handleSearch(cityName) {
    setStatus("loading");
    setError("");
    try {
      const place = await searchCity(cityName);
      const current = await getCurrentWeather(place);
      setLocation(place);
      setWeather(current);
      setStatus("success");
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
      setStatus("error");
    }
  }

  // Save current location
const handleSaveCurrentCity = () => {
  if (!location) return;
  const currentName = location.name || location.city;
  const exists = savedCities.some(
    (c) => (c.name || c.city) === currentName
  );

  if (exists) return;

  if (savedCities.length >= 6) {
    setNotification("You can only save up to 6 cities.");
    setTimeout(() => setNotification(""), 3000);
    return;
  }

  setSavedCities((prev) => [...prev, location]);
  setNotification(`Successfully saved ${currentName}!`);
  setTimeout(() => setNotification(""), 3000);
};

  // Select a city from saved list
  const handleSelectSavedCity = async (place) => {
    setActiveSavedCity(place);
    setStatus("loading");
    try {
      const current = await getCurrentWeather(place);
      setActiveSavedCityWeather(current);
      setStatus("success");
    } catch (err) {
      setError(err.message || "Failed to load weather for this city.");
      setStatus("error");
    }
};

  // Delete a city from saved list
  const handleDeleteCity = (cityName) => {
    setSavedCities((prev) =>
      prev.filter((c) => (c.name || c.city) !== cityName)
    );
  };

  // Check if current location is saved
  const isCurrentCitySaved =
    location &&
    savedCities.some(
      (c) => (c.name || c.city) === (location.name || location.city)
    );

  return (
    <div className={sidebarOpen ? "shell" : "shell shell--collapsed"}>
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
      />
      <Sidebar page={page} onNavigate={setPage} />

      <main className="content">
        <div className="page">
          {/* Custom Notification Toast */}
          {notification && (
            <div className="app-notification" role="status">
              {notification}
            </div>
          )}
          {page === "Home" && (
            <>
              <Hero
                onSearch={handleSearch}
                disabled={status === "loading"}
                compact={status !== "idle"}
              />

              {status === "loading" && <p className="hint">Loading…</p>}
              {status === "error" && (
                <p className="error" role="alert">{error}</p>
              )}
              {status === "success" && location && weather && (
                <CurrentWeather
                  location={location}
                  weather={weather}
                  onSave={handleSaveCurrentCity}
                  isSaved={isCurrentCitySaved}
                />
              )}
            </>
          )}

          {page === "Saved cities" && (
            <section className="saved-cities-page">
              <h2>Saved Cities</h2>
              {savedCities.length === 0 ? (
                <p className="hint">No saved cities yet. Search for a city and save it!</p>
              ) : (
                <div className="saved-cities-container">
                  {/* Left or Top: The list of cards */}
                  <ul className="saved-list">
                    {savedCities.map((city) => {
                      const cityName = city.name || city.city;
                      const isSelected = activeSavedCity && (activeSavedCity.name || activeSavedCity.city) === cityName;
                      return (
                        <li key={cityName} className={`saved-item ${isSelected ? "saved-item--active" : ""}`}>
                          <button 
                            type="button"
                            className="city-select-btn"
                            onClick={() => handleSelectSavedCity(city)}
                          >
                            {cityName}{city.country ? `, ${city.country}` : ""}
                          </button>
                          <button 
                            type="button"
                            className="delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCity(cityName);
                              if (isSelected) {
                                setActiveSavedCity(null);
                                setActiveSavedCityWeather(null);
                              }
                            }}
                            aria-label={`Remove ${cityName}`}
                          >
                            ✕
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Right or Bottom: Weather details for the clicked city */}
                  {activeSavedCity && activeSavedCityWeather && (
                    <div className="saved-city-detail">
                      <CurrentWeather 
                        location={activeSavedCity} 
                        weather={activeSavedCityWeather} 
                      />
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {page !== "Home" && page !== "Saved cities" && (
            <ComingSoon title={page} />
          )}
        </div>
      </main>
    </div>
  );
}