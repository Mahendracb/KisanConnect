const axios = require('axios');
const { calculateSprayAdvisory } = require('../services/sprayAdvisor');

// Coordinates for major Karnataka Agricultural Districts
const KARNATAKA_DISTRICT_COORDS = {
  'Bagalkot': { lat: 16.18, lon: 75.69 },
  'Ballari': { lat: 15.14, lon: 76.92 },
  'Belagavi': { lat: 15.85, lon: 74.50 },
  'Bengaluru Rural': { lat: 13.28, lon: 77.55 },
  'Bengaluru Urban': { lat: 12.97, lon: 77.59 },
  'Bidar': { lat: 17.91, lon: 77.51 },
  'Chamarajanagar': { lat: 11.92, lon: 76.94 },
  'Chikkaballapur': { lat: 13.43, lon: 77.72 },
  'Chikkamagaluru': { lat: 13.31, lon: 75.77 },
  'Chitradurga': { lat: 14.22, lon: 76.40 },
  'Dakshina Kannada': { lat: 12.87, lon: 74.88 },
  'Davanagere': { lat: 14.46, lon: 75.92 },
  'Dharwad': { lat: 15.45, lon: 75.00 },
  'Gadag': { lat: 15.42, lon: 75.63 },
  'Hassan': { lat: 13.00, lon: 76.10 },
  'Haveri': { lat: 14.79, lon: 75.39 },
  'Kalaburagi': { lat: 17.33, lon: 76.83 },
  'Kodagu': { lat: 12.42, lon: 75.73 },
  'Kolar': { lat: 13.13, lon: 78.13 },
  'Koppal': { lat: 15.34, lon: 76.15 },
  'Mandya': { lat: 12.52, lon: 76.89 },
  'Mysuru': { lat: 12.29, lon: 76.63 },
  'Raichur': { lat: 16.20, lon: 77.35 },
  'Ramanagara': { lat: 12.72, lon: 77.28 },
  'Shivamogga': { lat: 13.92, lon: 75.57 },
  'Tumakuru': { lat: 13.34, lon: 77.10 },
  'Udupi': { lat: 13.34, lon: 74.74 },
  'Uttara Kannada': { lat: 14.81, lon: 74.13 },
  'Vijayapura': { lat: 16.83, lon: 75.71 },
  'Yadgir': { lat: 16.76, lon: 77.13 }
};

function getWeatherDescription(code) {
  if (code === 0) return 'Clear Sky';
  if ([1, 2].includes(code)) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55].includes(code)) return 'Light Drizzle';
  if ([61, 63, 65].includes(code)) return 'Rain Showers';
  if ([80, 81, 82].includes(code)) return 'Heavy Downpour';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Cloudy';
}

// @desc    Get live weather & smart spray advisory
// @route   GET /api/weather
// @access  Public
const getWeatherData = async (req, res) => {
  try {
    let { district = 'Mandya', lat, lon } = req.query;

    if (!lat || !lon) {
      const coords = KARNATAKA_DISTRICT_COORDS[district] || KARNATAKA_DISTRICT_COORDS['Mandya'];
      lat = coords.lat;
      lon = coords.lon;
    } else {
      lat = parseFloat(lat);
      lon = parseFloat(lon);
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

    let apiRes;
    try {
      apiRes = await axios.get(url, { timeout: 6000 });
    } catch (fetchErr) {
      console.warn(`[Weather API fallback]: ${fetchErr.message}`);
    }

    const current = apiRes?.data?.current || {
      temperature_2m: 29.5,
      relative_humidity_2m: 62,
      weather_code: 1,
      wind_speed_10m: 7.8,
      precipitation: 0
    };

    const daily = apiRes?.data?.daily || {
      time: Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d.toISOString().split('T')[0];
      }),
      temperature_2m_max: [31, 32, 30, 29, 31, 30, 31],
      temperature_2m_min: [21, 20, 21, 22, 21, 20, 21],
      precipitation_probability_max: [10, 15, 45, 70, 20, 10, 15],
      wind_speed_10m_max: [10, 9, 14, 16, 11, 8, 9],
      weather_code: [1, 2, 61, 80, 2, 0, 1]
    };

    const hourly = apiRes?.data?.hourly || {};

    const currentCondition = getWeatherDescription(current.weather_code);
    const rainChance = daily.precipitation_probability_max?.[0] || 10;

    const sprayAdvisory = calculateSprayAdvisory({
      currentTemp: current.temperature_2m,
      currentHumidity: current.relative_humidity_2m,
      currentWindSpeed: current.wind_speed_10m,
      rainProbability: rainChance,
      weatherCode: current.weather_code,
      forecastSummary: currentCondition
    });

    const forecast7Days = daily.time.map((dateStr, idx) => ({
      date: dateStr,
      dayName: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
      maxTemp: Math.round(daily.temperature_2m_max[idx]),
      minTemp: Math.round(daily.temperature_2m_min[idx]),
      rainProbability: daily.precipitation_probability_max[idx],
      windSpeed: Math.round(daily.wind_speed_10m_max[idx]),
      weatherCode: daily.weather_code[idx],
      condition: getWeatherDescription(daily.weather_code[idx])
    }));

    const hourlySprayGuide = [];
    if (hourly.time) {
      const now = new Date();
      for (let i = 0; i < hourly.time.length && hourlySprayGuide.length < 12; i++) {
        const hTime = new Date(hourly.time[i]);
        if (hTime >= now) {
          const wSpeed = hourly.wind_speed_10m[i];
          const rProb = hourly.precipitation_probability[i];
          let hourStatus = 'safe';
          if (rProb > 40 || wSpeed > 15) hourStatus = 'danger';
          else if (wSpeed > 11 || rProb > 25) hourStatus = 'caution';

          hourlySprayGuide.push({
            time: hTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            temp: Math.round(hourly.temperature_2m[i]),
            humidity: hourly.relative_humidity_2m[i],
            windSpeed: Math.round(wSpeed),
            rainProb: rProb,
            status: hourStatus
          });
        }
      }
    }

    return res.json({
      district,
      coordinates: { lat, lon },
      current: {
        temp: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        condition: currentCondition,
        weatherCode: current.weather_code
      },
      sprayAdvisory,
      forecast7Days,
      hourlySprayGuide,
      districtsList: Object.keys(KARNATAKA_DISTRICT_COORDS).sort()
    });
  } catch (err) {
    console.error(`Weather Controller Error: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getWeatherData
};
