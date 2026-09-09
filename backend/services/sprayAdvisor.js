/**
 * Smart Agricultural Spray & Weather Advisory Engine
 * Evaluates real-time weather metrics to provide actionable spraying recommendations and fungal alerts.
 */

function calculateSprayAdvisory(weatherData) {
  const {
    currentTemp = 28,
    currentHumidity = 65,
    currentWindSpeed = 8,
    rainProbability = 10,
    weatherCode = 0,
    forecastSummary = 'Clear skies'
  } = weatherData;

  const alerts = [];
  let status = 'safe'; // 'safe' | 'caution' | 'danger'
  let bannerTitle = 'Safe Spraying Window Active';
  let bannerColor = 'green';
  let recommendation = 'Optimal conditions for applying foliar fertilizer and crop protection chemicals.';
  let kannadaTitle = 'ಔಷಧ ಸಿಂಪಡಣೆಗೆ ಸೂಕ್ತ ಸಮಯ';
  let kannadaRecommendation = 'ಗಾಳಿ ಮತ್ತು ಮಳೆಯ ಪ್ರಮಾಣ ಕಡಿಮೆಯಿದ್ದು, ರಸಗೊಬ್ಬರ ಮತ್ತು ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಲು ಉತ್ತಮ ವಾತಾವರಣವಿದೆ.';

  // 1. Rain Risk Check
  if (rainProbability >= 45 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(weatherCode)) {
    status = 'danger';
    bannerTitle = 'Do Not Spray Today — High Rain Risk';
    bannerColor = 'red';
    recommendation = `Rain probability is ${rainProbability}%. Any applied pesticide or fertilizer will be washed away, causing financial loss.`;
    kannadaTitle = 'ಇಂದು ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಬೇಡಿ — ಮಳೆಯ ಸಾಧ್ಯತೆ';
    kannadaRecommendation = `ಮಳೆಯ ಸಾಧ್ಯತೆ ${rainProbability}% ಇದೆ. ಔಷಧಿ ನೀರಿನಲ್ಲಿ ಕೊಚ್ಚಿಹೋಗಿ ನಷ್ಟವಾಗಬಹುದು. ಮಳೆ ನಿಂತ 24 ಗಂಟೆಗಳ ನಂತರವೇ ಸಿಂಪಡಿಸಿ.`;
    alerts.push({
      type: 'danger',
      title: 'Rain Hazard',
      desc: 'Wait at least 24 hours after rainfall stops before resuming spraying.'
    });
  }
  // 2. High Wind Drift Hazard
  else if (currentWindSpeed > 15) {
    status = 'danger';
    bannerTitle = 'High Wind Drift Warning — Postpone Spraying';
    bannerColor = 'red';
    recommendation = `Wind speed is ${currentWindSpeed} km/h (Safe threshold < 12 km/h). High risk of chemical drift damaging neighboring crops.`;
    kannadaTitle = 'ಹೆಚ್ಚಿನ ಗಾಳಿಯ ಎಚ್ಚರಿಕೆ — ಸಿಂಪಡಣೆ ಮುಂದೂಡಿ';
    kannadaRecommendation = `ಗಾಳಿಯ ವೇಗ ಗಂಟೆಗೆ ${currentWindSpeed} ಕಿ.ಮೀ ಇದೆ. ಔಷಧಿ ಗಾಳಿಗೆ ಹಾರಿ ಪಕ್ಕದ ಜಮೀನಿಗೆ ತಗುಲುವ ಅಪಾಯವಿದೆ.`;
    alerts.push({
      type: 'danger',
      title: 'Wind Drift Hazard',
      desc: 'High wind causes chemical drift. Spray only when wind drops below 12 km/h.'
    });
  }
  // 3. Fungal Infection Threat (High Humidity)
  else if (currentHumidity > 78 && currentTemp >= 20 && currentTemp <= 32) {
    status = 'caution';
    bannerTitle = 'High Humidity Alert — Fungal Disease Risk';
    bannerColor = 'yellow';
    recommendation = `Relative humidity is ${currentHumidity}%. Elevated risk of Blight, Mildew, and Anthracnose in Tomato, Chilli, and Pomegranate. Apply preventive bio-fungicide (Trichoderma / Copper Oxychloride).`;
    kannadaTitle = 'ಹೆಚ್ಚಿನ ತೇವಾಂಶ — ಶಿಲೀಂಧ್ರ ರೋಗದ ಎಚ್ಚರಿಕೆ';
    kannadaRecommendation = `ತೇವಾಂಶ ${currentHumidity}% ಇದ್ದು ಟೊಮ್ಯಾಟೊ, ಮೆಣಸಿನಕಾಯಿ ಬೆಳೆಗಳಲ್ಲಿ ಬೂದಿ ರೋಗ ಅಥವಾ ಕರಗು ರೋಗ ಬರುವ ಸಾಧ್ಯತೆ ಹೆಚ್ಚು. ಮುನ್ನೆಚ್ಚರಿಕೆ ಔಷಧಿ ಸಿಂಪಡಿಸಿ.`;
    alerts.push({
      type: 'warning',
      title: 'Fungal Threat',
      desc: 'Favorable conditions for fungal spore spread. Avoid excess irrigation.'
    });
  }
  // 4. Extreme Heat Warning
  else if (currentTemp > 35) {
    status = 'caution';
    bannerTitle = 'High Heat Alert — Risk of Leaf Scorch';
    bannerColor = 'yellow';
    recommendation = `Temperature is ${currentTemp}°C. Chemical spraying during peak afternoon causes rapid evaporation and leaf burns. Spray strictly between 6:00 AM – 8:30 AM.`;
    kannadaTitle = 'ಹೆಚ್ಚಿನ ಬಿಸಿಲು — ಎಲೆ ಕರಕಲು ರೋಗದ ಅಪಾಯ';
    kannadaRecommendation = `ತಾಪಮಾನ ${currentTemp}°C ಇದೆ. ಮಧ್ಯಾಹ್ನದ ಸಮಯದಲ್ಲಿ ಸಿಂಪಡಿಸಬೇಡಿ. ಬೆಳಗ್ಗೆ 6 ರಿಂದ 8:30 ರ ಒಳಗೆ ಮಾತ್ರ ಸಿಂಪಡಿಸಿ.`;
    alerts.push({
      type: 'warning',
      title: 'Heat Stress',
      desc: 'Peak heat breaks down active chemical ingredients. Prefer early mornings.'
    });
  }

  return {
    status,
    bannerTitle,
    bannerColor,
    recommendation,
    kannadaTitle,
    kannadaRecommendation,
    alerts,
    metrics: {
      temperature: currentTemp,
      humidity: currentHumidity,
      windSpeed: currentWindSpeed,
      rainChance: rainProbability
    },
    bestTimeWindow: '06:00 AM - 09:00 AM or 04:30 PM - 06:30 PM'
  };
}

module.exports = { calculateSprayAdvisory };
