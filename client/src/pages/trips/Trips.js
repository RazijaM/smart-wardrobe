import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { formatDate } from '../../utils/dateFormat';

function Trips() {
  const [trips, setTrips] = useState([]);
  const [weatherDest, setWeatherDest] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');
  const [tripWeather, setTripWeather] = useState({});

  const loadTrips = () => api('/trips').then(setTrips).catch(() => setTrips([]));

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    if (!trips || trips.length === 0) return;

    trips.forEach((t) => {
      if (!t.destination || !t.dateFrom || !t.dateTo) return;
      if (tripWeather[t.id]) return;

      const params = new URLSearchParams({
        destination: t.destination,
        dateFrom: String(t.dateFrom),
        dateTo: String(t.dateTo),
      });

      api(`/trips/weather?${params.toString()}`)
        .then((forecast) => {
          if (!forecast) return;
          const { minTemp, maxTemp, avgTemp, isSeasonalEstimate, season } = forecast;
          let avg = avgTemp ?? null;
          if (avg == null && minTemp != null && maxTemp != null) {
            avg = Math.round((minTemp + maxTemp) / 2);
          }
          setTripWeather((prev) => ({
            ...prev,
            [t.id]: {
              avgTemp: avg,
              isSeasonalEstimate: !!isSeasonalEstimate,
              season: season || null,
            },
          }));
        })
        .catch(() => {});
    });
  }, [trips, tripWeather]);

  const handleCheckWeather = async (e) => {
    e?.preventDefault?.();
    if (!weatherDest.trim()) return;
    setWeatherLoading(true);
    setWeatherError('');
    setWeather(null);
    try {
      const data = await api(`/trips/weather/current?destination=${encodeURIComponent(weatherDest.trim())}`);
      setWeather(data);
    } catch (err) {
      setWeatherError(err.message || 'Greška pri dohvatu vremena');
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api(`/trips/${id}`, { method: 'DELETE' });
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mx-auto mt-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dusty-900">Putovanja</h1>
        <Link to="/trips/add" className="btn-primary">Add Trip</Link>
      </div>

      <section className="card p-6 mb-8">
        <h2 className="text-lg font-semibold text-dusty-900 mb-3">Provjeri vrijeme</h2>
        <form onSubmit={handleCheckWeather} className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={weatherDest}
            onChange={(e) => setWeatherDest(e.target.value)}
            placeholder="Unesi destinaciju (npr. Sarajevo)"
            className="flex-1 min-w-[200px] border border-dusty-200 rounded-btn px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-dusty-300"
          />
          <button type="submit" className="btn-primary" disabled={weatherLoading}>
            {weatherLoading ? 'Učitavanje...' : 'Provjeri'}
          </button>
        </form>
        {weatherError && <p className="text-red-600 text-sm mt-2">{weatherError}</p>}
        {weather && (
          <div className="mt-4 card p-4 bg-dusty-50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-dusty-500">
                  Trenutno vrijeme
                </p>
                <p className="text-lg font-semibold text-dusty-900">
                  {weather.destination}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-3xl font-bold text-dusty-800">
                    {weather.temp}°C
                  </p>
                  {weather.iconUrl && (
                    <img
                      src={weather.iconUrl}
                      alt={weather.condition || ''}
                      className="w-10 h-10"
                    />
                  )}
                </div>
                <p className="text-sm text-dusty-600 mt-1">{weather.condition}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-dusty-700">
              {weather.feelsLike != null && (
                <span>Feels like {weather.feelsLike}°C</span>
              )}
              {weather.windSpeed != null && (
                <span>Wind {Math.round(weather.windSpeed)} km/h</span>
              )}
              {weather.humidity != null && <span>Humidity {weather.humidity}%</span>}
              {weather.precipitationChance != null && (
                <span>Rain {weather.precipitationChance}%</span>
              )}
            </div>
          </div>
        )}
      </section>

      <h2 className="text-lg font-semibold text-dusty-900 mb-4">Moja putovanja</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trips.map((t) => {
          const fromDate = t.dateFrom ? new Date(t.dateFrom) : null;
          const toDate = t.dateTo ? new Date(t.dateTo) : null;
          const days =
            fromDate && toDate
              ? Math.max(
                  1,
                  Math.ceil((toDate - fromDate) / (24 * 60 * 60 * 1000)) + 1
                )
              : null;
          const w = tripWeather[t.id];

          return (
            <div key={t.id} className="card p-4 flex flex-col">
              <h3 className="font-semibold text-dusty-900 text-lg">
                {t.destination || t.name || 'Trip'}
              </h3>
              {(t.dateFrom || t.dateTo) && (
                <p className="text-sm text-dusty-600">
                  {formatDate(t.dateFrom)}
                  {t.dateTo ? ` – ${formatDate(t.dateTo)}` : ''}
                </p>
              )}
              {(days || w?.avgTemp != null) && (
                <p className="text-sm text-dusty-600 mt-1">
                  {days && `${days} days`}
                  {days && w?.avgTemp != null && ' • '}
                  {w?.avgTemp != null &&
                    (w.isSeasonalEstimate
                      ? `Est. ${
                          w.season ? w.season.toLowerCase() : 'seasonal'
                        } avg ~${w.avgTemp}°C`
                      : `Avg ${w.avgTemp}°C`)}
                </p>
              )}
              <div className="mt-3 flex gap-2 items-center">
                <Link
                  to={`/trips/${t.id}/packing`}
                  className="btn-primary text-sm flex-1 text-center shadow-md"
                >
                  Packing
                </Link>
                <Link to={`/trips/edit/${t.id}`} className="btn-secondary text-sm">
                  Uredi
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-btn hover:bg-red-50"
                >
                  Obriši
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Trips;
