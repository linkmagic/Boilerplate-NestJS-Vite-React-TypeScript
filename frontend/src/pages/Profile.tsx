import { useGetMeQuery } from '../features/auth/api';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { data, isLoading, isError } = useGetMeQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state: RootState) => state.auth.user?.email);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching profile</p>;

  return (
    <div>
      <h2>Welcome, {data?.email || email}</h2>
      <p>ID: {data?.userId}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
