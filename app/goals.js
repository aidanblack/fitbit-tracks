import document from "document";
import { me } from "appbit";
import { today } from "user-activity";
import { goals } from "user-activity";
import { modes } from './modes';

class Goals {
    settings;
    currentCount;
    currentGoal;
    mode;
    
    constructor(settings, statsArc, statsImage) {
        this.settings = settings;
        this.statsArc = statsArc;
        this.statsImage = statsImage;
    }

    updateGoals() {
        if (me.permissions.granted("access_activity")) {
        
            if (this.mode === modes.Steps) {
                this.currentCount = today.adjusted.steps;
                this.currentGoal = goals.steps;
            }
        
            if (this.mode === modes.Distance) {
                this.currentCount = today.adjusted.distance;
                this.currentGoal = goals.distance;
            }
        
            if (this.mode === modes.Floors) {
                this.currentCount = today.adjusted.elevationGain;
                this.currentGoal = goals.elevationGain;
            }
        
            if (this.mode === modes.Calories) {
                this.currentCount = today.adjusted.calories;
                this.currentGoal = goals.calories;
            }
        
            if (this.mode === modes.Zone) {
                this.currentCount = today.adjusted.activeZoneMinutes.total;
                this.currentGoal = goals.activeZoneMinutes.total;
            }
        
            if (this.mode != modes.Weather && this.mode != modes.Battery) {
                var statDisplay = this.currentCount / this.currentGoal * 300;
                statDisplay = Math.round(statDisplay);
                if (statDisplay > 300) statDisplay = 300;
                this.statsArc.sweepAngle = statDisplay;
            }
        }
      
        console.log("Goals Updated");
    }
}

export default Goals;