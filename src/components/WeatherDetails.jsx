import React from "react";

export default function WeatherDetails({
  weatherData,
  weatherDetailsRef,
  handleWeatherDetailsScroll,
}) {
  return (
    <div className="weather-details-wrapper" style={{ position: "relative" }}>
      {/* contenedor de detalles con scroll -- scrollable details container */}
      <div
        className="weather-details"
        ref={weatherDetailsRef}
        onScroll={handleWeatherDetailsScroll}
      >
        {/* HUMEDAD -- HUMIDITY */}
        <div className="detail-box">
          <p>
            <strong>Humidity</strong>
          </p>
          <p className="weather-detail-value">
            {Math.round(weatherData.main.humidity)}%
          </p>
        </div>

        {/* VELOCIDAD DEL VIENTO -- WIND SPEED */}
        <div className="detail-box">
          <p>
            <strong>Wind Speed</strong>
          </p>
          <p className="weather-detail-value">
            {Math.round(weatherData.wind.speed * 3.6)} km/h
          </p>
        </div>

        {/* MÁXIMA / MÍNIMA TEMPERATURA -- MAX / MIN TEMP */}
        <div className="detail-box">
          <p>
            <strong>Max / Min</strong>
          </p>
          <p className="weather-detail-value">
            {Math.round(weatherData.main.temp_max)}°C /{" "}
            {Math.round(weatherData.main.temp_min)}°C
          </p>
        </div>

        {/* VISIBILIDAD -- VISIBILITY */}
        <div className="detail-box">
          <p>
            <strong>Visibility</strong>
          </p>
          <p className="weather-detail-value">
            {Math.round(weatherData.visibility)}m
          </p>
        </div>

        {/* PRESION ATMOSFÉRICA -- PRESSURE */}
        <div className="detail-box">
          <p>
            <strong>Pressure</strong>
          </p>
          <p className="weather-detail-value">
            {Math.round(weatherData.main.pressure)} hPa
          </p>
        </div>
      </div>
    </div>
  );
}
