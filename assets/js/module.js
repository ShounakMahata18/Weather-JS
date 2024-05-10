'use strict';

export const weekDaysNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

export const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

/**
 * 
 * @param {number} dateUnix Unix date in second
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Date String format: "Sunday 10, Jan";
 */
export const getDate = (dateUnix, timezone) => {
    const date = new Date((dateUnix + timezone) * 1000);
    const weekDaysName = weekDaysNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];

    return `${weekDaysName} ${date.getUTCDate()}, ${monthName}`;
}

/**
 * 
 * @param {number} timeUnix Unix date in second
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Date String format: "HH:MM AM/PM";
 */
export const getTime = (timeUnix, timezone) => {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    return `${hours % 12 || 12}:${minutes} ${period}`;
}

/**
 * 
 * @param {number} timeUnix Unix date in second
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Date String format: "HH AM/PM";
 */
export const getHours = (timeUnix, timezone) => {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const period = hours >= 12 ? "PM" : "AM";

    return `${hours % 12 || 12} ${period}`;
}

/**
 * 
 * @param {number} mps Meter Per Second 
 * @returns {number} Kilometer Per Hour
 */
export const mps_to_kmh = (mps) => {
    const mph = mps * 3600;
    const kph = mph / 1000;
    return kph;
}

export const aqiText = {
    1: {
        level: "Good",
        message: "Air quality is considered satisfectory, and air pollution poses little or no risk"
    },
    2: {
        level: "Fair",
        message: "Air quality is accetable; hovever, for some pollutants there may be moderate health concern for very small number of people who are unusually sensetive to air pollution."
    },
    3: {
        level: "Moderate",
        message: "Members of sensetive group can experience health effects. The general public is not likely to get affected. Avoid going outdoor."
    },
    4: {
        level: "Poor",
        message: "Everyone may begin to experience health effects; member of sensetive group may may experience hore serious health effect. Everyone are instructed to put a air pollution mask."
    },
    5: {
        level: "Very Poor",
        message: "Pollution is in extreme lavel. The entire population is likely to get affected. Everyone are suggested for medical checkup."
    }
}
