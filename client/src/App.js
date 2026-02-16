import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import RoutesList from './routes/routesList';

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function App() {
  const [auth, setAuth] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuth = auth && (auth.token || auth.user);
  const hideFooterOnDashboard =
    !!isAuth && (location.pathname === "/" || location.pathname === "/news");
  const isGuestHome = location.pathname === "/" && !isAuth;

  useEffect(() => {
    // Function to fetch data
    const verifyToken = async () => {
      const authToken = Cookies.get('authData');
      if(authToken){
        try {
          const response = await fetch('http://localhost:3001/api/auth/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${authToken}`,
            },
          });
          const data = await response.json();
          setAuth({ token: data.token, user: data.user });
        } catch (error) {
          setAuth(false); // Set auth to false if there is an error or the token is invalid
          navigate("/login");
        }
      } else {
        setAuth(false);
      }
    };

    // Call the verify token function
    verifyToken();
  }, [navigate]); // Empty dependency array means this effect runs once after the initial render
  
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <Header auth={auth} setAuth={setAuth} />
        <RoutesList auth={auth} setAuth={setAuth} />
        {!hideFooterOnDashboard && !isGuestHome && <Footer />}
    </div>
  );
}

export default App;
