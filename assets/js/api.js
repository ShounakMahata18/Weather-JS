'use strict';

const api_key = "5296258a1bcd835e855e6d568b8ac803";

/**
 * 
 * @param {string} URL Api URL
 * @param {Function} callback Callback function
 */

export const fetchData = (URL, callback) => {
    fetch(`${URL}&appid=${api_key}`)
        .then(res => res.json())
        .then(data => callback(data));
}

export const url = {
    /**
     * 
     * @param {float} lat Latitude
     * @param {float} lon Longitude
     * @returns {string} Base URL String
     */
    currentWeather(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`;
    },
    /**
     * 
     * @param {float} lat Latitude
     * @param {float} lon Longitude
     * @returns {string} Base URL String
     */
    forecast(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`;
    },
    /**
     * 
     * @param {float} lat Latitude
     * @param {float} lon Longitude
     * @returns {string} Base URL String
     */
    airPollution(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`;
    },
    /**
     * 
     * @param {float} lat Latitude 
     * @param {float} lon Longitude
     * @returns {string} Base URL String
     */
    reverseGeo(lat, lon) {
        return `https://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`;
    },
    /**
     * 
     * @param {string} query Search query E.g: "City Name", "State Code", "Country Code" 
     * @returns {string} Base URL String
     */
    geo(query) {
        return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
    }
}