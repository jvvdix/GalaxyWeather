import React, { useRef, useState, useEffect } from "react";
import SearchForm from "./components/SearchForm";
import CityHistoryDropdown from "./components/CityHistoryDropdown";
import WeatherDisplay from "./components/WeatherDisplay";
import ForecastList from "./components/ForecastList";

// importar servicios -- import services
import { getCurrentWeather } from "./services/weatherService";
import { getForecast } from "./services/forecastService";

function App() {
  const [searchInput, setSearchInput] = useState(""); //texto escrito por el cliente -- text written by the client
  const [weatherData, setWeatherData] = useState(null); //datos del clima -- weather data
  const defaultCity = "murcia"; //ciudad por defecto -- default city
  const [city, setCity] = useState(() => {
    const saved = localStorage.getItem("weather_city_history");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed[0] : defaultCity;
    }
    return defaultCity;
  });
  const [forecast, setForecast] = useState([]); //datos pronostico  -- forecast data
  const [error, setError] = useState(null); //control de errores -- error control
  const [loading, setLoading] = useState(false); //cargando -- loading
  const [weekdayFormat, setWeekdayFormat] = useState("short"); //formato día semana -- weekday format
  const weatherDetailsRef = useRef(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(100); //ancho scrollbar -- scrollbar width
  const [scrollbarLeft, setScrollbarLeft] = useState(0); //posicion scrollbar -- scrollbar position
  const [historyOpen, setHistoryOpen] = useState(false); //desplegable historial -- history dropdown

  // historial de ciudades -- cities history
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
        return "linear-gradient(to bottom right, #f8fafc, #e2e8f0, #cbd5e1)"; // nieve -- snow
      case "mist":
      case "fog":
      case "haze":
        return "linear-gradient(to bottom right, #e5e7eb, #d1d5db, #9ca3af)"; // niebla -- fog
      default:
        return "linear-gradient(to bottom right, #60a5fa, #3b82f6)"; // por defecto -- default
    }
  };

  // función llamada a API   -- function that calls the API
  const fetchWeatherData = async (cityName) => {
    setWeatherData(null); //limpiamos posibles datos previos -- clear possible previous data
    setForecast([]);
    setError(null);
    setLoading(true);

    try {
      const data = await getCurrentWeather(cityName);
      setWeatherData(data);
      setCity(cityName);

      // guarda ciudad en historial -- saves city in history
      setCityHistory((prevHistory) => {
        const updated = [
          cityName, // añade la ciudad buscada al principio del array -- adds searched city to  beginning of array
          ...prevHistory.filter(
            //añade el resto de ciudades que ya estaban -- adds previously existing cities

            (c) => c.toLowerCase() !== cityName.toLowerCase() //evitar duplicados -- avoid repetitions
          ),
        ];
        localStorage.setItem("weather_city_history", JSON.stringify(updated));
        return updated; //devuelve array actualizado -- returns updated array
      });

      const dailyForecast = await getForecast(cityName);
      setForecast(dailyForecast);
    } catch (error) {
      setError(error.message || "Sorry, we couldn't retrieve the weather data"); //en caso de error -- in case there is an error
    } finally {
      setLoading(false);
    }
  };

  //función inicializada al abrir app -- this function is initialised when opening the app
  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  //vista móvil o desktop -- mobile or desktop view
  useEffect(() => {
    const checkMobile = () => {
      if (window.matchMedia("(max-width: 500px)").matches) {
        setWeekdayFormat("short"); //móvil, día abreviado -- if it's mobile, day short format
      } else {
        setWeekdayFormat("long"); // desktop, día completo -- if it's desktop, day long format
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile); // actualizar si cambia el tamaño -- if screen size changes
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // cambiar el fondo segun el clima -- change bg according to weather
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
    e.preventDefault();
    fetchWeatherData(searchInput);
  }

  return (
    <div className="wrapper">
      {/* formulario para buscar ciudad -- form to search for desired city */}
      <SearchForm
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
      />

      {/* desplegable de ciudades anteriormente consultadas -- previously consulted cities */}
      <CityHistoryDropdown
        cityHistory={cityHistory}
        historyOpen={historyOpen}
        setHistoryOpen={setHistoryOpen}
        fetchWeatherData={fetchWeatherData}
      />

      {/* mensajes de estado -- state messages */}
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* mostrar datos del clima -- show weather data */}
      {weatherData && weatherData.main && weatherData.weather && (
        <WeatherDisplay
          weatherData={weatherData}
          weatherDetailsRef={weatherDetailsRef}
        />
      )}

      {/* proximos días -- forecast */}
      {forecast.length > 0 && (
        <ForecastList forecast={forecast} weekdayFormat={weekdayFormat} />
      )}
    </div>
  );
}

export default App;
