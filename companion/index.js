import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me as companion } from "companion";
import * as weather from 'fitbit-weather/companion';
import * as weatherKey from './weather';

/* Api Key can be obtained from openweathermap.com */
weather.setup({ provider: weather.Providers.openweathermap, apiKey: weatherKey.apiKey });
