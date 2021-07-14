import { display } from "display";
import document from "document";
import { modes } from './modes';

class Face {
    settings;
    body;
    hrm;
    mode;
    dateBox;
    darkmode = false;
    goals;
    battery;
    weather;

    constructor(settings, marks, clockFace, weatherArc, statsImage, statsBox, statsArc) {
        this.settings = settings;
        this.marks = marks;
        this.clockFace = clockFace;
        this.weatherArc = weatherArc;
        this.statsImage = statsImage;
        this.statsBox = statsBox;
        this.statsArc = statsArc;
    }

    updateDisplay() {
        if (this.mode === modes.Weather) {
            this.statsArc.style.visibility = "hidden";
            this.weatherArc.style.visibility = "visible";
        }
        else if (this.mode === modes.HeartRate) {
            this.statsArc.style.fill = "#CC2222"; // red
            this.statsImage.href = "heart_rate_36px.png";
        }
        else if (this.mode === modes.Steps) {
            this.statsArc.style.fill = "#EFC12B"; // yellow
            this.statsImage.href = "steps_36px.png";
        }
        else if (this.mode === modes.Distance) {
            this.statsArc.style.fill = "#006EEF"; // blue
            this.statsImage.href = "distance_36px.png";
        }
        else if (this.mode === modes.Floors) {
            this.statsArc.style.fill = "#EF6EEF"; // purple
            this.statsImage.href = "floors_36px.png";
        }
        else if (this.mode === modes.Calories) {
            this.statsArc.style.fill = "#00ccc2"; // teal
            this.statsImage.href = "calories_36px.png";
        }
        else if (this.mode === modes.Zone) {
            this.statsArc.style.fill = "#EA7D1E"; // orange
            this.statsImage.href = "azm_36px.png";
        }
        else if (this.mode === modes.Battery) {
            this.statsArc.style.fill = "#3FD300"; //green
            this.statsImage.href = "battery_36px.png";
        }
        if (this.mode != modes.Weather) {
            this.statsArc.style.visibility = "visible";
            this.weatherArc.style.visibility = "hidden";
        }
    }

    switchDarkMode() {
        if (this.darkMode || (display.aodActive && !display.on)) {
            this.marks.forEach((element) => {
                element.style.fill = "#CCCCCC"
            });
            this.clockFace.style.fill = "#111111";
            this.statsBox.style.fill = "white";
            this.statsBox.style.opacity = 0.1;
        }
        else if(!this.darkMode && !display.aodActive && display.on) {
            this.marks.forEach((element) => {
                element.style.fill = "black"
            });
            this.clockFace.style.fill = "#FFFFF9";
            this.statsBox.style.fill = "#999999";
            this.statsBox.style.opacity = 0.05;
        }
    }
    
    changeMode() {
        console.log(JSON.stringify(modes));
        
        if (this.mode === modes.Battery) {
            this.mode = modes.Weather;
            this.statsArc.style.visibility = "hidden";
            this.weatherArc.style.visibility = "visible";
        }
        else if (this.mode === modes.Weather) {
            this.mode = modes.HeartRate;
            this.statsArc.style.fill = "#CC2222";
            this.statsImage.href = "heart_rate_36px.png";
        }
        else if (this.mode === modes.HeartRate) {
            this.mode = modes.Steps;
            this.statsArc.style.fill = "#EFC12B"; // yellow
            this.statsImage.href = "steps_36px.png";
        }
        else if (this.mode === modes.Steps) {
            this.mode = modes.Distance;
            this.statsArc.style.fill = "#006EEF"; // blue
            this.statsImage.href = "distance_36px.png";
        }
        else if (this.mode === modes.Distance) {
            this.mode = modes.Floors;
            this.statsArc.style.fill = "#EF6EEF"; // purple
            this.statsImage.href = "floors_36px.png";
        }
        else if (this.mode === modes.Floors) {
            this.mode = modes.Calories;
            this.statsArc.style.fill = "#00ccc2"; // teal
            this.statsImage.href = "calories_36px.png";
        }
        else if (this.mode === modes.Calories) {
            this.mode = modes.Zone;
            this.statsArc.style.fill = "#EA7D1E"; // orange
            this.statsImage.href = "azm_36px.png";
        }
        else if (this.mode === modes.Zone) {
            this.mode = modes.Battery;
            this.statsArc.style.fill = "#3FD300"; //green
            this.statsImage.href = "battery_36px.png";
        }
        if (this.mode != modes.Weather) {
            this.statsArc.style.visibility = "visible";
            this.weatherArc.style.visibility = "hidden";
        }

        console.log(this.mode);
        this.battery.mode = `${this.mode}`;
        this.goals.mode = `${this.mode}`;
        this.weather.mode = `${this.mode}`;
        if(this.mode === modes.Battery) this.battery.updateBattery();
        else if(this.mode === modes.Weather) this.weather.updateWeather();
        else this.goals.updateGoals();
    }
    
}

export default Face;