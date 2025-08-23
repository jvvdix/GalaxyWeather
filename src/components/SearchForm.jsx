import React from "react";

export default function SearchForm({
  searchInput,
  setSearchInput,
  handleSearch,
}) {
  return (
    <form className="form" onSubmit={handleSearch}>
      {/* input para escribir ciudad -- input to type city */}
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Enter city name"
        className="search-input"
      />
      {/* botón para buscar -- search button */}
      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  );
}
