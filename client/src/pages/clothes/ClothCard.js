import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:3001';

function ClothCard({ id, name, category, color, imagePath, onDelete, ...rest }) {
  const imgSrc = imagePath ? (imagePath.startsWith('http') ? imagePath : API_BASE + imagePath) : null;
  return (
    <div className="card p-4">
      {imgSrc ? (
        <img src={imgSrc} alt={name} className="w-full h-32 object-cover rounded-soft mb-2" />
      ) : (
        <div className="w-full h-32 bg-dusty-200 rounded-soft mb-2 flex items-center justify-center text-dusty-500">
          {name?.charAt(0) || '?'}
        </div>
      )}
      <h3 className="font-semibold text-dusty-900">{name}</h3>
      {category && <p className="text-sm text-dusty-600">{category}</p>}
      {color && <p className="text-sm text-dusty-600">{color}</p>}
      <div className="flex gap-2 mt-3">
        <Link to={`/wardrobe/edit/${id}`} className="btn-primary text-sm flex-1 text-center">
          Uredi
        </Link>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-btn hover:bg-red-50"
          >
            Obriši
          </button>
        )}
      </div>
    </div>
  );
}

export default ClothCard;
