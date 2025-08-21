import { useState } from "react";

import "./App.css";

{
  /* CONTENIDOS */
}
{
  /* header (city, temperature, weather conditions) */
}
{
  /* encabezado (ciudad, temperatura, condiciones meteorológicas) */
}

{
  /* weather details section (humidity and wind speed) */
}
{
  /* sección descripción tiempo (humedad y velocidad del viento) */
}

{
  /* next 5 days weather prevision  aka forecast*/
}
{
  /* previsión del tiempo de los siguientes 5 días */
}

function App() {
  return (
    <>
      <div className="wrapper">
        {/* header // encabezado */}
        <div className="header">
          <h1 className="ciudad">Murcia</h1>
          <p className="temperatura">34°C</p>
          <p className="tiempo">Soleado</p>
        </div>

        {/* weather details section // sección descripción tiempo */}
        <div className="weather-details">
          <div>
            <p>Humidity</p>
            <p> 60%</p>
          </div>
          <div>
            <p>Wind Speed</p>
            <p>7 mph</p>
          </div>
        </div>

        {/* next 5 days weather prevision aka forecast // previsión del tiempo de los siguientes 5 días */}
        <div className="forecast">
          <h2 className="forecast-header">Próximos 5 días</h2>
          <div className="forecast-days">
            <div className="forecast-day">
              <p>Viernes</p>
              <p>Nublado</p>
              <p>32°C</p>
            </div>
            <div className="forecast-day">
              <p>Sábado</p>
              <p>Lluvia</p>
              <p>32°C</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
