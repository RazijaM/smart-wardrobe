import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../api';

const OCCASIONS = ['Casual', 'Formal', 'Sport', 'Elegant', 'Svakodnevno'];
const SEASONS = ['Proljeće', 'Ljeto', 'Jesen', 'Zima'];

function AddOutfit() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', occasion: '', season: '', clothingIds: [] });
  const [clothes, setClothes] = useState([]);

  useEffect(() => {
    api('/clothes').then(setClothes).catch(() => setClothes([]));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleCloth = (id) => {
    setForm((prev) => ({
      ...prev,
      clothingIds: prev.clothingIds.includes(id)
        ? prev.clothingIds.filter((cid) => cid !== id)
        : [...prev.clothingIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api('/outfits', { method: 'POST', body: form });
      navigate('/outfits');
    } catch (err) {
      console.error(err);
    }
  };

  const byCategory = clothes.reduce((acc, c) => {
    const cat = c.category || 'Ostalo';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(c);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/outfits" className="link text-sm mb-4 inline-block">← Natrag</Link>
      <h1 className="text-2xl font-bold text-dusty-900 mb-4">Dodaj outfit</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Naziv</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-dusty-200 rounded-btn px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Prigoda</label>
          <select name="occasion" value={form.occasion} onChange={handleChange} className="w-full border border-dusty-200 rounded-btn px-3 py-2">
            <option value="">-- Odaberi --</option>
            {OCCASIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Sezona</label>
          <select name="season" value={form.season} onChange={handleChange} className="w-full border border-dusty-200 rounded-btn px-3 py-2">
            <option value="">-- Odaberi --</option>
            {SEASONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-2">Komadi garderobe</label>
          <div className="border border-dusty-200 rounded-btn p-4 max-h-64 overflow-y-auto space-y-3">
            {Object.keys(byCategory).length === 0 ? (
              <p className="text-dusty-500 text-sm">Nema komada u garderobi. <Link to="/wardrobe/add" className="link">Dodaj</Link></p>
            ) : (
              Object.entries(byCategory).map(([cat, items]) => (
                <div key={cat}>
                  <p className="text-xs font-medium text-dusty-500 uppercase mb-1">{cat}</p>
                  <div className="space-y-1">
                    {items.map((c) => (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer hover:bg-dusty-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={form.clothingIds.includes(c.id)}
                          onChange={() => toggleCloth(c.id)}
                          className="rounded border-dusty-300 text-dusty-500 focus:ring-dusty-400"
                        />
                        <span className="text-sm text-dusty-900">{c.name}{c.color && ` (${c.color})`}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <button type="submit" className="btn-primary">Spremi</button>
      </form>
    </div>
  );
}

export default AddOutfit;
