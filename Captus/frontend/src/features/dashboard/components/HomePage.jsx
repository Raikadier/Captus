// HomePage - Equivalent to frmHome.cs
// Displays current time and date in large format
import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
      setCurrentDate(now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      {/* Time display - equivalent to lblHora */}
      <div className="text-center mb-8">
        <div className="text-8xl font-normal text-green-600 mb-4">
          {currentTime}
        </div>
      </div>

      {/* Date display - equivalent to lblFecha */}
      <div className="text-center">
        <div className="text-4xl font-normal text-green-700">
          {currentDate}
        </div>
      </div>
    </div>
  );
};

export default HomePage;