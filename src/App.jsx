import React, { useRef, useState, useEffect } from "react";

function App() {
  const [searchInput, setSearchInput] = useState(""); //texto escrito por el cliente -- text written by the client
  const [weatherData, setWeatherData] = useState(null); //datos del clima -- weather data
  const defaultCity = "murcia";
  const [city, setCity] = useState(() => {
    const saved = localStorage.getItem("weather_city_history");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed[0] : defaultCity;
    }
    return defaultCity;
  }); //ciudad por defect que ahora es Murcia -- default city, Murcia in this case
  const [forecast, setForecast] = useState([]); //datos pronostico con array -- forecast data with array
  const [error, setError] = useState(null); //control de errores -- error control
  const API_KEY = import.meta.env.VITE_API_KEY; //api key protegida -- protected api key
  const [loading, setLoading] = useState(false); //cargando -- loading
  const [weekdayFormat, setWeekdayFormat] = useState("short"); //formato día semana -- weekday format
  const weatherDetailsRef = useRef(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(100); //ancho scrollbar -- scrollbar width
  const [scrollbarLeft, setScrollbarLeft] = useState(0); //posicion scrollbar -- scrollbar position
  const [historyOpen, setHistoryOpen] = useState(false); //desplegable historial -- history dropdown

  // historial ce ciudades -- cities history
  const [cityHistory, setCityHistory] = useState(() => {
    const saved = localStorage.getItem("weather_city_history");
    return saved ? JSON.parse(saved) : [];
  });
  // fondo depende del clima obtenido -- background depends on the obtained weather
  const getBackgroundGradient = (weatherMain, weatherIcon) => {
    if (!weatherMain)
      return "linear-gradient(to bottom right, #60a5fa, #3b82f6)"; // por defecto -- default

    const condition = weatherMain.toLowerCase();
    const isNight = weatherIcon && weatherIcon.includes("n");

    switch (condition) {
      case "clear":
        return isNight
          ? "linear-gradient(to bottom right, #1e1b4b, #312e81, #4c1d95)" // noche despejada -- clear night
          : "linear-gradient(to bottom right, #60a5fa, #6badfcff, #3b82f6)"; // soleado -- sunny

      case "clouds":
        return isNight
          ? "linear-gradient(to bottom right, #374151, #4b5563, #6b7280)" // noche con nubes -- cloudy night
          : "linear-gradient(to bottom right, #d5d5d6ff, #8c8c8eff, #5f656eff)"; // dia nublado -- cloudy day

      case "rain":
      case "drizzle":
        return "linear-gradient(to bottom right, #6b7280, #4b5563, #374151)"; // lluvia -- rain

      case "thunderstorm":
        return "linear-gradient(to bottom right, #374151, #1f2937, #111827)"; // tormenta -- thunderstorm

      case "snow":
        return "linear-gradient(to bottom right, #f8fafc, #e2e8f0, #cbd5e1)"; // niene -- snow

      case "mist":
      case "fog":
      case "haze":
        return "linear-gradient(to bottom right, #e5e7eb, #d1d5db, #9ca3af)"; // niebla -- fog

      default:
        return "linear-gradient(to bottom right, #60a5fa, #3b82f6)"; // por defecto -- default
    }
  };

  // función que hace llamada a la API para obtener datos  -- function that calls the API to get data
  const fetchWeatherData = async (cityName) => {
    //limpiamos posibles datos previos -- clear possible previous data
    setWeatherData(null);
    setForecast([]);
    setError(null);
    setLoading(true);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=en`;
      const response = await fetch(url);
      const data = await response.json(); //parse datos a JSON -- parse data to JSON

      if (data.cod !== 200) {
        //si no se encuentra la ciudad -- if the city is not found
        setError("City not found. Type another city.");
        setLoading(false);
        return;
      }

      setWeatherData(data);
      setCity(cityName);

      //guarda ciudad en historial -- saves city in history
      setCityHistory((prevHistory) => {
        const updated = [
          cityName,
          ...prevHistory.filter(
            (c) => c.toLowerCase() !== cityName.toLowerCase() //evitar duplicados -- avoid repetitions
          ),
        ];
        localStorage.setItem("weather_city_history", JSON.stringify(updated));
        return updated;
      });

      //llamada a la API para próximos días -- API call for the next days data
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=en`
      );
      const forecastData = await forecastResponse.json();
      setCity(cityName); //guarda la ciudad introducida -- saves the entered city

      const dailyForecast = forecastData.list.filter(
        (item, index) => index % 8 === 0
      );
      setForecast(dailyForecast);
      //en caso de error -- in case there is an error
    } catch (error) {
      setError("Sorry, we couldn't retrieve the weather data");
    } finally {
      setLoading(false);
    }
  };

  //al abrir la app se inicializa esta función-- this function is initialised when opening the app
  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  //para comprobar si es vista móvil o desktop -- to check if it's mobile or desktop view
  useEffect(() => {
    const checkMobile = () => {
      if (window.matchMedia("(max-width: 500px)").matches) {
        setWeekdayFormat("long"); //si es móvil, el día escrito entero -- if it's mobile, the day is written in full
      } else {
        setWeekdayFormat("short"); //si es desktop, el día abreviado -- if it's desktop, the day is abbreviated
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile); //para actualizar si cambia el tamaño de la pantalla --  if the screen size change, it gets updated
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (weatherData && weatherData.weather && weatherData.weather[0]) {
      const gradient = getBackgroundGradient(
        weatherData.weather[0].main,
        weatherData.weather[0].icon
      );
      document.body.style.background = gradient;
    }

    return () => {
      document.body.style.background =
        "linear-gradient(to bottom right, #778089, #525455)";
    };
  }, [weatherData]);

  function handleSearch(e) {
    //buscar el clima de la ciudad introducida -- search the weather of the input city
    e.preventDefault();
    fetchWeatherData(searchInput);
  }

  function updateWeatherScrollbar() {
    const el = weatherDetailsRef.current;
    if (!el) return;
    const visible = el.offsetWidth;
    const total = el.scrollWidth;
    const scrollLeft = el.scrollLeft;
    if (total <= visible) {
      setScrollbarWidth(100);
      setScrollbarLeft(0);
    } else {
      setScrollbarWidth((visible / total) * 100);
      setScrollbarLeft((scrollLeft / total) * 100);
    }
  }

  function handleWeatherDetailsScroll() {
    updateWeatherScrollbar();
  }

  useEffect(() => {
    updateWeatherScrollbar();
    window.addEventListener("resize", updateWeatherScrollbar);
    return () => window.removeEventListener("resize", updateWeatherScrollbar);
  }, [weatherData]);

  return (
    <div className="wrapper">
      {/* formulario para buscar ciudad -- form to search for desired city */}
      <form className="form" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchInput} //valor del input -- input value
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter city name"
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      {/* desplegable de ciudades anteriormente consultadas -- previously consulted citiesz  */}
      <div className="city-history-dropdown">
        <button
          className="dropdown-toggle"
          onClick={() => setHistoryOpen((prev) => !prev)}
          aria-expanded={historyOpen}
          aria-controls="city-history-list"
        >
          Previously consulted cities {historyOpen ? "↑" : "↓"}
        </button>

        {historyOpen && cityHistory.length > 0 && (
          <ul id="city-history-list" className="city-history-list">
            {cityHistory.map((cityItem, index) => (
              <li key={index}>
                <button
                  className="history-btn"
                  onClick={() => {
                    fetchWeatherData(cityItem);
                    setHistoryOpen(false);
                  }}
                >
                  {cityItem}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* mensajes de estado -- state messages */}
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/*   mostrar datos del clima -- show wather data */}
      {weatherData && weatherData.main && weatherData.weather && (
        <div className="weather">
          <h2 className="city">{weatherData.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
            className="weather-icon"
          />
          <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
          <h3 className="condition">{weatherData.weather[0].main}</h3>

          <div
            className="weather-details-wrapper"
            style={{ position: "relative" }}
          >
            <div
              className="weather-details"
              ref={weatherDetailsRef}
              onScroll={handleWeatherDetailsScroll}
            >
              <div className="detail-box">
                {/* HUMEDAD -- HUMIDITY */}
                <p>
                  <strong>Humidity</strong>
                </p>
                <p className="weather-detail-value">
                  {Math.round(weatherData.main.humidity)}%
                </p>
              </div>
              <div className="detail-box">
                {/* VELOCIDAD DEL VIENTO -- WIND SPEED */}
                <p>
                  <strong>Wind Speed</strong>
                </p>
                <p className="weather-detail-value">
                  {Math.round(weatherData.wind.speed * 3.6)} km/h
                </p>
              </div>
              <div className="detail-box">
                {/* MÁXIMA Y MÍNIMA TEMPERATURA -- MAX AND MIN TEMP*/}
                <p>
                  <strong>Max / Min</strong>
                </p>
                <p className="weather-detail-value">
                  {Math.round(weatherData.main.temp_max)}°C /{" "}
                  {Math.round(weatherData.main.temp_min)}°C
                </p>
              </div>
              <div className="detail-box">
                {/* VISIBILIDAD -- VISIBILITY */}
                <p>
                  <strong>Visibility</strong>
                </p>
                <p className="weather-detail-value">
                  {Math.round(weatherData.visibility)}m
                </p>
              </div>
              <div className="detail-box">
                {/* PRESION ATMOSFERICA -- PRESSURE */}
                <p>
                  <strong>Pressure</strong>
                </p>
                <p className="weather-detail-value">
                  {Math.round(weatherData.main.pressure)} hPa
                </p>
              </div>
            </div>
            {/* scrollbar para detaalles -- details scrollbar */}
            <div className="weather-scrollbar">
              <div
                className="weather-scrollbar-thumb"
                style={{
                  width: `${scrollbarWidth}%`,
                  left: `${scrollbarLeft}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast">
          <h3 className="forecast-header">5-Day Forecast</h3>
          <div className="forecast-days">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-item">
                <p className="forecast-day">
                  {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                    // días de la semana se mostrarán en inglés -- weekdays will be in English
                    weekday: weekdayFormat,
                  })}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                  className="forecast-icon"
                />
                <p className="forecast-temp">{Math.round(day.main.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
