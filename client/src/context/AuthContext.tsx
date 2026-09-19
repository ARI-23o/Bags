import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  isAdminLoggedIn: boolean;
  adminLoading: boolean;
  loginAdmin: (token: string, adminData: AdminUser) => void;
  logoutAdmin: () => Promise<void>;
  checkAdminAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('nehir_canta_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [adminLoading, setAdminLoading] = useState(true);

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('nehir_canta_admin_token');
      if (!token) {
        setAdmin(null);
        setAdminLoading(false);
        return;
      }

      // Configure auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/auth/admin/me');
      if (response.data.success && response.data.admin) {
        setAdmin(response.data.admin);
        localStorage.setItem('nehir_canta_admin', JSON.stringify(response.data.admin));
      } else {
        logoutAdmin();
      }
    } catch {
      logoutAdmin();
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const loginAdmin = (token: string, adminData: AdminUser) => {
    localStorage.setItem('nehir_canta_admin_token', token);
    localStorage.setItem('nehir_canta_admin', JSON.stringify(adminData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setAdmin(adminData);
  };

  const logoutAdmin = async () => {
    try {
      await api.post('/auth/admin/logout');
    } catch {}
    localStorage.removeItem('nehir_canta_admin_token');
    localStorage.removeItem('nehir_canta_admin');
    delete api.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAdminLoggedIn: !!admin,
        adminLoading,
        loginAdmin,
        logoutAdmin,
        checkAdminAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
