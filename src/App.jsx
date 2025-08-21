import { useEffect, useState } from "react";

function App() {
  const [searchInput, setSearchInput] = useState(""); //texto escrito por el cliente -- text written by the client
  const [weatherData, setWeatherData] = useState(null); //datos del clima -- weather data
  const [city, setCity] = useState("murcia"); //ciudad por defect que ahora es Murcia -- default city, Murcia in this case
  const [forecast, setForecast] = useState([]); //datos pronostico con array -- forecast data with array
  const [error, setError] = useState(null); //control de errores -- error control
  const API_KEY = import.meta.env.VITE_API_KEY; //api key protegida -- protected api key
  const [loading, setLoading] = useState(false); //cargando -- loading
  const [weekdayFormat, setWeekdayFormat] = useState("short"); //formato día semana -- weekday format

  // función que hace llamada a la API para obtener datos  -- function that calls the API to get data
  const fetchWeatherData = async (cityName) => {
    //limpiamos posibles datos previos -- clear possible previous data
    setWeatherData(null);
    setForecast([]);
    setError(null);
    setLoading(true);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json(); //parse datos a JSON -- parse data to JSON

      if (data.cod !== 200) {
        //si no se encuentra la ciudad -- if the city is not found
        setError("City not found. We are sorry.");
        setLoading(false);
        return;
      }

      setWeatherData(data);

      //llamada a la API para próximos días -- API call for the next days data
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastResponse.json();
      setCity(cityName); //guarda la ciudad introducida -- saves the entered city

      const dailyForecast = forecastData.list.filter(
        (item, index) => index % 8 === 0
      );
      setForecast(dailyForecast);
      //en caso de error -- in case there is an error
    } catch (error) {
      setError("Sorry, we couldn’t retrieve the weather data");
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

  function handleSearch(e) {
    //buscar el clima de la ciudad introducida -- search the weather of the input city
    e.preventDefault();
    fetchWeatherData(searchInput);
  }

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

      {/* mensajes de estado -- state messages */}
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* html para mostrar datos del clima -- html to show wather data */}
      {weatherData && weatherData.main && weatherData.weather && (
        <div className="weather">
          <h2 className="city">{weatherData.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
            className="weather-icon"
          />
          <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
          <h3 className="condition">
            <strong>{weatherData.weather[0].main}</strong>
          </h3>

          <div className="weather-details">
            <div>
              <p>
                <strong>Humidity</strong>
              </p>
              <p className="weather-detail-value">
                {Math.round(weatherData.main.humidity)}%
              </p>
            </div>
            <div>
              <p>
                <strong>Wind Speed</strong>
              </p>
              <p className="weather-detail-value">
                {Math.round(weatherData.wind.speed)} km/h
              </p>
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
