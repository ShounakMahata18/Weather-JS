'use strict'

import {updateWeather, error404} from "./app.js";

const defaultLocation = "#/weather?lat=22.572645&lon=88.363892";

const currentLocation = function () {
    window.navigator.geolocation.getCurrentPosition(res => {
        const {latitude, longitude} = res.coords;
        updateWeather(`lat=${latitude}`, `lon=${longitude}`);
    }, err => {
        window.location.hash = defaultLocation;
    });
}


/**
 * 
 * @param {string} query Search query 
 */
const searchedLocation = (query) => {
    updateWeather(...query.split("&"));
}
// //updateWeather("22.572645", "88.363892")

const routes = new Map([
    ["/current-location", currentLocation],
    ["/weather",searchedLocation]
]);

const checkHash = () => {
    const requestURL = window.location.hash.slice(1);

    const [route, query] = requestURL.includes ? requestURL.split("?") : [requestURL];
    
    routes.get(route) ? routes.get(route)(query) : error404();
}

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function() {
    if(!window.location.hash) {
        window.location.hash = "#/current-location";
    }
    else{
        checkHash();
    }
});