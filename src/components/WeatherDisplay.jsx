import React from "react";
import WeatherDetails from "./WeatherDetails";

export default function WeatherDisplay({ weatherData, weatherDetailsRef }) {
  return (
    <div className="weather">
      {/* nombre de la ciudad -- city name */}
      <h2 className="city">{weatherData.name}</h2>

      {/* icono del clima -- weather icon */}
      <img
        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
        alt={weatherData.weather[0].description}
        className="weather-icon"
      />

      {/* temperatura actual -- current temperature */}
      <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>

      {/* condición del clima -- weather condition */}
      <h3 className="condition">{weatherData.weather[0].main}</h3>

      {/* detalles del clima -- weather details */}
      <WeatherDetails
        weatherData={weatherData}
        weatherDetailsRef={weatherDetailsRef}
      />
    </div>
  );
}
