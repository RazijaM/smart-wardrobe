import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div
      className="relative w-full flex-1 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.45)), url('/pozadina.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="relative z-10 w-full max-w-xl mx-auto p-[30px] text-center rounded-2xl"
        style={{
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          background: 'rgba(0,0,0,0.25)',
        }}
      >
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-3"
          style={{
            color: '#ffffff',
            textShadow: '0 4px 12px rgba(0,0,0,0.6)',
          }}
        >
          Smart Wardrobe
        </h1>
        <p
          className="text-xl font-medium mb-3"
          style={{
            color: '#f8f8f8',
            letterSpacing: '0.5px',
            textShadow: '0 2px 6px rgba(0,0,0,0.4)',
          }}
        >
          Planiraj garderobu, outfit-e i putovanja
        </p>
        <p
          className="text-sm mb-8 mx-auto max-w-[500px] opacity-90"
          style={{ color: '#f8f8f8' }}
        >
          Digitalni ormar koji ti pomaže planirati outfite i pakovanje za putovanja prema vremenskoj prognozi.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-[160px] h-12 rounded-btn font-medium text-white bg-transparent border-2 border-white hover:bg-dusty-pink/50 hover:scale-[1.03] hover:shadow-lg transition-all duration-200"
          >
            Prijava
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center w-[160px] h-12 rounded-btn font-medium text-white bg-transparent border-2 border-white hover:bg-dusty-pink/50 hover:scale-[1.03] hover:shadow-lg transition-all duration-200"
          >
            Registracija
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
