import React, { useEffect, useState } from 'react';
import WeatherCard from './WeatherCard';
import './App.css';

const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.REACT_APP_RAPIDAPI_HOST;

// Get weekday name
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
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST
        }
      };

      try {
        // Forecast data (next 5 days)
        const forecastRes = await fetch(
          `https://${RAPIDAPI_HOST}/forecast.json?q=${query}&days=5`,
          options
        );
        const forecast = await forecastRes.json();
        setForecastData(forecast.forecast.forecastday);

        // Previous 5 days
        const today = new Date();
        const pastDates = [...Array(5)].map((_, i) => {
          const d = new Date(today);
          d.setDate(d.getDate() - (i + 1));
          return d.toISOString().split('T')[0];
        });

        const historyPromises = pastDates.map(date =>
          fetch(
            `https://${RAPIDAPI_HOST}/history.json?q=${query}&dt=${date}`,
            options
          )
            .then(res => res.json())
            .then(data => data.forecast.forecastday[0])
        );

        const history = await Promise.all(historyPromises);
        setHistoryData(history.reverse()); // Show oldest first
      } catch (err) {
        console.error('Weather API (via RapidAPI) error:', err);
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
