import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('/api/checkingAuthenticated')
      .then(res => {
        if (res.data.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
        setAuthLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setAuthLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
