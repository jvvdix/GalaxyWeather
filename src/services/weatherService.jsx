const API_KEY = import.meta.env.VITE_API_KEY;

export async function getCurrentWeather(cityName) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=en`
    );
    const data = await response.json();
    if (data.cod !== 200) throw new Error("City not found. Type another city.");
    return data;
  } catch (error) {
    throw error;
  }
}
