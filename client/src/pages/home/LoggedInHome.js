import { Link } from 'react-router-dom';

function LoggedInHome({ user }) {
  const username = user?.username || 'User';

  const cards = [
    {
      to: '/wardrobe',
      title: 'Wardrobe',
      subtitle: 'Pregledaj garderobu',
    },
    {
      to: '/outfits',
      title: 'Outfits',
      subtitle: 'Kreiraj outfit-e',
    },
    {
      to: '/trips',
      title: 'Trips',
      subtitle: 'Planiraj putovanja',
    },
  ];

  return (
    <div
      className="relative w-full flex-1 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.45)), url('/pozadina.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4">
        <h1
          className="text-4xl md:text-6xl font-bold mb-12 text-center"
          style={{
            color: '#ffffff',
            textShadow: '0 4px 12px rgba(0,0,0,0.6)',
          }}
        >
          Welcome, {username}!
        </h1>

        <div className="flex flex-wrap gap-6 justify-center max-w-4xl">
          {cards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group relative flex flex-col items-center justify-center w-[160px] h-[160px] rounded-[18px] overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-xl"
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                background: 'rgba(255,255,255,0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              }}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 rounded-[18px] transition-colors duration-200 pointer-events-none" />
              <span
                className="relative z-10 text-xl font-semibold mb-1"
                style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              >
                {card.title}
              </span>
              <span
                className="relative z-10 text-sm font-medium opacity-95"
                style={{ color: '#f8f8f8', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
              >
                {card.subtitle}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoggedInHome;
