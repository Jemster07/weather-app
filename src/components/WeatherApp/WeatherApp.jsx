import React, { useEffect, useState } from 'react';
import './WeatherApp.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const WeatherApp = () => {

    const [latitude, setLatitude] = useState([]);
    const [longitude, setLongitude] = useState([]);
    const [weatherIcon, setWeatherIcon] = useState(cloud_icon);
    const [humidity, setHumidity] = useState([]);
    const [wind, setWind] = useState([]);
    const [temp, setTemp] = useState([]);
    const [location, setLocation] = useState([]);

    useEffect(() => {
        let ignore = false;

        async function startFetching() {

            if (!ignore) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                });

                let url = `${process.env.REACT_APP_API_URL}/weather?lat=${latitude}&lon=${longitude}&units=Imperial&appid=${process.env.REACT_APP_API_KEY}`;
                let response = await fetch(url);
                let data = await response.json();

                setHumidity(data.main.humidity);
                setWind(Math.floor(data.wind.speed));
                setTemp(Math.floor(data.main.temp));
                setLocation(data.name);
            }
        }

        startFetching();

        return () => {
            ignore = true;
        };
    }, []);

    const search = async () => {
        const element = document.getElementsByClassName("cityInput");
        const humidity = document.getElementsByClassName("humidity-percent");
        const wind = document.getElementsByClassName("wind-rate");
        const temp = document.getElementsByClassName("weather-temp");
        const location = document.getElementsByClassName("weather-location");

        if (element[0].value === "") {
            return 0;
        } else {
            let url = `${process.env.REACT_APP_API_URL}/weather/?q=${element[0].value}&units=Imperial&appid=${process.env.REACT_APP_API_KEY}`;
            let response = await fetch(url);
            let data = await response.json();

            humidity[0].innerHTML = `${data.main.humidity} %`;
            wind[0].innerHTML = `${Math.floor(data.wind.speed)} mph`;
            temp[0].innerHTML = `${Math.floor(data.main.temp)}&deg;F`;
            location[0].innerHTML = data.name;

            if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
                setWeatherIcon(clear_icon);
            }
            else if (data.weather[0].icon === "02d" || data.weather[0].icon === "02n" || data.weather[0].icon === "03d" || data.weather[0].icon === "03n" || data.weather[0].icon === "04d" || data.weather[0].icon === "04n") {
                setWeatherIcon(cloud_icon);
            }
            else if (data.weather[0].icon === "09d" || data.weather[0].icon === "09n" || data.weather[0].icon === "50d" || data.weather[0].icon === "50n") {
                setWeatherIcon(drizzle_icon);
            }
            else if (data.weather[0].icon === "10d" || data.weather[0].icon === "10n" || data.weather[0].icon === "11d" || data.weather[0].icon === "11n") {
                setWeatherIcon(rain_icon);
            }
            else if (data.weather[0].icon === "13d" || data.weather[0].icon === "13n") {
                setWeatherIcon(snow_icon);
            }
            else {
                setWeatherIcon(cloud_icon);
            }
        }
    }

    return (
        <div className="container">

            <div className="top-bar">
                <input type="text" className="cityInput" placeholder="search" />
                <div className="search-icon" onClick={() => { search() }}>
                    <img src={search_icon} alt="" />
                </div>
            </div>

            <div className="weather-image">
                <img src={weatherIcon} alt="" />
            </div>
            <div className="weather-temp">{temp}</div>
            <div className="weather-location">{location}</div>
            <div className="data-container">

                <div className="element">
                    <img src={humidity_icon} alt="" className="icon" />
                    <div className="data">
                        <div className="humidity-percent">{humidity}</div>
                        <div className="text">Humidity</div>
                    </div>
                </div>

                <div className="element">
                    <img src={wind_icon} alt="" className="icon" />
                    <div className="data">
                        <div className="wind-rate">{wind}</div>
                        <div className="text">Wind Speed</div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default WeatherApp