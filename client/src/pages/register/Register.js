import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EyeIcon({ show }) {
  return show ? (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-dusty-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-dusty-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '', confirm_password: '', form: '' });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: '', form: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ username: '', password: '', confirm_password: '', form: '' });

    if (!formData.username.trim()) {
      setErrors((prev) => ({ ...prev, username: 'Unesi username/email' }));
      return;
    }
    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: 'Unesi lozinku' }));
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setErrors((prev) => ({ ...prev, confirm_password: 'Lozinke se ne podudaraju.' }));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 409) {
        setErrors((prev) => ({ ...prev, form: 'Korisničko ime/email je već zauzeto.' }));
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setErrors((prev) => ({ ...prev, form: 'Greška pri registraciji. Pokušaj ponovo.' }));
        setLoading(false);
        return;
      }

      navigate('/login');
    } catch (error) {
      setErrors((prev) => ({ ...prev, form: 'Greška pri registraciji. Pokušaj ponovo.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 min-w-[400px] max-w-md">
      <h1 className="text-2xl font-bold text-dusty-900 mb-4">Registracija</h1>
      <form onSubmit={handleSubmit} id="register_form" className="w-full space-y-4">
        {errors.form && (
          <div className="text-red-600 text-sm py-2 px-3 rounded-btn bg-red-50 border border-red-200">
            {errors.form}
          </div>
        )}
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Username</label>
          <input
            className={`w-full border rounded-btn px-3 py-2 ${errors.username ? 'border-red-400' : 'border-dusty-200'}`}
            name="username"
            placeholder="Username"
            type="text"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <p className="text-red-600 text-xs mt-1">{errors.username}</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Password</label>
          <div className="relative">
            <input
              className={`w-full border rounded-btn px-3 py-2 pr-10 ${errors.password ? 'border-red-400' : 'border-dusty-200'}`}
              name="password"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dusty-600 hover:text-dusty-800"
              tabIndex={-1}
              aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
            >
              <EyeIcon show={showPassword} />
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-dusty-600 mb-1">Potvrdi password</label>
          <div className="relative">
            <input
              className={`w-full border rounded-btn px-3 py-2 pr-10 ${errors.confirm_password ? 'border-red-400' : 'border-dusty-200'}`}
              name="confirm_password"
              placeholder="Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirm_password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dusty-600 hover:text-dusty-800"
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
            >
              <EyeIcon show={showConfirmPassword} />
            </button>
          </div>
          {errors.confirm_password && (
            <p className="text-red-600 text-xs mt-1">{errors.confirm_password}</p>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Registracija...' : 'Registruj se'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
