import { useState } from 'react';
import { AuthService } from '../services/auth';
import { UserAccount } from '../types/auth';

export const useAuthSession = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const session = AuthService.getSession();
    return session ? session.user : null;
  });
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
      AuthService.clearSession();
      setCurrentUser(null);
    }
  };

  const handleProfileUpdated = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
  };

  return {
    currentUser,
    showProfileModal,
    setShowProfileModal,
    handleLoginSuccess,
    handleLogout,
    handleProfileUpdated
  };
};
