import { useState, useEffect } from "react";
import { grabWeather } from "../utilities";

export default function WeatherCard() {
    const [weather, setWeather] = useState({
        currTemp: null,
        feelsLikeTemp: null,
        maxTemp: null,
        minTemp: null,
    });

    useEffect(() => {
        const fetchWeather = async () => {
        const data = await grabWeather();
        if (data) setWeather(data);
        };
        fetchWeather();
    }, []);

    const { currTemp, feelsLikeTemp, maxTemp, minTemp } = weather;

    return (
        <div className="card" style={{ width: "18rem" }}>
        {/* <img src="..." className="card-img-top" alt="Weather illustration" /> */}
        <div className="card-body">
            <h3 className="card-title">Weather</h3>
            <h3 className="card-title">{currTemp !== null ? `${currTemp}°` : "MISSING"}</h3>
            <h5 className="card-title">
            Feels like: {feelsLikeTemp !== null ? `${feelsLikeTemp}°` : "MISSING"}
            </h5>
            <h5 className="card-title">
            H: {maxTemp !== null ? `${maxTemp}°` : "MISSING"} L: {minTemp !== null ? `${minTemp}°` : "MISSING"}
            </h5>
        </div>
        </div>
    );
}
