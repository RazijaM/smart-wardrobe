import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api';
import { formatDate } from '../../utils/dateFormat';

const API_BASE = 'http://localhost:3001';

function TripPacking() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api(`/trips/${id}/packing`).then(setData).catch(() => setData(null));
  }, [id]);

  if (!data) return <div className="p-4">Učitavanje...</div>;

  const recommendation = data.recommendedClothes || [];
  const packingTips = data.packingTips || [];
  const weather = data.weather || {};
  const trip = data.trip || {};

  const dateRange = trip.dateFrom && trip.dateTo
    ? (String(trip.dateFrom).split('T')[0] === String(trip.dateTo).split('T')[0]
        ? formatDate(trip.dateFrom)
        : `${formatDate(trip.dateFrom)} – ${formatDate(trip.dateTo)}`)
    : (trip.dateFrom ? formatDate(trip.dateFrom) : '');

  const hasWeather =
    weather &&
    (weather.avgTemp != null || weather.minTemp != null || weather.maxTemp != null);

  const avgTempValue =
    weather.avgTemp != null
      ? weather.avgTemp
      : weather.minTemp != null && weather.maxTemp != null
      ? Math.round((weather.minTemp + weather.maxTemp) / 2)
      : null;

  return (
    <div className="container mx-auto mt-8 max-w-4xl">
      <Link to="/trips" className="link text-sm mb-4 inline-block">← Natrag</Link>
      <h1 className="text-2xl font-bold text-dusty-900 mb-4">Packing za {trip.destination || 'putovanje'}</h1>

      {dateRange && (
        <p className="text-dusty-600 mb-2">Period: {dateRange}</p>
      )}

      {hasWeather && (
        <section className="card p-5 mb-6 bg-dusty-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-dusty-500">
                Weather for this trip
              </p>
              <p className="text-lg font-semibold text-dusty-900">
                {trip.destination || 'Destination'}
              </p>
              <div className="flex items-center gap-3 mt-1">
                {avgTempValue != null && (
                  <p className="text-3xl font-bold text-dusty-800">
                    {avgTempValue}°C
                  </p>
                )}
                {!weather.isSeasonalEstimate && weather.iconUrl && (
                  <img
                    src={weather.iconUrl}
                    alt={weather.condition || ''}
                    className="w-10 h-10"
                  />
                )}
              </div>
              {weather.condition && !weather.isSeasonalEstimate && (
                <p className="text-sm text-dusty-600 mt-1">{weather.condition}</p>
              )}
            </div>
          </div>
          {weather.minTemp != null && weather.maxTemp != null && (
            <p className="text-xs text-dusty-600 mt-2">
              {weather.isSeasonalEstimate
                ? `Est. ${Math.round(weather.minTemp)}°–${Math.round(
                    weather.maxTemp
                  )}°C`
                : `Range ${Math.round(weather.minTemp)}°–${Math.round(
                    weather.maxTemp
                  )}°C${weather.hasRain ? ' · Possibility of rain' : ''}`}
            </p>
          )}
          {weather.isSeasonalEstimate && (
            <p className="text-xs text-dusty-500 mt-1">
              Prognoza nije dostupna za ovaj datum (previše daleko). Prikaz je sezonska
              procjena.
            </p>
          )}
        </section>
      )}

      {packingTips.length > 0 && (
        <section className="card p-5 mb-6">
          <h2 className="font-semibold text-dusty-900 mb-2">Suggested clothing</h2>
          <ul className="space-y-0.5 text-sm text-dusty-700">
            {packingTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </section>
      )}

      <h2 className="font-semibold text-dusty-900 mb-3">Recommended from your wardrobe</h2>
      {recommendation.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendation.map((c, i) => {
            const src = c.imagePath
              ? API_BASE + (c.imagePath.startsWith('/') ? c.imagePath : '/' + c.imagePath)
              : null;
            return (
              <div key={i} className="card p-3 flex flex-col">
                {src ? (
                  <img
                    src={src}
                    alt={c.name}
                    className="w-full h-40 object-cover rounded-soft"
                  />
                ) : (
                  <div className="w-full h-40 bg-dusty-100 rounded-soft flex items-center justify-center text-dusty-500 text-sm uppercase tracking-wide">
                    {c.name || 'Item'}
                  </div>
                )}
                <div className="mt-2">
                  <h3 className="font-semibold text-dusty-900 text-sm">{c.name}</h3>
                  <p className="text-xs text-dusty-600">
                    {c.category}
                    {c.color && ` · ${c.color}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-dusty-600">
          No recommended pieces yet. Add wardrobe items with season and warmth to see suggestions.
        </p>
      )}
    </div>
  );
}

export default TripPacking;
