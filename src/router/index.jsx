import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '../components/Common/Header';
import HomePage from '../pages/Home';
import Login from '../pages/Auth/LoginPage';
import Signup from '../pages/Auth/SignupPage';
import MyPage from '../pages/MyPage/MyPage';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

export default function AppRouter() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/mypage/*"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
