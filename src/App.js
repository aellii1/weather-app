import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import CurrentWeather from "./components/CurrentWeather";
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

  return (
    <div className="shell">
      <Header />
      <Sidebar page={page} onNavigate={setPage} />

      <main className="content">
        <div className="page">
          {page === "Home" ? (
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
              {status === "success" && (
                <CurrentWeather location={location} weather={weather} />
              )}
            </>
          ) : (
            <ComingSoon title={page} />
          )}
        </div>
      </main>
    </div>
  );
}