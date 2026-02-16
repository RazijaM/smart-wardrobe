const https = require('https');

function geocode(destination, callback) {
  const q = encodeURIComponent(destination);
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=1`;
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const r = json.results?.[0];
        if (!r) return callback(new Error('Destinacija nije pronađena'));
        callback(null, { lat: r.latitude, lon: r.longitude, name: r.name });
      } catch (e) {
        callback(e);
      }
    });
  }).on('error', callback);
}

function getForecast(lat, lon, dateFrom, dateTo, callback) {
  const days = dateFrom && dateTo
    ? Math.max(1, Math.ceil((new Date(dateTo) - new Date(dateFrom)) / (24 * 60 * 60 * 1000)) + 1)
    : 3;
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_min,temperature_2m_max,weathercode`;
  if (dateFrom && dateTo) {
    const from = String(dateFrom).split('T')[0];
    const to = String(dateTo).split('T')[0];
    if (from && to) url += `&start_date=${from}&end_date=${to}`;
  }
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const daily = json.daily;
        const minArr = daily?.temperature_2m_min || [];
        const maxArr = daily?.temperature_2m_max || [];
        const codeArr = daily?.weathercode || [];
        const n = Math.min(minArr.length, maxArr.length);
        let minT = 15, maxT = 22, hasRain = false;
        let repCode = 0;
        if (n > 0) {
          minT = minArr.reduce((a, b) => a + b, 0) / n;
          maxT = maxArr.reduce((a, b) => a + b, 0) / n;
          const rainCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99];
          hasRain = codeArr.some((c) => rainCodes.includes(c));
          repCode = codeArr[Math.floor(codeArr.length / 2)] ?? codeArr[0] ?? 0;
        }
        const cond = weatherCodeToCondition(repCode);
        const iconUrl = ICON_URLS[cond.icon] || ICON_URLS.cloud;
        callback(null, {
          minTemp: minT,
          maxTemp: maxT,
          days: n || days,
          hasRain,
          condition: cond.label,
          icon: cond.icon,
          iconUrl,
        });
      } catch (e) {
        callback(e);
      }
    });
  }).on('error', callback);
}

function weatherCodeToCondition(code) {
  if (code === 0) return { label: 'Sunčano', icon: 'sun' };
  if ([1, 2, 3].includes(code)) return { label: 'Djelimično oblačno', icon: 'cloud-sun' };
  if ([45, 48].includes(code)) return { label: 'Magla', icon: 'fog' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { label: 'Kiša', icon: 'rain' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Snijeg', icon: 'snow' };
  if ([95, 96, 99].includes(code)) return { label: 'Oluja', icon: 'storm' };
  return { label: 'Oblačno', icon: 'cloud' };
}

function getPackingTips(temp, hasRain) {
  const tips = [];
  if (temp < 10) {
    tips.push('Jakna ili kaput', 'Dugi rukavi', 'Topla obuća', 'Šal');
  } else if (temp < 18) {
    tips.push('Laka jakna', 'Dugih rukava majica');
  } else {
    tips.push('Lagana odjeća', 'Sunčane naočale', 'Krema za sunčanje');
  }
  if (hasRain) tips.push('Kišobran');
  return tips;
}

const ICON_URLS = {
  sun: 'https://cdn.jsdelivr.net/npm/open-weather-icons@0.0.7/src/svg/01d.svg',
  'cloud-sun': 'https://cdn.jsdelivr.net/npm/open-weather-icons@0.0.7/src/svg/02d.svg',
  cloud: 'https://cdn.jsdelivr.net/npm/open-weather-icons@0.0.7/src/svg/03d.svg',
  rain: 'https://cdn.jsdelivr.net/npm/open-weather-icons@0.0.7/src/svg/10d.svg',
  snow: 'https://cdn.jsdelivr.net/npm/open-weather-icons@0.0.7/src/svg/13d.svg',
  storm: 'https://cdn.jsdelivr.net/npm/open-weather-icons@0.0.7/src/svg/11d.svg',
  fog: 'https://cdn.jsdelivr.net/npm/open-weather-icons@0.0.7/src/svg/50d.svg',
};

function getCurrentWeather(destination, callback) {
  geocode(destination, (err, loc) => {
    if (err) return callback(err);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weathercode&hourly=precipitation_probability&forecast_days=1&timezone=auto`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const c = json.current || {};
          const temp = c.temperature_2m ?? 15;
          const apparent = c.apparent_temperature ?? temp;
          const humidity = c.relative_humidity_2m ?? null;
          const windSpeed = c.wind_speed_10m ?? null;
          const wc = c.weathercode ?? 0;
          const hourly = json.hourly || {};
          const precipArr = hourly.precipitation_probability || [];
          let precipChance = null;
          if (Array.isArray(precipArr) && precipArr.length > 0) {
            const sum = precipArr.reduce((a, b) => a + (b ?? 0), 0);
            precipChance = Math.round(sum / precipArr.length);
          }
          const cond = weatherCodeToCondition(wc);
          const isRain = ['rain', 'storm'].includes(cond.icon);
          const packingTips = getPackingTips(temp, isRain);
          const iconUrl = ICON_URLS[cond.icon] || ICON_URLS.cloud;
          callback(null, {
            destination: loc.name,
            temp: Math.round(temp),
            condition: cond.label,
            icon: cond.icon,
            iconUrl,
            feelsLike: Math.round(apparent),
            humidity,
            windSpeed,
            precipitationChance: precipChance,
            packingTips,
          });
        } catch (e) {
          callback(e);
        }
      });
    }).on('error', callback);
  });
}

module.exports = { geocode, getForecast, getCurrentWeather, getPackingTips };
