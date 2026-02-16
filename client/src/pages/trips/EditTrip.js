import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../api';

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ destination: '', dateFrom: '', dateTo: '', preferences: '' });

  useEffect(() => {
    api(`/trips/${id}`).then(setForm).catch(() => {});
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api(`/trips/${id}`, { method: 'PUT', body: form });
      navigate('/trips');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Link to="/trips" className="link text-sm mb-4 inline-block">← Natrag</Link>
      <h1 className="text-2xl font-bold text-dusty-900 mb-4">Uredi putovanje</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Destinacija</label>
          <input name="destination" value={form.destination || ''} onChange={handleChange} required className="w-full border border-dusty-200 rounded-btn px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Datum početka</label>
          <input name="dateFrom" type="date" value={form.dateFrom ? String(form.dateFrom).split('T')[0] : ''} onChange={handleChange} className="w-full border border-dusty-200 rounded-btn px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Datum završetka</label>
          <input name="dateTo" type="date" value={form.dateTo ? String(form.dateTo).split('T')[0] : ''} onChange={handleChange} className="w-full border border-dusty-200 rounded-btn px-3 py-2" />
        </div>
        <button type="submit" className="btn-primary">Spremi</button>
      </form>
    </div>
  );
}

export default EditTrip;
