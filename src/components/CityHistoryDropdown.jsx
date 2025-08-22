import React from "react";

export default function CityHistoryDropdown({
  cityHistory,
  historyOpen,
  setHistoryOpen,
  fetchWeatherData,
}) {
  return (
    <div className="city-history-dropdown">
      {/* botón para desplegar/ocultar historial -- button to toggle history dropdown */}
      <button
        className="dropdown-toggle"
        onClick={() => setHistoryOpen((prev) => !prev)}
        aria-expanded={historyOpen}
        aria-controls="city-history-list"
      >
        Previously consulted cities {historyOpen ? "↑" : "↓"}
      </button>

      {/* lista de ciudades consultadas anteriormente -- previously consulted cities list */}
      {historyOpen && cityHistory.length > 0 && (
        <ul id="city-history-list" className="city-history-list">
          {cityHistory.map((cityItem, index) => (
            <li key={index}>
              <button
                className="history-btn"
                onClick={() => {
                  fetchWeatherData(cityItem); //buscar clima de ciudad en historial -- search weather for history city
                  setHistoryOpen(false); //cerrar historial -- close dropdown
                }}
              >
                {cityItem}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
