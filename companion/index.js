import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me as companion } from "companion";
import * as weather from 'fitbit-weather/companion';

/* Api Key can be obtained from openweathermap.com */
weather.setup({ provider: weather.Providers.openweathermap, apiKey: '2b98f571a72f1717c4bb4a6ccdba4533' });
