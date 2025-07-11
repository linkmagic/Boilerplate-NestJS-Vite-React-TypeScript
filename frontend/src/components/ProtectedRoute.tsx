import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export default function ProtectedRoute({ children }: { children: React.JSX.Element }) {
  const token = useSelector((state: RootState) => state.auth.accessToken);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
