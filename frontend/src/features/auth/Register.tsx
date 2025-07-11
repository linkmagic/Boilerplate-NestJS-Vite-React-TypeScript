// features/auth/Register.tsx
import { useState } from 'react';
import { useRegisterMutation } from './api';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await register(form).unwrap();
      dispatch(setCredentials(res));
      navigate('/profile');
    } catch (err) {
      alert(`Login failed. Error: ${JSON.parse(err as string)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Full name"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
