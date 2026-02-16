import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import ClothCard from '../clothes/ClothCard';
import { matchesSearch } from '../../utils/wardrobeSearch';

const CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Jackets', 'Shoes', 'Accessories'];

function WardrobeMain() {
  const [search, setSearch] = useState('');
  const [allClothes, setAllClothes] = useState([]);

  const hasSearch = search.trim().length > 0;
  useEffect(() => {
    if (hasSearch) {
      api('/clothes').then(setAllClothes).catch(() => setAllClothes([]));
    } else {
      setAllClothes([]);
    }
  }, [hasSearch]);

  const filteredClothes = search.trim() ? allClothes.filter((c) => matchesSearch(c, search)) : [];
  const showResults = search.trim().length > 0;

  const handleDelete = async (id) => {
    try {
      await api(`/clothes/${id}`, { method: 'DELETE' });
      setAllClothes((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mx-auto mt-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dusty-900">Wardrobe</h1>
        <Link to="/wardrobe/add" className="btn-primary">Add Item</Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pretraži po nazivu, boji, kategoriji, sezoni (npr. crna zima, shoes)"
          className="w-full border border-dusty-200 rounded-btn px-4 py-2.5 text-dusty-900 placeholder-dusty-400 focus:outline-none focus:ring-2 focus:ring-dusty-300"
        />
      </div>

      {!showResults && (
        <>
          <p className="text-dusty-600 mb-6">Odaberi kategoriju</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Link
              to="/wardrobe/category/all"
              className="card p-5 text-center hover:border-dusty-400 transition-all hover:shadow-md flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-dusty-50 flex items-center justify-center mb-2">
                <img
                  src="/allItems.png"
                  alt="All items"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h2 className="font-semibold text-dusty-900 text-sm mt-1">All items</h2>
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/wardrobe/category/${encodeURIComponent(cat)}`}
                className="card p-5 text-center hover:border-dusty-400 transition-all hover:shadow-md flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-dusty-50 flex items-center justify-center mb-2">
                  <img
                    src={`/${cat.toLowerCase()}.png`}
                    alt={cat}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <h2 className="font-semibold text-dusty-900 text-sm mt-1">{cat}</h2>
              </Link>
            ))}
          </div>
        </>
      )}

      {showResults && (
        <>
          {filteredClothes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredClothes.map((c) => (
                <ClothCard key={c.id} {...c} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center text-dusty-600">
              <p>Nema rezultata. Pokušaj drugu riječ ili dodaj novi komad.</p>
              <Link to="/wardrobe/add" className="link mt-2 inline-block">Dodaj komad</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WardrobeMain;
