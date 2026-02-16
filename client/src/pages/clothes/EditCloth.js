import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

const UPLOAD_BASE = 'http://localhost:3001';

function EditCloth() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', category: '', color: '', season: '', size: '', material: '', warmthLevel: '', imagePath: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    api(`/clothes/${id}`).then(setForm).catch(() => {});
  }, [id]);

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
      fd.append('name', form.name || '');
      fd.append('category', form.category || '');
      fd.append('color', form.color || '');
      fd.append('season', form.season || '');
      fd.append('size', form.size || '');
      fd.append('material', form.material || '');
      fd.append('warmthLevel', form.warmthLevel ?? '');
      if (form.imagePath) fd.append('imagePath', form.imagePath);
      if (file) fd.append('image', file);
      await api(`/clothes/${id}`, { method: 'PUT', body: fd });
      navigate('/wardrobe');
    } catch (err) {
      console.error(err);
    }
  };

  const currentImg = form.imagePath && !preview ? (form.imagePath.startsWith('http') ? form.imagePath : UPLOAD_BASE + form.imagePath) : null;

  return (
    <div className="max-w-md mx-auto">
      <Link to="/wardrobe" className="link text-sm mb-4 inline-block">← Natrag</Link>
      <h1 className="text-2xl font-bold text-dusty-900 mb-4">Uredi odjevni predmet</h1>
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
          {(preview || currentImg) && (
            <img
              src={preview || currentImg}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-soft border border-dusty-200"
            />
          )}
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Naziv</label>
          <input name="name" value={form.name || ''} onChange={handleChange} required className="w-full border border-dusty-200 rounded-btn px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Kategorija</label>
          <select name="category" value={form.category || ''} onChange={handleChange} className="w-full border border-dusty-200 rounded-btn px-3 py-2">
            <option value="">-- Odaberi --</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Boja</label>
          <input name="color" value={form.color || ''} onChange={handleChange} className="w-full border border-dusty-200 rounded-btn px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Sezona</label>
          <select name="season" value={form.season || ''} onChange={handleChange} className="w-full border border-dusty-200 rounded-btn px-3 py-2">
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
            value={form.warmthLevel ?? ''}
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

export default EditCloth;
