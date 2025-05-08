import React, { useEffect, useState } from 'react';
import WeatherCard from './WeatherCard';
import './App.css';

const API_KEY = 'affb30227de443bbbfd25246250805';

// Function to get the weekday name
const getWeekday = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const App = () => {
  const [location, setLocation] = useState('Pune');
  const [query, setQuery] = useState('Pune');
  const [forecastData, setForecastData] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch forecast data (next 5 days)
        const forecastRes = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=5&aqi=no&alerts=no`
        );
        const forecast = await forecastRes.json();
        console.log('Forecast Data:', forecast); // Debugging
        setForecastData(forecast.forecast.forecastday);

        // Get 5 previous dates
        const today = new Date();
        const pastDates = [...Array(5)].map((_, i) => {
          const d = new Date(today);
          d.setDate(d.getDate() - (i + 1));
          return d.toISOString().split('T')[0];
        });

        // Fetch historical data
        const historyPromises = pastDates.map(date =>
          fetch(`https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${query}&dt=${date}`)
            .then(res => res.json())
            .then(data => {
              console.log('Historical Data:', data); // Debugging
              return data.forecast.forecastday[0];
            })
        );

        const history = await Promise.all(historyPromises);
        setHistoryData(history.reverse()); // Show oldest first
      } catch (err) {
        console.error('Weather API error:', err);
      }
    };

    fetchWeather();
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(location);
  };

  return (
    <div className="app">
      <h1>Weather Forecast App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city"
        />
        <button type="submit">Search</button>
      </form>

      <h2>Past 5 Days</h2>
      <div className="weather-forecast">
        {historyData.map((day, index) => (
          <WeatherCard key={`history-${index}`} weather={{ ...day, weekday: getWeekday(day.date) }} />
        ))}
      </div>

      <h2>Upcoming 5 Days</h2>
      <div className="weather-forecast">
        {forecastData.map((day, index) => (
          <WeatherCard key={`forecast-${index}`} weather={{ ...day, weekday: getWeekday(day.date) }} />
        ))}
      </div>
    </div>
  );
};

export default App;
