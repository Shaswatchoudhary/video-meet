import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AppContext } from './Context';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [dashboardData, setDashboardData] = useState({
    upcomingMeetings: [],
    recentMeetings: [],
    subscription: null,
    analytics: null,
    loading: true
  });

  const axiosInstance = useMemo(() => axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }), [token]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    setDashboardData(prev => ({ ...prev, loading: true }));
    try {
      const [upcoming, recent, sub, analytics] = await Promise.all([
        axiosInstance.get('/meetings/upcoming'),
        axiosInstance.get('/meetings/recent'),
        axiosInstance.get('/dashboard/subscription'),
        axiosInstance.get('/dashboard/analytics')
      ]);

      setDashboardData({
        upcomingMeetings: upcoming.data,
        recentMeetings: recent.data,
        subscription: sub.data,
        analytics: analytics.data,
        loading: false
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  }, [token, axiosInstance]);

  useEffect(() => {
    const loadDashboard = async () => {
      if (token) {
        await fetchDashboardData();
      }
    };
    loadDashboard();
  }, [token, fetchDashboardData]);

  return (
    <AppContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      dashboardData, 
      fetchDashboardData,
      axiosInstance 
    }}>
      {children}
    </AppContext.Provider>
  );
};


