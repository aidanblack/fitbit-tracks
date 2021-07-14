import document from "document";
import { battery } from "power";
import { modes } from './modes';

class Battery {
    settings;
    currentCount;
    currentGoal;
    mode;
    
    constructor(settings, statsArc, statsImage) {
        this.settings = settings;
        this.statsArc = statsArc;
        this.statsImage = statsImage;
    }

    updateBattery() {
        if (this.mode == modes.Battery) {
            this.currentCount = battery.chargeLevel;
            this.currentGoal = 100;

            var statDisplay = this.currentCount / this.currentGoal * 300;
            statDisplay = Math.round(statDisplay);
            if (statDisplay > 300) statDisplay = 300;
            this.statsArc.sweepAngle = statDisplay;
        }

        console.log("Battery Updated");
    }
}

export default Battery;