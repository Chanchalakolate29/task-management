import { useSelector, useDispatch } from 'react-redux';
import { login, register, logout, clearAuthError } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (email, password, rememberMe) => {
    return await dispatch(login({ email, password, rememberMe })).unwrap();
  };

  const handleRegister = async (name, email, password, role) => {
    return await dispatch(register({ name, email, password, role })).unwrap();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const clearError = () => {
    dispatch(clearAuthError());
  };

  return {
    user: userInfo,
    isAuthenticated: !!userInfo && !!userInfo.token,
    isAdmin: userInfo?.role === 'Admin',
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError,
  };
};

export default useAuth;
