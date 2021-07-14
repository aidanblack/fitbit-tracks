import * as weather from 'fitbit-weather/app';
import { modes } from './modes';

class Weather {
    timestamp = 0;

    settings;
    currentCount;
    currentGoal;
    mode;
    
    constructor(settings, weatherArc, statsImage) {
        this.settings = settings;
        this.weatherArc = weatherArc;
        this.statsImage = statsImage;
    }

    processWeather(weather) {
        var weatherResult = weather;
        if (this.mode == modes.Weather) {
            weatherResult = weatherResult;

            this.currentCount = Math.round(weatherResult.temperatureF);
            this.currentGoal = 120;

            var weatherCode = weatherResult.conditionCode;
            var dayNight;
            if (weatherResult.timestamp > weatherResult.sunrise && weatherResult.timestamp < weatherResult.sunset) dayNight = "d";
            else dayNight = "n";
            this.statsImage.href = `weather/${weatherCode}${dayNight}.png`;
        
            var statDisplay = this.currentCount / this.currentGoal * 360;
            statDisplay = Math.round(statDisplay);
            if (statDisplay > 360) statDisplay = 360;
            this.weatherArc.sweepAngle = statDisplay;
            this.timestamp = weatherResult.timestamp;

            console.log("Weather Updated");
        }
    }

    updateWeather() {
        weather.fetch(30 * 60 * 1000) // return the cached value if it is less than 30 minutes old 
        .then(weather => this.processWeather(weather))
        .catch(error => console.log(JSON.stringify(error)));
    }
}
  
export default Weather;
