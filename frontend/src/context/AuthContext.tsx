import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { User, Tenant, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, tenantCode?: string, portalRole?: string) => Promise<any>;
  quickLoginAsRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  setTenantCode: (code: string) => void;
  activeTenantCode: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  tenant: null,
  token: null,
  loading: true,
  login: async () => {},
  quickLoginAsRole: async () => {},
  logout: () => {},
  setTenantCode: () => {},
  activeTenantCode: 'dps-rkp',
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sms_token'));
  const [activeTenantCode, setActiveTenantCodeState] = useState<string>(
    () => localStorage.getItem('sms_tenant_code') || 'dps-rkp'
  );
  const [loading, setLoading] = useState<boolean>(true);

  const setTenantCode = (code: string) => {
    setActiveTenantCodeState(code);
    localStorage.setItem('sms_tenant_code', code);
  };

  const fetchCurrentUser = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        if (res.data.user.tenantId) {
          setTenant(res.data.user.tenantId);
          if (res.data.user.tenantId.code) {
            setTenantCode(res.data.user.tenantId.code);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to restore session:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email: string, password: string, tenantCode?: string, portalRole?: string) => {
    const codeToUse = tenantCode || activeTenantCode;
    const res = await api.post('/auth/login', {
      email,
      password,
      tenantCode: codeToUse,
      portalRole,
    });

    if (res.data.success) {
      const newToken = res.data.token;
      localStorage.setItem('sms_token', newToken);
      setToken(newToken);
      setUser(res.data.user);
      if (res.data.tenant) {
        setTenant(res.data.tenant);
        localStorage.setItem('sms_tenant_id', res.data.tenant._id);
        setTenantCode(res.data.tenant.code);
      }
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed.');
  };

  const quickLoginAsRole = async (role: UserRole) => {
    setLoading(true);
    try {
      const roleEmails: Record<UserRole, string> = {
        SUPER_ADMIN: 'superadmin@softdeals.in',
        SCHOOL_ADMIN: 'admin@dps.edu.in',
        PRINCIPAL: 'principal@dps.edu.in',
        TEACHER: 'teacher@dps.edu.in',
        ACCOUNTANT: 'accounts@dps.edu.in',
        STUDENT: 'student@dps.edu.in',
        PARENT: 'parent@dps.edu.in',
      };

      const email = roleEmails[role] || 'admin@dps.edu.in';
      await login(email, 'Password@123', 'dps-rkp');
    } catch (err: any) {
      alert(`Quick login failed: ${err.message || 'Error logging in'}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('sms_token');
    localStorage.removeItem('sms_tenant_id');
    setToken(null);
    setUser(null);
    setTenant(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        token,
        loading,
        login,
        quickLoginAsRole,
        logout,
        setTenantCode,
        activeTenantCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
