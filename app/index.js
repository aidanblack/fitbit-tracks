import clock from "clock";
import document from "document";
import { me } from "appbit";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { today } from "user-activity";
import { goals } from "user-activity";
import { battery } from "power";
import { display } from "display";
import * as weather from "fitbit-weather/app";

clock.granularity = "seconds";

const clockFace = document.getElementById("clockFace");
const dateBox = document.getElementById("dateBox")
const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");
const secondHand = document.getElementById("secondHand");
const hourHandShadow = document.getElementById("hourHandShadow");
const minuteHandShadow = document.getElementById("minuteHandShadow");
const secondHandShadow = document.getElementById("secondHandShadow");
const statsBox = document.getElementById("statsBox");
const statsArc = document.getElementById("statsArc");
const weatherArc = document.getElementById("weatherArc");
const statsImage = document.getElementById("statsImage");
const marks = document.getElementsByClassName("marks");

const hrm;
var heartRate = 0;
if (HeartRateSensor) {
    hrm = new HeartRateSensor({ frequency: 1 });
    hrm.addEventListener("reading", () => {
        heartRate = hrm.heartRate;
    });
    hrm.start();
}
var weatherResult;
var statDisplay = 0;
var currentCount = 0;
var currentGoal = 1;
var darkMode = false;

const modes = {
    Battery: "Battery",
    Weather: "Weather",
    HeartRate: "HeartRate",
    Steps: "Steps",
    Distance: "Distance",
    Floors: "Floors",
    Calories: "Calories",
    Zone: "Zone"
};
var mode = modes.Weather;

function switchDarkMode() {
    if (darkMode || (display.aodActive && display.off)) {
        clockFace.style.fill = "#111111";
        statsBox.style.fill = "white";
        statsBox.style.opacity = 0.1;
        marks.forEach((element) => {
            element.style.fill = "#FFFFF9"
        });
    }
    else if(!darkMode && !display.aodActive && display.on) {
        clockFace.style.fill = "#FFFFF9";
        statsBox.style.fill = "#999999";
        statsBox.style.opacity = 0.05;
        marks.forEach((element) => {
            element.style.fill = "black"
        });
    }
}

clockFace.addEventListener("click", (evt) => {
    if(darkMode) darkMode = false;
    else darkMode = true;
    switchDarkMode();
});

if (display.aodAvailable && me.permissions.granted("access_aod")) {
    // tell the system we support AOD
    display.aodAllowed = true;

    // respond to display change events
    display.addEventListener("change", () => {
        switchDarkMode();
        // Is AOD inactive and the display is on?
        if (!display.aodActive && display.on) {
            hrm.start();
            clock.granularity = "seconds";

            let aod = document.getElementsByClassName("aod");
            aod.forEach((element) => {
                element.style.visibility = "visible";
            });
        }
        else {
            hrm.stop();
            clock.granularity = "minutes";

            let aod = document.getElementsByClassName("aod");
            aod.forEach((element) => {
                element.style.visibility = "hidden";
            });
        }
    });
}

clock.ontick = (evt) => {
    let now = evt.date;
    let dateText = now.toLocaleString('default', { month: 'short' }).substring(4, 10);

    dateBox.text = dateText.toUpperCase();
    let hours = now.getHours();
    hours = hours % 12 || 12;
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    hourHandShadow.groupTransform.rotate.angle = ((360 / 12) * hours) + ((360 / 12 / 60) * minutes);
    hourHand.groupTransform.rotate.angle = ((360 / 12) * hours) + ((360 / 12 / 60) * minutes);
    minuteHandShadow.groupTransform.rotate.angle = (360 / 60) * minutes + ((360 / 60 / 60) * seconds);
    minuteHand.groupTransform.rotate.angle = (360 / 60) * minutes + ((360 / 60 / 60) * seconds);
    secondHandShadow.groupTransform.rotate.angle = seconds * 6;
    secondHand.groupTransform.rotate.angle = seconds * 6;

    if (me.permissions.granted("access_activity")) updateStats(mode);
}

