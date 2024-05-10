'use strict';

import { fetchData, url } from "./api.js";
import * as module from "./module.js";

/**
 * Add Event listner on multiple elements
 * @param {NodeList} elements Elements node array
 * @param {String} eventType Event typle E.g. : "click", "mouseover" etc
 * @param {Function} callback Callback function
 */
const addEventOnElement = (elements, eventType, callback) => {
    for (const element of elements) {
        element.addEventListener(eventType, callback);
    }
}

/**
 * Toggle search in mobile devices
 */

const searchView = document.querySelector("[data-search-wiew]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchView.classList.toggle("active");

addEventOnElement(searchTogglers, "click", toggleSearch);

/**
 * Search Intregration
 */

const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener("input", () => {
    searchTimeout ?? clearTimeout(searchTimeout);

    if (!searchField.value) {
        searchResult.classList.remove("active");
        searchResult.innerHTML = "";
        searchField.classList.remove("searching");
    }
    else {
        searchField.classList.add("searching");
    }

    if (searchField.value) {
        searchTimeout = setTimeout(() => {
            fetchData(url.geo(searchField.value), (locations) => {
                searchField.classList.remove("searching");
                searchResult.classList.add("active");
                searchResult.innerHTML = `
                <ul class="view-list" data-search-list>
                </ul>
                `;

                const /** {NodeList} | [] */ items = [];

                for (const { name, lat, lon, country, state } of locations) {
                    const searchItem = document.createElement("li");
                    searchItem.classList.add("view-item");

                    searchItem.innerHTML = `
                        <span class="m-icon">Location_on</span>
                        
                        <div>
                                <p class="item-title">${name}</p>

                                <p class="label-2 item-subtitle">${state || ""}, ${country}</p>
                            </div>

                            <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggle></a>
                            `;

                    searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggle]"));
                }

                addEventOnElement(items, "click", () => {
                    toggleSearch();
                    searchResult.classList.remove("active");
                });
            });
        }, searchTimeoutDuration);
    }
});




const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBTN = document.querySelector("[data-current-location-btn]");
const errorContainer = document.querySelector("[data-error-content]");

/**
 * Render all weather data in html
 * 
 * @param {number} lat latitude
 * @param {number} lon longitude
 */

