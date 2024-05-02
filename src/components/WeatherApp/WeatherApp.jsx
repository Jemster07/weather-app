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

    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [weatherIcon, setWeatherIcon] = useState(cloud_icon);
    const [humidity, setHumidity] = useState();
    const [wind, setWind] = useState();
    const [temp, setTemp] = useState();
    const [location, setLocation] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [initialVisit, setInitialVisit] = useState(true);
    const [permission, setPermission] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        });
        
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') {      
                if (latitude !== undefined && latitude !== null && longitude !== undefined && longitude !== null) {
                    const getLocalWeather = async () => {
                        let url = `${process.env.REACT_APP_API_URL}/weather?lat=${latitude}&lon=${longitude}&units=Imperial&appid=${process.env.REACT_APP_API_KEY}`;
                        let response = await fetch(url);
                        let data = await response.json();
                        setHumidity(data.main.humidity);
                        setWind(Math.floor(data.wind.speed));
                        setTemp(Math.floor(data.main.temp));
                        setLocation(data.name);
                    }
                    getLocalWeather();

                    console.log("status is granted");
                    setPermission(true);    
                }        
            }
        }); 
        
    }, [latitude, longitude]);

    function handleSubmit(event) {
        event.preventDefault();
        search();
    };

    function permissionCheck() {
        if (permission === true) {
            setInitialVisit(false);
        } else {
            console.log("button clicked and location permission not granted");
        }
    };

    const search = async () => {        
        if (initialVisit === true) {
            setInitialVisit(false);
        }
        
        if (searchQuery === undefined || searchQuery === "") {
            return 0;
        } else {
            let zipURL = `${process.env.REACT_APP_GEOCODE_API_URL}/zip?zip=${searchQuery},US&appid=${process.env.REACT_APP_API_KEY}`;
            let zipResponse = await fetch(zipURL);
            let zipData = await zipResponse.json();
            let lat = zipData.lat;
            let lon = zipData.lon;

            let coordURL = `${process.env.REACT_APP_API_URL}/weather?lat=${lat}&lon=${lon}&units=Imperial&appid=${process.env.REACT_APP_API_KEY}`;
            let coordResponse = await fetch(coordURL);
            let data = await coordResponse.json();

            setHumidity(data.main.humidity);
            setWind(Math.floor(data.wind.speed));
            setTemp(Math.floor(data.main.temp));
            setLocation(data.name);

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
        <div className="app">
            {initialVisit ?
                <div className="container">
                    <div className="user-prompt">Enter a ZIP code or use current location:</div>

                    <div className="search-field">
                        <form onSubmit={handleSubmit}>
                            <input className="zipInput" type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} pattern="[0-9]{5}" placeholder="ZIP code search" required />
                            <button className="search-icon" type="submit">
                                <img src={search_icon} alt="search button" />
                            </button>
                        </form>
                    </div>

                    <button onClick={permissionCheck}>Use Current Location</button>
                    <div className="loader"></div>
                </div>

            :                
    
                <div className="container">
                    <div className="weather-image">
                        <img src={weatherIcon} alt="" />
                    </div>
                    <div className="weather-temp">{temp}&deg;F</div>
                    <div className="weather-location">{location}</div>
                    <div className="data-container">
                        <div className="element">
                            <img src={humidity_icon} alt="" className="icon" />
                            <div className="data">
                                <div className="humidity-percent">{humidity}%</div>
                                <div className="text">Humidity</div>
                            </div>
                        </div>
                        <div className="element">
                            <img src={wind_icon} alt="" className="icon" />
                            <div className="data">
                                <div className="wind-rate">{wind} mph</div>
                                <div className="text">Wind Speed</div>
                            </div>
                        </div>
                    </div>
                    <div className="search-field">
                        <form onSubmit={handleSubmit}>
                            <input className="zipInput" type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} pattern="[0-9]{5}" placeholder="ZIP code search" required />
                            <button className="search-icon" type="submit">
                                <img src={search_icon} alt="search button" />
                            </button>
                        </form>
                    </div>
                </div>
            
            }           
        </div>
    )
}

export default WeatherApp