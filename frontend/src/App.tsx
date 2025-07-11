// src/App.tsx
import { Routes, Route, Link } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Profile from './pages/Profile.tsx';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{' '}
        <Link to="/register">Register</Link> | <Link to="/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
