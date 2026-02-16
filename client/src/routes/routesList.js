import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login/Login';
import Register from '../pages/register/Register';
import Landing from '../pages/landing/Landing';
import LoggedInHome from '../pages/home/LoggedInHome';
import NewsDashboard from '../pages/news/NewsDashboard';
import NewsDetail from '../pages/news/NewsDetail';
import WardrobeMain from '../pages/wardrobe/WardrobeMain';
import WardrobeCategory from '../pages/wardrobe/WardrobeCategory';
import AddCloth from '../pages/clothes/AddCloth';
import EditCloth from '../pages/clothes/EditCloth';
import Outfits from '../pages/outfits/Outfits';
import AddOutfit from '../pages/outfits/AddOutfit';
import EditOutfit from '../pages/outfits/EditOutfit';
import Trips from '../pages/trips/Trips';
import AddTrip from '../pages/trips/AddTrip';
import EditTrip from '../pages/trips/EditTrip';
import TripPacking from '../pages/trips/TripPacking';
import Stats from '../pages/stats/Stats';
import AdminNews from '../pages/admin/AdminNews';
import AddNews from '../pages/admin/AddNews';
import EditNews from '../pages/admin/EditNews';
import Body from '../components/body/Body';

function RoutesList({ auth, setAuth }) {
  const isAuth = auth && (auth.token || auth.user);
  const isAdmin = isAuth && auth.user?.role === 'ADMIN';

  return (
    <Routes>
      <Route path="/" element={<Body />}>
        <Route index element={isAuth ? <LoggedInHome user={auth?.user} /> : <Landing />} />
        <Route path="login" element={<Login setAuth={setAuth} />} />
        <Route path="logout" element={<Login setAuth={setAuth} />} />
        <Route path="register" element={<Register />} />
        <Route path="news" element={<NewsDashboard isAuth={!!isAuth} user={auth?.user} />} />
        <Route path="news/:id" element={<NewsDetail />} />
        {isAuth && (
          <>
            <Route path="wardrobe" element={<WardrobeMain />} />
            <Route path="wardrobe/category/:category" element={<WardrobeCategory />} />
            <Route path="wardrobe/add" element={<AddCloth />} />
            <Route path="wardrobe/edit/:id" element={<EditCloth />} />
            <Route path="clothes" element={<WardrobeMain />} />
            <Route path="clothes/add" element={<AddCloth />} />
            <Route path="clothes/edit/:id" element={<EditCloth />} />
            <Route path="outfits" element={<Outfits />} />
            <Route path="outfits/add" element={<AddOutfit />} />
            <Route path="outfits/edit/:id" element={<EditOutfit />} />
            <Route path="trips" element={<Trips />} />
            <Route path="trips/add" element={<AddTrip />} />
            <Route path="trips/edit/:id" element={<EditTrip />} />
            <Route path="trips/:id/packing" element={<TripPacking />} />
            <Route path="stats" element={<Stats />} />
          </>
        )}
        {isAdmin && (
          <>
            <Route path="admin/news" element={<AdminNews />} />
            <Route path="admin/news/add" element={<AddNews />} />
            <Route path="admin/news/edit/:id" element={<EditNews />} />
          </>
        )}
      </Route>
    </Routes>
  );
}

export default RoutesList;
