import { useState, useEffect } from 'react';
import { api } from '../../api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const CHART_COLORS = ['#C9A0A0', '#B88787', '#A07070', '#8B5E5E', '#6B4848', '#D9AFAF', '#E8C9C9', '#F5E0E0'];

function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api('/stats')
      .then((data) => setStats(data || {}))
      .catch(() => setStats({}));
  }, []);

  if (!stats) return <div className="p-4">Učitavanje...</div>;

  const byCategory = stats.byCategory || [];
  const mostWorn = stats.mostWorn || [];
  const colorDistribution = stats.colorDistribution || [];
  const seasonalUsage = stats.seasonalUsage || [];

  const categoryChartData = byCategory.map((c) => ({ name: c.category || 'Ostalo', count: c.count || 0 }));
  const colorChartData = colorDistribution.map((c) => ({ name: c.color || 'N/A', count: c.count || 0 }));
  const seasonChartData = seasonalUsage.map((c) => ({ name: c.season || 'N/A', value: c.count || 0 }));
  const wornChartData = mostWorn.map((c) => ({ name: (c.name || 'N/A').slice(0, 14), count: c.wearCount ?? c.count ?? 0 }));

  const hasData = byCategory.length > 0 || colorDistribution.length > 0 || seasonalUsage.length > 0 || mostWorn.length > 0;

  return (
    <div className="container mx-auto mt-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-dusty-900 mb-2">Statistika</h1>
      <p className="text-dusty-600 mb-8">Pregled navika i garderobe</p>

      {!hasData && (
        <p className="text-dusty-600">Nema dostupnih statistika. Dodaj komade garderobe za pregled.</p>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {categoryChartData.length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-dusty-900 mb-4">Komada po kategoriji</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8C9C9" />
                  <XAxis type="number" stroke="#8B5E5E" />
                  <YAxis dataKey="name" type="category" width={80} stroke="#8B5E5E" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8C9C9' }} />
                  <Bar dataKey="count" fill="#C9A0A0" radius={[0, 4, 4, 0]} name="Komada" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {colorChartData.length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-dusty-900 mb-4">Najčešće nošene boje</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={colorChartData} margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8C9C9" />
                  <XAxis dataKey="name" stroke="#8B5E5E" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#8B5E5E" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8C9C9' }} />
                  <Bar dataKey="count" fill="#B88787" radius={[4, 4, 0, 0]} name="Komada" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {seasonChartData.length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-dusty-900 mb-4">Zastupljenost sezona</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={seasonChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {seasonChartData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8C9C9' }} formatter={(v) => [v, 'Komada']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {wornChartData.length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-dusty-900 mb-4">Najčešće korišteni komadi u outfitima</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wornChartData} margin={{ left: 20, right: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8C9C9" />
                  <XAxis dataKey="name" stroke="#8B5E5E" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={50} />
                  <YAxis stroke="#8B5E5E" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8C9C9' }} formatter={(v) => [v + 'x', 'Korišteno u outfitima']} />
                  <Bar dataKey="count" fill="#A07070" radius={[4, 4, 0, 0]} name="Korišteno u outfitima" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {wornChartData.length === 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-dusty-900 mb-2">Najčešće korišteni komadi u outfitima</h2>
            <p className="text-sm text-dusty-600">
              Još nema dovoljno podataka. Kreiraj više outfita da vidiš statistiku.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Stats;
