import React, { useEffect, useState } from 'react';
import './WeatherApp.css';
import search_icon from '../assets/search.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const WeatherApp = () => {

    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [weatherIcon, setWeatherIcon] = useState();
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
                        setWeatherIcon(`${process.env.REACT_APP_ICON_URL}/${data.weather[0].icon}@2x.png`);
                        setLocation(data.name);
                    }
                    getLocalWeather();
                    setTimeout(setPermission(true), 2000);    
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
            console.log("Button clicked but location fetch incomplete");
        }
    };

    const search = async () => {            
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
            setWeatherIcon(`${process.env.REACT_APP_ICON_URL}/${data.weather[0].icon}@2x.png`);
            setLocation(data.name);
        }

        if (initialVisit === true) {
            setTimeout(setInitialVisit(false), 2000);
        }
    }

    return (
        <div className="app">
            {initialVisit ?
                <div className="landing-page">
                    <div className="search-field">
                        {location === undefined ?
                            <button disabled className="current-location-button">
                                <div className="loader"></div>
                            </button>
                        :
                            <button className="current-location-button" onClick={permissionCheck}>
                                <p>Use Current Location</p>
                            </button>
                        }                       

                        <div className="prompt-text">- OR -</div>

                        <form onSubmit={handleSubmit}>
                            <input className="zipInput" type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} pattern="[0-9]{5}" placeholder="ZIP code search" required />
                            <button className="search-button" type="submit">
                                <img src={search_icon} alt="search button" />
                            </button>
                        </form>
                    </div>
                </div>
            :                   
                <div className="result">
                    <figure className="weather-image">
                        <img src={weatherIcon} alt="" />
                    </figure>
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
                            <button className="search-button" type="submit">
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