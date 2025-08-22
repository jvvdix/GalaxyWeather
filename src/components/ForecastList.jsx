import React from "react";

export default function ForecastList({ forecast, weekdayFormat }) {
  return (
    <div className="forecast">
      <h3 className="forecast-header">Forecast</h3>
      <div className="forecast-list">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-item">
            {/* día de la semana -- day of the week */}
            <div className="forecast-day-info">
              <p className="forecast-day">
                {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                  weekday: weekdayFormat,
                })}
              </p>
            </div>

            {/* icono y temperatura del día -- day weather icon and temp */}
            <div className="forecast-weather">
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                className="forecast-icon"
              />
              <p className="forecast-description">
                {Math.round(day.main.temp)}°C
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
