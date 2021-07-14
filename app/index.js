import clock from "clock";
import document from "document";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { me } from "appbit";
import * as messaging from "messaging";
import * as simpleSettings from "./device-settings";
import Clock from "./clock";
import Battery from "./battery";
import Weather from "./weather";
import Face from "./face";
import Goals from "./goals";
import { modes } from './modes';

// ***** Settings *****
console.log("set up settings");

const settings;

function settingsCallback(data) {
  settings = data;
}

simpleSettings.initialize(settingsCallback);

messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt && evt.data && evt.data.key) {
    settings[evt.data.key] = evt.data.value;
    //console.log(`${evt.data.key} : ${evt.data.value}`); // Good for debugging
    if (evt.data.key === "tempUnit") {
      weather.tempUnit = evt.data.value.selected;
      clockController.weather.updateWeather();
    }
  }
});

// ***** Clock *****
console.log("set up clock");

const dateBox = document.getElementById("dateBox")
const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");
const secondHand = document.getElementById("secondHand");
const hourHandShadow = document.getElementById("hourHandShadow");
const minuteHandShadow = document.getElementById("minuteHandShadow");
const secondHandShadow = document.getElementById("secondHandShadow");
const weatherArc = document.getElementById("weatherArc");
const marks = document.getElementsByClassName("marks");

const statsBox = document.getElementById("statsBox");
const statsArc = document.getElementById("statsArc");
const statsImage = document.getElementById("statsImage");
const clockFace = document.getElementById("clockFace");

var clockController = new Clock(
  dateBox,
  hourHand,
  minuteHand,
  secondHand,
  hourHandShadow,
  minuteHandShadow,
  secondHandShadow
);

// ***** Goals *****
console.log("set up goals");

var goals = new Goals(settings, statsArc, statsImage);

clockController.updateGoals = () => { goals.updateGoals() };

// ***** Battery *****
console.log("set up battery");

var battery = new Battery(settings, statsArc, statsImage);

clockController.updateBattery = () => { battery.updateBattery() };

// ***** Display *****
console.log("set up display");

var face = new Face(settings, marks, clockFace, weatherArc, statsImage, statsBox, statsArc);
face.mode = modes.Weather;
face.goals = goals;
face.battery = battery;

if (display.aodAvailable && me.permissions.granted("access_aod")) {
  // tell the system we support AOD
  display.aodAllowed = true;

  // respond to display change events
  display.addEventListener("change", () => {
    switchDarkMode();

    // Is the display on?
    if (!display.aodActive && display.on) {
      body.start();
      hrm.start();
      clock.granularity = "seconds";
      clockController.weather.updateWeather();
    }
    else {
      body.stop();
      hrm.stop();
      clock.granularity = "minutes";
    }
  });
}
else {
  // respond to display change events
  display.addEventListener("change", () => {
    // Is the display on?
    if (display.on) {
      body.start();
      hrm.start();
      clock.granularity = "seconds";
      clockController.weather.updateWeather();
    }
    else {
      body.stop();
      hrm.stop();
      clock.granularity = "minutes";
    }
  });
}

battery.mode = face.mode;
goals.mode = face.mode;
clockController.updateDisplay = () => { face.updateDisplay() };

// ***** Weather *****
console.log("set up weather");

var weather = new Weather(settings, weatherArc, statsImage);
//weather.tempUnit = settings.tempUnit.selected;
clockController.weather = weather;
weather.mode = face.mode;
face.weather = weather;

// ***** Initialize Body & Heart Rate *****
console.log("initialize body and heart rate");

const body = null;
const hrm = null;
var heartRate = 0;

if (BodyPresenceSensor) {
  body = new BodyPresenceSensor();
  body.start();
  body.addEventListener("reading", () => {
    processBodyPresence();
  });
}

if (HeartRateSensor) {
  hrm = new HeartRateSensor({ frequency: 1 });
  hrm.start();
  hrm.addEventListener("reading", () => {
    processHeartRate();
  });
}

function processBodyPresence() {
  if (display.on && body.present) {
    hrm.start();
  } else {
    hrm.stop();
    if (face.mode === modes.HeartRate) {
      goals.currentCount = 0;
      goals.currentGoal = 200;
      goals.updateGoals();
    }
  }
}

function processHeartRate() {
  if (display.on) {
    heartRate = hrm.heartRate;
    if (face.mode === modes.HeartRate) {
        goals.currentCount = heartRate;
        goals.currentGoal = 200;
        goals.updateGoals();
    }
  }
}

// ***** Event Listeners *****
clockFace.addEventListener("click", (evt) => {
  if(face.darkMode) face.darkMode = false;
  else face.darkMode = true;
  face.switchDarkMode();
});

statsBox.addEventListener("click", (evt) => { face.changeMode(); });
statsImage.addEventListener("click", (evt) => { face.changeMode(); });

// ***** Trigger Updates *****
console.log("start updates");

clockController.updateGoals();
clockController.updateBattery();
clockController.startClock();
