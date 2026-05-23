import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { InstallPWABanner } from './components/InstallPWABanner';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <RouterProvider router={router} />
          <InstallPWABanner />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
