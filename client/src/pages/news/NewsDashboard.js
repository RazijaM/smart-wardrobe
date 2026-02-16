import { Link } from 'react-router-dom';

function NewsDashboard({ isAuth, user }) {
  const username =
    user?.username ||
    user?.name ||
    (typeof user?.email === 'string' ? user.email.split('@')[0] : null) ||
    'there';

  return (
    <div className="w-full flex-1">
      <section
        className="relative w-full h-full min-h-full overflow-hidden bg-dusty-200"
        style={{
          backgroundImage: 'url(/pozadina.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-dusty-900/45 to-dusty-900/25" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg z-10">
            {isAuth ? `Welcome back, ${username}!` : 'Smart Wardrobe'}
          </h1>

          {isAuth && (
            <div className="mt-9 w-full z-10 px-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mx-auto">
                <Link
                  to="/wardrobe"
                  className="rounded-soft border border-dusty-200/40 bg-dusty-50/90 backdrop-blur-sm px-8 py-5 text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-dusty-100/90 hover:border-dusty-200/70 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dusty-200"
                >
                  <div className="text-lg font-semibold text-dusty-900">Wardrobe</div>
                  <div className="text-dusty-700 text-sm mt-1">Pregledaj garderobu</div>
                </Link>
                <Link
                  to="/outfits"
                  className="rounded-soft border border-dusty-200/40 bg-dusty-50/90 backdrop-blur-sm px-8 py-5 text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-dusty-100/90 hover:border-dusty-200/70 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dusty-200"
                >
                  <div className="text-lg font-semibold text-dusty-900">Outfits</div>
                  <div className="text-dusty-700 text-sm mt-1">Kreiraj outfit-e</div>
                </Link>
                <Link
                  to="/trips"
                  className="rounded-soft border border-dusty-200/40 bg-dusty-50/90 backdrop-blur-sm px-8 py-5 text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-dusty-100/90 hover:border-dusty-200/70 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dusty-200"
                >
                  <div className="text-lg font-semibold text-dusty-900">Trips</div>
                  <div className="text-dusty-700 text-sm mt-1">Planiraj putovanja</div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default NewsDashboard;
