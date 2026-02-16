import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../api';

function AddNews() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', tags: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api('/admin/news', { method: 'POST', body: form });
      navigate('/admin/news');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Link to="/admin/news" className="link text-sm mb-4 inline-block">← Natrag</Link>
      <h1 className="text-2xl font-bold text-dusty-900 mb-4">Dodaj vijest</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Naslov</label>
          <input name="title" value={form.title} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Sadržaj</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={5} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Tagovi</label>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="tag1, tag2" className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="btn-primary">Spremi</button>
      </form>
    </div>
  );
}

export default AddNews;
