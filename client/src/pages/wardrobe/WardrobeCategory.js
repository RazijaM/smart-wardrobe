import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api';
import ClothCard from '../clothes/ClothCard';
import { matchesSearch } from '../../utils/wardrobeSearch';

function WardrobeCategory() {
  const { category } = useParams();
  const [clothes, setClothes] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const url = category === 'all' ? '/clothes' : `/clothes?category=${encodeURIComponent(category)}`;
    api(url).then(setClothes).catch(() => setClothes([]));
  }, [category]);

  const filteredClothes = search.trim() ? clothes.filter((c) => matchesSearch(c, search)) : clothes;

  const handleDelete = async (id) => {
    try {
      await api(`/clothes/${id}`, { method: 'DELETE' });
      setClothes((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const title = category === 'all' ? 'All items' : category;

  return (
    <div className="container mx-auto mt-8 max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Link to="/wardrobe" className="link text-sm mb-2 inline-block">← Natrag</Link>
          <h1 className="text-3xl font-bold text-dusty-900">{title}</h1>
        </div>
        <Link to="/wardrobe/add" className="btn-primary">Add Item</Link>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pretraži (naziv, boja, sezona...)"
          className="w-full border border-dusty-200 rounded-btn px-4 py-2.5 text-dusty-900 placeholder-dusty-400 focus:outline-none focus:ring-2 focus:ring-dusty-300"
        />
      </div>
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
    </div>
  );
}

export default WardrobeCategory;
