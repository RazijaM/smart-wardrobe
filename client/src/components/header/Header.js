import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Header({ auth, setAuth }) {
  const navigate = useNavigate();
  const isAuth = auth && (auth.token || auth.user);
  const isAdmin = isAuth && auth.user?.role === 'ADMIN';

  const handleLogout = () => {
    setAuth(false);
    Cookies.remove('authData');
    navigate('/login');
  };

  return (
    <header className="bg-dusty-500 p-4 shadow-sm">
      <div className="flex flex-row items-center mx-auto max-w-6xl">
        <Link to="/" className="text-white text-2xl font-bold">Smart Wardrobe</Link>
        <nav className="flex-1 flex justify-center gap-6 ml-6">
          <Link to="/" className="text-white/95 hover:text-white hover:underline transition-colors">Home</Link>
          {isAuth && (
            <>
              <Link to="/wardrobe" className="text-white/95 hover:text-white hover:underline transition-colors">Wardrobe</Link>
              <Link to="/outfits" className="text-white/95 hover:text-white hover:underline transition-colors">Outfits</Link>
              <Link to="/trips" className="text-white/95 hover:text-white hover:underline transition-colors">Trips</Link>
              <Link to="/stats" className="text-white/95 hover:text-white hover:underline transition-colors">Stats</Link>
              {isAdmin && <Link to="/admin/news" className="text-dusty-100 hover:text-white hover:underline transition-colors">Admin</Link>}
            </>
          )}
        </nav>
        <div className="font-medium text-white">
          {!isAuth ? (
            <>
              <Link to="/login" className="mr-4 hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          ) : (
            <Link to="/logout" onClick={handleLogout} className="hover:underline">Logout</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
