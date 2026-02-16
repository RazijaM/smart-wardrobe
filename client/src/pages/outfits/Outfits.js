import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';

const API_BASE = 'http://localhost:3001';

function buildImageSrc(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return API_BASE + imagePath;
}

function Outfits() {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    api('/outfits')
      .then(setOutfits)
      .catch(() => setOutfits([]));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api(`/outfits/${id}`, { method: 'DELETE' });
      setOutfits((prev) => prev.filter((o) => o.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const hasOutfits = outfits && outfits.length > 0;

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dusty-900">Outfits</h1>
        <Link to="/outfits/add" className="btn-primary">
          Add Outfit
        </Link>
      </div>

      {!hasOutfits && (
        <div className="card p-8 text-center text-dusty-700 max-w-lg mx-auto">
          <div className="text-4xl mb-3">👗</div>
          <p className="font-medium mb-2">Još nemaš outfite. Kreiraj prvi!</p>
          <p className="text-sm text-dusty-500 mb-4">
            Spoji svoje omiljene komade u kombinacije za svaku prigodu.
          </p>
          <Link to="/outfits/add" className="btn-primary inline-block">
            Add Outfit
          </Link>
        </div>
      )}

      {hasOutfits && (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {outfits.map((o) => {
            const items = o.items || [];
            const itemsWithImages = items
              .map((item) => ({ ...item, src: buildImageSrc(item.imagePath) }))
              .filter((item) => !!item.src);

            return (
              <div
                key={o.id}
                className="card p-4 flex flex-col h-full transition-transform transition-shadow hover:-translate-y-1 hover:shadow-lg hover:border-dusty-300 hover:bg-dusty-50"
              >
                <div className="mb-3">
                  <h3 className="font-semibold text-dusty-900 text-lg">{o.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {o.occasion && (
                      <span className="inline-flex items-center rounded-full bg-dusty-100 text-dusty-700 text-xs px-3 py-1">
                        {o.occasion}
                      </span>
                    )}
                    {o.season && (
                      <span className="inline-flex items-center rounded-full bg-dusty-50 border border-dusty-200 text-dusty-700 text-xs px-3 py-1">
                        {o.season}
                      </span>
                    )}
                  </div>
                </div>

                {itemsWithImages.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-1 rounded-soft overflow-hidden bg-dusty-50">
                      {itemsWithImages.map((item) => (
                        <div
                          key={item.id}
                          className="relative flex items-center justify-center bg-dusty-100/40 overflow-hidden"
                        >
                          <img
                            src={item.src}
                            alt={item.clothingName || item.category || ''}
                            className="w-full h-full object-cover transform transition-transform duration-200 ease-out hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto flex gap-2 pt-2">
                  <Link to={`/outfits/edit/${o.id}`} className="btn-primary text-sm flex-1 text-center">
                    Uredi
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(o.id)}
                    className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-btn hover:bg-red-50"
                  >
                    Obriši
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Outfits;
