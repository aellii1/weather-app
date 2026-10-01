import { useState } from "react";

export default function SearchBar({ onSearch, disabled }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <label htmlFor="city" className="visually-hidden">
        City name
      </label>
      <input
        id="city"
        type="search"
        placeholder="Search for a city"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
      />
      <button type="submit" disabled={disabled || !value.trim()}>
        Search
      </button>
    </form>
  );
}