import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { formatDate } from '../../utils/dateFormat';

function AdminNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    api('/admin/news').then(setNews).catch(() => setNews([]));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api(`/admin/news/${id}`, { method: 'DELETE' });
      setNews((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-dusty-900">Admin - Vijesti</h1>
        <Link to="/admin/news/add" className="btn-primary">Add News</Link>
      </div>
      <div className="grid gap-4">
        {news.map((n) => (
          <div key={n.id} className="card p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-dusty-900">{n.title}</h3>
              {n.publishedAt && <span className="text-sm text-dusty-600">{formatDate(n.publishedAt)}</span>}
            </div>
            <div className="flex gap-2">
              <Link to={`/admin/news/edit/${n.id}`} className="btn-primary text-sm">Uredi</Link>
              <button type="button" onClick={() => handleDelete(n.id)} className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded">Obriši</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminNews;