export const updateWeather = (lat, lon) => {
    loading.style.display = "grid";
    container.style.overflowY = "hidden";
    container.classList.remove("fade-in");
    errorContainer.style.display = "none";

    const currentWeatherSection = document.querySelector("[data-current-weather]");
    const highlightSection = document.querySelector("[data-highlights]");
    const hourlySection = document.querySelector("[data-hourly-forecast]");
    const forecastSection = document.querySelector("[data-5-day-forecast]");

    currentWeatherSection.innerHTML = ``;
    highlightSection.innerHTML = ``;
    hourlySection.innerHTML = ``;
    forecastSection.innerHTML = ``;

    if (window.location.hash === "#/current-location") {
        currentLocationBTN.setAttribute("disabled", "");
    }
    else {
        currentLocationBTN.removeAttribute("disabled");
    }


    // //     /**
    // //      * Current Weather
    // //      */

    fetchData(url.currentWeather(lat, lon), (currentWeather) => {

        const {
            weather,
            dt: dateUnix,
            sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
            main: { temp, feels_like, pressure, humidity },
            visibility,
            timezone,
            name
        } = currentWeather;

        const [{ description, icon }] = weather;
        const place = name;

        const card = document.createElement("div");
        card.classList.add("card", "card-lg", "current-weather-card");
        card.innerHTML = `

            <h2 class="title-2 card-title">NOW</h2>

            <div class="wrapper">
                <p class="heading">${parseInt(temp)}&deg<sup>c</sup></p>

                <img src="./assets/images/weather_icons/${icon}.png" width="64" height="64" alt="${description}" class="weather-icon">
            </div>

            <p class="nody-3">${description}</p>


            <ul class="meta-list">

                <li class="meta-item">
                    <span class="m-icon">calendar_today</span>

                    <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
                </li>

                <li class="meta-item">
                    <span class="m-icon">location_on</span>

                    <p class="title-3 meta-text" data-location>Kolkata, WB</p>
                </li>

            </ul>

        `;

        fetchData(url.reverseGeo(lat, lon), ([{ name, country }]) => {
            card.querySelector("[data-location]").innerHTML = `${place}, ${name}, ${country}`;
        })

        currentWeatherSection.appendChild(card);


        /**
         * Todays highlight
         */

        fetchData(url.airPollution(lat, lon), (airPollution) => {
            const [{
                main: { aqi },
                components: { pm2_5, pm10, co, o3, so2, nh3, no, no2 }
            }] = airPollution.list;
            const card = document.createElement("div");
            card.classList.add("card", "card-lg");

            card.innerHTML = `
                <h2 class="title-2" id="highlights-label">Todays Highlights</h2>

                <div class="highlight-list">

                    <div class="card card-sm highlight-card one">

                        <h3 class="title-3">Air Quality Index</h3>

                        <div class="wrapper">
                            <span class="m-icon">air</span>
                            <ul class="card-list">
                                <li class="card-item">
                                    <p class="title-1">${pm2_5.toPrecision(3)}</p>
                                    
                                    <p class="label-1">PM<sub>2.5</sub></p>
                                </li>
                                <li class="card-item">
                                    <p class="title-1">${pm10.toPrecision(3)}</p>
                                    
                                    <p class="label-1">PM<sub>10</sub></p>
                                </li>
                                <li class="card-item">
                                    <p class="title-1">${co.toPrecision(3)}</p>
                                    
                                    <p class="label-1">CO</p>
                                </li>
                                <li class="card-item">
                                    <p class="title-1">${o3.toPrecision(3)}</p>
                                    
                                    <p class="label-1">O<sub>3</sub></p>
                                </li>
                                <li class="card-item">
                                    <p class="title-1">${so2.toPrecision(3)}</p>
                                    
                                    <p class="label-1">SO<sub>2</sub></p>
                                </li>
                                <li class="card-item">
                                    <p class="title-1">${nh3.toPrecision(3)}</p>
                                    
                                    <p class="label-1">NH<sub>3</sub></p>
                                </li>
                                <li class="card-item">
                                    <p class="title-1">${no.toPrecision(3)}</p>
                                    
                                    <p class="label-1">NO</p>
                                </li>
                                <li class="card-item">
                                    <p class="title-1">${no2.toPrecision(3)}</p>
                                    
                                    <p class="label-1">NO<sub>2</sub></p>
                                </li>

                            </ul>
                        </div>

                        <span class="badge aqi-${aqi} label-${aqi}" title="${module.aqiText[aqi].message}">${module.aqiText[aqi].level}</span>

                    </div>

                    <div class="card card-sm highlight-card two">

                        <h3 class="title-3">Sunrise and Sunset</h3>

                        <div class="card-list">

                            <div class="card-item">
                                <span class="m-icon">clear_day</span>

                                <div>
                                    <p class="label-1">Sunrise</p>

                                    <p class="title-1">${module.getTime(sunriseUnixUTC, timezone)}</p>
                                </div>
                            </div>

                            <div class="card-item">
                                <span class="m-icon">clear_night</span>

                                <div>
                                    <p class="label-1">Sunset</p>

                                    <p class="title-1">${module.getTime(sunsetUnixUTC, timezone)}</p>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div class="card card-sm highlight-card">

                        <h3 class="title-3">Humidity</h3>

                        <div class="wrapper">
                            <span class="m-icon">humidity_percentage</span>

                            <p class="title-1">${humidity}<sub>%</sub></p>
                        </div>

                    </div>

                    <div class="card card-sm highlight-card">

                        <h3 class="title-3">Pressure</h3>

                        <div class="wrapper">
                            <span class="m-icon">airwave</span>

                            <p class="title-1">${pressure}<sub>hPa</sub></p>
                        </div>

                    </div>

                    <div class="card card-sm highlight-card">

                        <h3 class="title-3">Visibility</h3>

                        <div class="wrapper">
                            <span class="m-icon">visibility</span>

                            <p class="title-1">${visibility / 1000}<sub>Km</sub></p>
                        </div>

                    </div>

                    <div class="card card-sm highlight-card">

                        <h3 class="title-3">Feels Like</h3>

                        <div class="wrapper">
                            <span class="m-icon">thermostat</span>

                            <p class="title-1">${parseInt(feels_like)}&deg<sup>c</sup></p>
                        </div>

                    </div>

                </div>
            `;

            highlightSection.appendChild(card);
        });


        /**
         * 24 Hr Forecast
         */

        fetchData(url.forecast(lat, lon), (forecast) => {
            const {
                list: forecastList,
                city: { timezone }
            } = forecast;
            
            hourlySection.innerHTML = `
            <h2 class="title-2">Today at</h2>
            
            <div class="slider-container">
            <ul class="slider-list" data-temp>
            </ul>
            
            <ul class="slider-list" data-wind>
            </ul>
            </div>
            
            `;
            
            for (const [index, data] of forecastList.entries()) {
                if (index > 7) break;
                
                const {
                    dt: dateTimeUnix,
                    main: { temp },
                    weather,
                    wind: { deg: windDirection, speed: windSpeed }
                } = data;
                
                const [{ icon, description }] = weather;
                
                const tempLi = document.createElement("li");
                tempLi.classList.add("slider-item");
                tempLi.innerHTML = `
                    <div class="card card-sm slider-card">
                    
                    <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>
                    
                    <img src="./assets/images/weather_icons/${icon}.png" width="48" height="48" loading="lazy" alt="${description}" class="weather-icon" title="${description}">
                    
                    <p class="body-3">${parseInt(temp)}&deg;</p>
                    
                    </div>
                `;

                hourlySection.querySelector("[data-temp]").appendChild(tempLi);
                
                const windLi = document.createElement("li");
                windLi.classList.add("slider-item");
                
                windLi.innerHTML = `
                    <div class="card card-sm slider-card">
                    
                        <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>
                        
                        <img src="./assets/images/weather_icons/direction.png" width="48" height="48" alt="" class="weather-icon" style="transform: rotate(${windDirection - 180}deg)">
                    
                        <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/hr</p>
                        
                        
                    </div>
                `;
                
                hourlySection.querySelector("[data-wind]").append(windLi);
                    
            }
        

        /**
         * 5 day forecast
         */

        forecastSection.innerHTML = `
            <h2 class="title-2" id="forecast-label">5 Days of Forecast</h2>

                <div class="card card-lg forecast-card">
                    <ul data-forecast-list>
                    </ul>
                </div>
        `;

        for(let i = 7, len = forecastList.length; i < len; i+=8){
            const {
                main: {temp_max},
                weather,
                dt_txt
            } = forecastList[i];
            const [{icon, description}] = weather;
            const date = new Date(dt_txt);

            const dayli = document.createElement("li");
            dayli.classList.add("card-item");

            dayli.innerHTML = `
                <div class="icon-wrapper">
                    <img src="./assets/images/weather_icons/${icon}.png" width="36" height="36" alt="${description}" class="weather-icon" title="${description}">

                    <span class="span">
                        <p class="title-2">${parseInt(temp_max)}&deg;<sup>c</sup></p>
                    </span>
                </div>

                <p class="label-1">${date.getDate()} ${module.monthNames[date.getMonth()]}</p>
                <p class="label-1">${module.weekDaysNames[date.getUTCDay()]}</p>
            `;
            
            forecastSection.querySelector("[data-forecast-list]").appendChild(dayli);

            }

            loading.style.display = "none";
            container.style.overflowY = "overlay";
            container.classList.add("fade-in");
        });
    });

}

export const error404 = () => {
        errorContainer.style.display = "flex";
}
