import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Smart Wardrobe Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/clothes" className="block p-6 border rounded-lg bg-gray-50 hover:bg-gray-100">
          <h2 className="text-xl font-semibold">My Wardrobe</h2>
          <p className="text-gray-600 text-sm">Manage your clothes</p>
        </Link>
        <Link to="/outfits" className="block p-6 border rounded-lg bg-gray-50 hover:bg-gray-100">
          <h2 className="text-xl font-semibold">Outfits</h2>
          <p className="text-gray-600 text-sm">Create outfit combinations</p>
        </Link>
        <Link to="/trips" className="block p-6 border rounded-lg bg-gray-50 hover:bg-gray-100">
          <h2 className="text-xl font-semibold">Trips</h2>
          <p className="text-gray-600 text-sm">Plan & pack for travel</p>
        </Link>
        <Link to="/stats" className="block p-6 border rounded-lg bg-gray-50 hover:bg-gray-100">
          <h2 className="text-xl font-semibold">Statistics</h2>
          <p className="text-gray-600 text-sm">View wardrobe analytics</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
