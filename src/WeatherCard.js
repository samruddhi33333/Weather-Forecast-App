import React from 'react';

const WeatherCard = ({ weather }) => {
  if (!weather || !weather.day) return null;

  const date = weather.date;
  const { avgtemp_c, condition } = weather.day;
  const weekday = weather.weekday; // Passed from App component

  return (
    <div className="weather-card">
      <p><strong>Day:</strong> {weekday}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Avg Temp:</strong> {avgtemp_c}°C</p>
      <p><strong>Condition:</strong> {condition.text}</p>
      <img src={condition.icon} alt={condition.text} />
    </div>
  );
};

export default WeatherCard;