statsBox.addEventListener("click", (evt) => { changeMode(); });
statsImage.addEventListener("click", (evt) => { changeMode(); });

function changeMode() {
    if (mode == modes.Battery) {
        mode = modes.Weather;
        statsArc.style.visibility = "hidden";
        weatherArc.style.visibility = "visible";
        statsImage.href = "";
    }
    else if (mode == modes.Weather) {
        mode = modes.HeartRate;
        statsArc.style.fill = "#CC2222";
        statsImage.href = "heart_rate_36px.png";
    }
    else if (mode == modes.HeartRate) {
        mode = modes.Steps;
        statsArc.style.fill = "#EFC12B"; // yellow
        statsImage.href = "steps_36px.png";
    }
    else if (mode == modes.Steps) {
        mode = modes.Distance;
        statsArc.style.fill = "#006EEF"; // blue
        statsImage.href = "distance_36px.png";
    }
    else if (mode == modes.Distance) {
        mode = modes.Floors;
        statsArc.style.fill = "#EF6EEF"; // purple
        statsImage.href = "floors_36px.png";
    }
    else if (mode == modes.Floors) {
        mode = modes.Calories;
        statsArc.style.fill = "#00ccc2"; // teal
        statsImage.href = "calories_36px.png";
    }
    else if (mode == modes.Calories) {
        mode = modes.Zone;
        statsArc.style.fill = "#EA7D1E"; // orange
        statsImage.href = "azm_36px.png";
    }
    else if (mode == modes.Zone) {
        mode = modes.Battery;
        statsArc.style.fill = "#3FD300"; //green
        statsImage.href = "battery_36px.png";
    }
    if (mode != modes.Weather) {
        statsArc.style.visibility = "visible";
        weatherArc.style.visibility = "hidden";
    }
}

function processWeather(weather) {
    weatherResult = weather;

    currentCount = Math.round(weatherResult.temperatureF);
    currentGoal = 120;
    var weatherCode = weatherResult.conditionCode;
    var dayNight;
    if (weatherResult.timestamp > weatherResult.sunrise && weatherResult.timestamp < weatherResult.sunset) dayNight = "d";
    else dayNight = "n";
    statsImage.href = `weather/${weatherCode}${dayNight}.png`;

    statDisplay = currentCount / currentGoal * 360;
    statDisplay = Math.round(statDisplay);
    if (statDisplay > 360) statDisplay = 360;
    weatherArc.sweepAngle = statDisplay;
}

function updateStats(mode) {
    if (mode == modes.Battery) {
        currentCount = battery.chargeLevel;
        currentGoal = 100;
    }

    if (mode == modes.Weather) {
        weather.fetch(30 * 60 * 1000) // return the cached value if it is less than 30 minutes old 
            .then(weather => processWeather(weather))
            .catch(error => console.log(JSON.stringify(error)));
    }

    if (mode == modes.HeartRate) {
        currentCount = heartRate;
        currentGoal = 200;
    }

    if (mode == modes.Steps) {
        currentCount = today.adjusted.steps;
        currentGoal = goals.steps;
    }

    if (mode == modes.Distance) {
        currentCount = today.adjusted.distance;
        currentGoal = goals.distance;
    }

    if (mode == modes.Floors) {
        currentCount = today.adjusted.elevationGain;
        currentGoal = goals.elevationGain;
    }

    if (mode == modes.Calories) {
        currentCount = today.adjusted.calories;
        currentGoal = goals.calories;
    }

    if (mode == modes.Zone) {
        currentCount = today.adjusted.activeZoneMinutes.total;
        currentGoal = goals.activeZoneMinutes.total;
    }

    if (mode != modes.Weather) {
        statDisplay = currentCount / currentGoal * 300;
        statDisplay = Math.round(statDisplay);
        if (statDisplay > 300) statDisplay = 300;
        statsArc.sweepAngle = statDisplay;
    }
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}