import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api';
import { formatDate } from '../../utils/dateFormat';

function NewsDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    api(`/news/${id}`).then(setItem).catch(() => setItem(null));
  }, [id]);

  if (!item) return <div className="p-4">Učitavanje...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/news" className="link text-sm mb-4 inline-block">← Natrag</Link>
      <h1 className="text-2xl font-bold text-dusty-900 mb-2">{item.title}</h1>
      {item.publishedAt && <p className="text-sm text-dusty-600 mb-4">{formatDate(item.publishedAt)}</p>}
      <div className="prose text-dusty-900">{item.content}</div>
    </div>
  );
}

export default NewsDetail;
