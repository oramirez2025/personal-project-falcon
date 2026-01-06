import { useState, useEffect } from "react";
import { grabWeather } from "../utilities";

export default function WeatherCard() {
  const [weather, setWeather] = useState({
    currTemp: null,
    feelsLikeTemp: null,
    maxTemp: null,
    minTemp: null,
  });

  
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [dir, setDir] = useState({ dx: 1.2, dy: 1.0 }); 

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await grabWeather();
      if (data) setWeather(data);
    };
    fetchWeather();
  }, []);

  
  useEffect(() => {
    const move = () => {
      setPos((prev) => {
        let newX = prev.x + dir.dx;
        let newY = prev.y + dir.dy;

        const cardWidth = 250;
        const cardHeight = 160;

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        // Bounce horizontally
        if (newX <= 0 || newX + cardWidth >= screenW) {
          setDir((d) => ({ ...d, dx: -d.dx }));
        }

        // Bounce vertically
        if (newY <= 0 || newY + cardHeight >= screenH) {
          setDir((d) => ({ ...d, dy: -d.dy }));
        }

        return { x: newX, y: newY };
      });
    };

    const interval = setInterval(move, 16); 
    return () => clearInterval(interval);
  }, [dir]);

  const { currTemp, feelsLikeTemp, maxTemp, minTemp } = weather;

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: "250px",
        backgroundColor: "black",
        color: "white",
        border: "2px solid red",
        boxShadow: "0 0 15px red",
        borderRadius: "10px",
        padding: "20px",
        zIndex: 9999,
        transition: "transform 0.1s linear",
        userSelect: "none",
        pointerEvents: "none" 
      }}
    >
      <h3 style={{ marginBottom: "10px", color: "red", fontWeight: "bold" }}>
        Weather
      </h3>
      <h3 style={{ marginBottom: "10px" }}>
        {currTemp !== null ? `${currTemp}°` : "MISSING"}
      </h3>
      <h5 style={{ marginBottom: "5px" }}>
        Feels like: {feelsLikeTemp !== null ? `${feelsLikeTemp}°` : "MISSING"}
      </h5>
      <h5>
        H: {maxTemp !== null ? `${maxTemp}°` : "MISSING"} | L:{" "}
        {minTemp !== null ? `${minTemp}°` : "MISSING"}
      </h5>
    </div>
  );
}
