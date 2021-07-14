import clock from "clock";

class Clock {
    updateDisplay = function() {};
    updateBattery = function() {};
    updateGoals = function() {};
    weather;

    constructor(dateBox,
        hourHand, minuteHand, secondHand,
        hourHandShadow, minuteHandShadow, secondHandShadow) {
        try {
            this.dateBox = dateBox;
            this.hourHand = hourHand;
            this.minuteHand = minuteHand;
            this.secondHand = secondHand;
            this.hourHandShadow = hourHandShadow;
            this.minuteHandShadow = minuteHandShadow;
            this.secondHandShadow = secondHandShadow;

            clock.granularity = "seconds";
        }
        catch (err) {
            console.log(err);
        }
    }

    updateTime(now) {
        let hours = now.getHours();
        hours = hours % 12 || 12;
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let currentTimestamp = new Date(now).getTime();

        this.hourHandShadow.groupTransform.rotate.angle = ((360 / 12) * hours) + ((360 / 12 / 60) * minutes);
        this.hourHand.groupTransform.rotate.angle = ((360 / 12) * hours) + ((360 / 12 / 60) * minutes);
        this.minuteHandShadow.groupTransform.rotate.angle = (360 / 60) * minutes + ((360 / 60 / 60) * seconds);
        this.minuteHand.groupTransform.rotate.angle = (360 / 60) * minutes + ((360 / 60 / 60) * seconds);
        this.secondHandShadow.groupTransform.rotate.angle = seconds * 6;
        this.secondHand.groupTransform.rotate.angle = seconds * 6;
    
        if((clock.granularity === "minutes"  && (minutes + 5) % 5 === 0) || seconds === 0) this.updateGoals();
        if((clock.granularity === "minutes"  && (minutes + 5) % 5 === 0) || seconds === 0) this.updateBattery();
        if(this.weather.timestamp === 0 || currentTimestamp - this.weather.timestamp > (30 * 60 * 1000)) this.weather.updateWeather();
        //console.log(`${this.weather.timestamp} : ${currentTimestamp}`);

        this.updateDisplay();
    }

    updateDate(date) {
        let dateText = date.toLocaleString('default', { month: 'short' }).substring(4, 10);
        this.dateBox.text = dateText;
    }

    // ***** Add event handler *****
    startClock() {
        clock.ontick = (evt) => {
            let now = evt.date;
            this.updateDate(now);
            this.updateTime(now);
        }
    }
}

export default Clock;
