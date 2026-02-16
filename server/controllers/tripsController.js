const Trips = require('../models/tripsModel');
const Clothes = require('../models/clothesModel');
const { geocode, getForecast, getCurrentWeather, getPackingTips } = require('../services/weatherService');

function getSeasonFromDate(dateStr) {
  if (!dateStr) return null;
  const m = parseInt((dateStr.split('-')[1] || dateStr.split('/')[1] || ''), 10);
  if (m >= 3 && m <= 5) return 'Spring';
  if (m >= 6 && m <= 8) return 'Summer';
  if (m >= 9 && m <= 11) return 'Autumn';
  return 'Winter';
}

function mapTempToWarmth(minTemp, maxTemp) {
  const avg = (minTemp + maxTemp) / 2;
  if (avg < 0) return { min: 4, max: 5 };
  if (avg < 10) return { min: 3, max: 5 };
  if (avg < 20) return { min: 2, max: 4 };
  if (avg < 28) return { min: 1, max: 3 };
  return { min: 0, max: 2 };
}

function getPackingMultiplier(days) {
  if (!days || days <= 1) return 1;
  if (days <= 3) return 1;
  if (days <= 7) return 1.5;
  return 2;
}

const tripsController = {
  getAll: (req, res) => {
    const ownerId = req.user.id;
    Trips.getAllByOwner(ownerId, (err, trips) => {
      if (err) return res.status(500).json({ error: 'Error fetching trips.' });
      res.json(trips);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    const ownerId = req.user.id;
    Trips.getById(id, ownerId, (err, trip) => {
      if (err) return res.status(500).json({ error: 'Error fetching trip.' });
      if (!trip) return res.status(404).json({ error: 'Trip not found' });
      res.json(trip);
    });
  },

  create: (req, res) => {
    const { destination, dateFrom, dateTo, preferences } = req.body;
    const ownerId = req.user.id;
    Trips.create({ destination, dateFrom, dateTo, preferences, ownerId }, (err, created) => {
      if (err) return res.status(500).json({ error: 'Error creating trip.' });
      res.status(201).json(created);
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const ownerId = req.user.id;
    Trips.update(id, ownerId, req.body, (err, updated) => {
      if (err) return res.status(500).json({ error: 'Error updating trip.' });
      if (!updated) return res.status(404).json({ error: 'Trip not found' });
      res.json(updated);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    const ownerId = req.user.id;
    Trips.delete(id, ownerId, (err, deleted) => {
      if (err) return res.status(500).json({ error: 'Error deleting trip.' });
      if (!deleted) return res.status(404).json({ error: 'Trip not found' });
      res.json(deleted);
    });
  },

  getCurrentWeather: (req, res) => {
    const { destination } = req.query;
    if (!destination) return res.status(400).json({ error: 'Destinacija je obavezna' });
    getCurrentWeather(destination, (err, data) => {
      if (err) return res.status(400).json({ error: err.message || 'Greška pri dohvatu vremena' });
      res.json(data);
    });
  },

  getWeather: (req, res) => {
    const { destination, dateFrom, dateTo } = req.query;
    const ownerId = req.user.id;
    if (!destination) return res.status(400).json({ error: 'Destination required' });
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = dateFrom ? new Date(dateFrom) : null;
    const end = dateTo ? new Date(dateTo) : null;

    const diffDays =
      start && !isNaN(start.getTime())
        ? Math.round((start.getTime() - today.getTime()) / MS_PER_DAY)
        : null;

    const tripDays =
      start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())
        ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY) + 1)
        : 1;

    const farFuture = diffDays != null && diffDays > 14;

    if (farFuture || !start || !end) {
      const season = getSeasonFromDate(dateFrom) || getSeasonFromDate(dateTo);
      const seasonEstimate = {
        Winter: 2,
        Spring: 12,
        Summer: 24,
        Autumn: 10,
      };
      const avgTemp = seasonEstimate[season] ?? 12;
      return res.json({
        minTemp: null,
        maxTemp: null,
        avgTemp,
        days: tripDays,
        hasRain: false,
        isSeasonalEstimate: true,
        season,
      });
    }

    geocode(destination, (err, loc) => {
      if (err) return res.status(400).json({ error: err.message || 'Could not find destination' });
      getForecast(loc.lat, loc.lon, dateFrom, dateTo, (err2, forecast) => {
        if (err2) return res.status(500).json({ error: 'Weather fetch failed' });
        const { minTemp, maxTemp, days, hasRain } = forecast;
        let avgTemp = null;
        if (minTemp != null && maxTemp != null) {
          avgTemp = Math.round((minTemp + maxTemp) / 2);
        }
        res.json({
          minTemp,
          maxTemp,
          avgTemp,
          days,
          hasRain,
          isSeasonalEstimate: false,
        });
      });
    });
  },

  getPackingRecommendation: (req, res) => {
    const tripId = req.params.id;
    const ownerId = req.user.id;

    Trips.getById(tripId, ownerId, (err, trip) => {
      if (err) return res.status(500).json({ error: 'Error fetching trip.' });
      if (!trip) return res.status(404).json({ error: 'Trip not found' });

      const dateFrom = trip.dateFrom ? new Date(trip.dateFrom) : null;
      const dateTo = trip.dateTo ? new Date(trip.dateTo) : null;
      const MS_PER_DAY = 24 * 60 * 60 * 1000;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const start = dateFrom;
      const end = dateTo;

      const diffDays =
        start && !isNaN(start.getTime())
          ? Math.round((start.getTime() - today.getTime()) / MS_PER_DAY)
          : null;

      const tripDays = start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())
        ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY) + 1)
        : 1;

      const farFuture = diffDays != null && diffDays > 14;

      const season = getSeasonFromDate(trip.dateFrom) || getSeasonFromDate(trip.dateTo);

      const finishResponse = (weatherInfo) => {
        const {
          minTemp,
          maxTemp,
          avgTemp,
          days,
          hasRain,
          isSeasonalEstimate,
          seasonName,
          condition,
          iconUrl,
        } = weatherInfo;
        const effectiveSeason = seasonName || season;
        const warmthRange =
          minTemp != null && maxTemp != null
            ? mapTempToWarmth(minTemp, maxTemp)
            : { min: 0, max: 5 };
        const multiplier = getPackingMultiplier(tripDays);

        Clothes.getByOwnerForPacking(ownerId, effectiveSeason, warmthRange.min, warmthRange.max, (err4, clothes) => {
          if (err4) return res.status(500).json({ error: 'Error fetching clothes.' });

          const byCategory = {};
          (clothes || []).forEach((c) => {
            const cat = c.category || 'Other';
            if (!byCategory[cat]) byCategory[cat] = [];
            byCategory[cat].push(c);
          });

          const recommendation = [];
          const limits = {
            tops: Math.ceil(2 * multiplier),
            bottoms: Math.ceil(1.5 * multiplier),
            outerwear: Math.ceil(1 * multiplier),
            accessories: Math.ceil(1 * multiplier),
          };
          ['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Accessories', 'Other'].forEach((cat) => {
            const items = byCategory[cat] || [];
            const limit = limits[cat.toLowerCase()] || Math.ceil(2 * multiplier);
            recommendation.push(...items.slice(0, Math.min(limit, items.length)));
          });

          const roundedAvg = avgTemp != null ? Math.round(avgTemp) : null;

          res.json({
            trip,
            weather: {
              minTemp,
              maxTemp,
              avgTemp: roundedAvg,
              days,
              hasRain,
              isSeasonalEstimate: !!isSeasonalEstimate,
              season: effectiveSeason || null,
              condition: condition || null,
              iconUrl: iconUrl || null,
            },
            packingTips: getPackingTips(roundedAvg != null ? roundedAvg : 15, hasRain || false),
            recommendedClothes: recommendation,
            criteria: { season: effectiveSeason, warmthRange, tripDays },
          });
        });
      };

      if (farFuture || !start || !end) {
        const seasonRanges = {
          Winter: { min: 0, max: 7 },
          Spring: { min: 7, max: 17 },
          Summer: { min: 18, max: 28 },
          Autumn: { min: 7, max: 15 },
        };
        const sr = seasonRanges[season] || { min: 8, max: 18 };
        const avgTemp = (sr.min + sr.max) / 2;
        finishResponse({
          minTemp: sr.min,
          maxTemp: sr.max,
          avgTemp,
          days: tripDays,
          hasRain: false,
          isSeasonalEstimate: true,
          seasonName: season,
          condition: null,
          iconUrl: null,
        });
      } else {
        geocode(trip.destination, (err2, loc) => {
          if (err2) {
            return res.status(400).json({ error: err2.message || 'Could not find destination' });
          }
          getForecast(loc.lat, loc.lon, trip.dateFrom, trip.dateTo, (err3, forecast) => {
            if (err3) {
              return res.status(500).json({ error: 'Weather fetch failed' });
            }

            const { minTemp, maxTemp, days, hasRain } = forecast;
            const avgTemp =
              minTemp != null && maxTemp != null ? (minTemp + maxTemp) / 2 : 15;

            finishResponse({
              minTemp,
              maxTemp,
              avgTemp,
              days,
              hasRain: hasRain || false,
              isSeasonalEstimate: false,
              seasonName: season,
              condition: forecast.condition || null,
              iconUrl: forecast.iconUrl || null,
            });
          });
        });
      }
    });
  },
};

module.exports = tripsController;
