import React from 'react';
import { Login } from './components/auth/Login';
import { Dashboard } from './pages/Dashboard';
import { Toast } from './components/ui/Toast';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isLoggedIn, isLoading, checkAuthStatus } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Toast />
      {!isLoggedIn ? (
        <Login onLogin={checkAuthStatus} />
      ) : (
        <Dashboard />
      )}
    </>
  );
}

export default App;