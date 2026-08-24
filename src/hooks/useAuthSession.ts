import { useState, useEffect } from 'react';
import { AuthService } from '../services/auth';
import { UserAccount } from '../types/auth';

export const useAuthSession = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const session = AuthService.getSession();
    return session ? session.user : null;
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLoginSuccess = (user: UserAccount) => {
    AuthService.setSession(user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    AuthService.clearSession();
    setCurrentUser(null);
    setShowLogoutConfirm(false);
  };

  const handleProfileUpdated = (updatedUser: UserAccount) => {
    AuthService.setSession(updatedUser);
    setCurrentUser(updatedUser);
  };

  return {
    currentUser,
    showProfileModal,
    setShowProfileModal,
    showLogoutConfirm,
    setShowLogoutConfirm,
    handleLoginSuccess,
    handleLogout,
    handleProfileUpdated
  };
};
