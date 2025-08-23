const API_KEY = import.meta.env.VITE_API_KEY;

export async function getForecast(cityName) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=en`
    );
    const data = await response.json();
    if (data.cod !== "200") throw new Error("Forecast not found.");

    const dailyForecast = data.list.filter((item, index) => index % 8 === 0);
    return dailyForecast;
  } catch (error) {
    throw error;
  }
}
