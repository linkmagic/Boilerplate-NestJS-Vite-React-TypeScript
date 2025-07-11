import { useState } from 'react';
import { useLoginMutation } from './api';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      dispatch(setCredentials(res));
      navigate('/profile');
    } catch (err) {
      console.log(`Login failed. Error: ${JSON.parse(err as string)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
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
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
