import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../api';

const CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Jackets', 'Shoes', 'Accessories'];
const SEASONS = ['Proljeće', 'Ljeto', 'Jesen', 'Zima'];
const WARMTH_LEVELS = [
  { value: '1', label: 'Vrlo lagano (ljeto)' },
  { value: '2', label: 'Lagano' },
  { value: '3', label: 'Srednje toplo' },
  { value: '4', label: 'Toplo' },
  { value: '5', label: 'Vrlo toplo (zima)' },
];

function AddCloth() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', category: '', color: '', season: '', size: '', material: '', warmthLevel: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      const f = e.target.files?.[0];
      setFile(f || null);
      setPreview(f ? URL.createObjectURL(f) : null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('category', form.category);
      fd.append('color', form.color);
      fd.append('season', form.season);
      fd.append('size', form.size);
      fd.append('material', form.material);
      fd.append('warmthLevel', form.warmthLevel || '');
      if (file) fd.append('image', file);
      await api('/clothes', { method: 'POST', body: fd });
      navigate('/wardrobe');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Link to="/wardrobe" className="link text-sm mb-4 inline-block">← Natrag</Link>
      <h1 className="text-2xl font-bold text-dusty-900 mb-4">Dodaj odjevni predmet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Slika</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-dusty-200 rounded-btn px-3 py-2 text-sm"
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-soft border border-dusty-200" />
          )}
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Naziv</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-dusty-200 rounded-btn px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Kategorija</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full border border-dusty-200 rounded-btn px-3 py-2">
            <option value="">-- Odaberi --</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Boja</label>
          <input name="color" value={form.color} onChange={handleChange} className="w-full border border-dusty-200 rounded-btn px-3 py-2" />
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
          <label className="block text-sm text-dusty-600 mb-1">Toplinska razina</label>
          <select
            name="warmthLevel"
            value={form.warmthLevel}
            onChange={handleChange}
            className="w-full border border-dusty-200 rounded-btn px-3 py-2"
          >
            <option value="">-- Odaberi --</option>
            {WARMTH_LEVELS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary">Spremi</button>
      </form>
    </div>
  );
}

export default AddCloth;
