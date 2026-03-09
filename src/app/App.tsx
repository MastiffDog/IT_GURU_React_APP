import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/ui/LoginPage';
import { ProductPage } from '../pages/productsPage/ProductPage';
import { NotFound } from '../pages/notFound/NotFound';
import { Guard } from '../shared/guard/Guard';
import { useEffect } from 'react';
import { useAuthStore } from '../features/auth/model/authStore';

import './App.css';

const AppRoutes: React.FC = () => {
  // hydrate persisted token on startup
  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/products"
            element={
              <Guard>
                <ProductPage />
              </Guard>
            }
          />
          <Route
            path="*"
            element={
              <Guard>
                <NotFound />
              </Guard>
            }
          />
          <Route path="/login" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AppRoutes;