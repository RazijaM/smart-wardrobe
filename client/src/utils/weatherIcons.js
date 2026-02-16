const ICONS = {
  sun: '☀️',
  'cloud-sun': '⛅',
  cloud: '☁️',
  rain: '🌧️',
  snow: '❄️',
  storm: '⛈️',
  fog: '🌫️',
};

export function getWeatherIcon(icon) {
  return ICONS[icon] || '🌡️';
}
