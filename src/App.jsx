import React, { useRef, useState, useEffect } from "react";
import SearchForm from "./components/SearchForm";
import CityHistoryDropdown from "./components/CityHistoryDropdown";
import WeatherDisplay from "./components/WeatherDisplay";
import ForecastList from "./components/ForecastList";

function App() {
  const [searchInput, setSearchInput] = useState(""); //texto escrito por el cliente -- text written by the client
  const [weatherData, setWeatherData] = useState(null); //datos del clima -- weather data
  const defaultCity = "murcia"; //ciudad por defecto -- default city
  const [city, setCity] = useState(() => {
    const saved = sessionStorage.getItem("weather_city_history");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed[0] : defaultCity;
    }
    return defaultCity;
  }); //ciudad por defecto que ahora es Murcia -- default city, Murcia in this case
  const [forecast, setForecast] = useState([]); //datos pronostico con array -- forecast data with array
  const [error, setError] = useState(null); //control de errores -- error control
  const API_KEY = import.meta.env.VITE_API_KEY; //api key protegida -- protected api key
  const [loading, setLoading] = useState(false); //cargando -- loading
  const [weekdayFormat, setWeekdayFormat] = useState("short"); //formato día semana -- weekday format
  const weatherDetailsRef = useRef(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(100); //ancho scrollbar -- scrollbar width
  const [scrollbarLeft, setScrollbarLeft] = useState(0); //posicion scrollbar -- scrollbar position
  const [historyOpen, setHistoryOpen] = useState(false); //desplegable historial -- history dropdown

  // historial de ciudades -- cities history
  const [cityHistory, setCityHistory] = useState(() => {
    const saved = sessionStorage.getItem("weather_city_history");
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

  // función que hace llamada a la API para obtener datos  -- function that calls the API to get data
  const fetchWeatherData = async (cityName) => {
    setWeatherData(null); //limpiamos posibles datos previos -- clear possible previous data
    setForecast([]);
    setError(null);
    setLoading(true);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=en`;
      const response = await fetch(url);
      const data = await response.json(); //parse datos a JSON -- parse data to JSON

      if (data.cod !== 200) {
        setError("City not found. Type another city."); //si no se encuentra la ciudad -- if the city is not found
        setLoading(false);
        return;
      }

      setWeatherData(data);
      setCity(cityName);

      // guarda ciudad en historial -- saves city in history
      setCityHistory((prevHistory) => {
        const updated = [
          cityName,
          ...prevHistory.filter(
            (c) => c.toLowerCase() !== cityName.toLowerCase() //evitar duplicados -- avoid repetitions
          ),
        ];
        sessionStorage.setItem("weather_city_history", JSON.stringify(updated));
        return updated;
      });

      // llamada a la API para próximos días -- API call for the next days data
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=en`
      );
      const forecastData = await forecastResponse.json();
      const dailyForecast = forecastData.list.filter(
        (item, index) => index % 8 === 0
      );
      setForecast(dailyForecast);
    } catch (error) {
      setError("Sorry, we couldn't retrieve the weather data"); //en caso de error -- in case there is an error
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
        setWeekdayFormat("short"); //si es móvil, día abreviado -- if it's mobile, day short format
      } else {
        setWeekdayFormat("long"); //si es desktop, día completo -- if it's desktop, day long format
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile); //para actualizar si cambia el tamaño -- if screen size changes
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // efecto para cambiar el fondo segun el clima -- effect to change bg according to weather
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
    fetchWeatherData(searchInput); //buscar el clima de la ciudad introducida -- search weather for entered city
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
          handleWeatherDetailsScroll={handleWeatherDetailsScroll}
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
