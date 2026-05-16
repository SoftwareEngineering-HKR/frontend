import { Routes, Route, Navigate } from "react-router-dom";
import Authentication from "./pages/Authentication.jsx";
import Overview from "./pages/Overview.jsx";
import { useState, useEffect } from "react";
import ConfirmDialog from "./components/common/ConfirmDialog.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Toast from "./components/common/Toast.jsx";
import { useWebSocket } from "./hooks/useWebSocket.js";
import { SmartHouseProvider } from "./context/SmartHouseContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

function App() {
  return (
    <>
      <AuthProvider>
        <SmartHouseProvider>
          <AppRoutes/>
        </SmartHouseProvider>
      </AuthProvider>
    </>
  );
}

function AppRoutes() {
  const { currentUser } = useAuth();
 
  return (
    <Routes>
      {/* Authentication Route */}
      <Route
        path="/authentication"
        element={ currentUser ? <Navigate to="/overview" /> : <Authentication/> }
      />

      {/* Overview Route */}
      <Route
        path="/overview"
        element={ <ProtectedRoute> <Overview/> </ProtectedRoute> }
      />

      {/* Admin Panel Route */}
      <Route
        path="/admin"
        element={ <ProtectedRoute adminOnly> <AdminPanel/> </ProtectedRoute> }
      />

      {/* Redirect to authentication if user types a not used path*/}
      <Route path="*" element={<Navigate to="/authentication" />} />
    </Routes>
  );
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser } = useAuth();
 
  if (!currentUser) {
    return <Navigate to="/authentication" />
  };

  if (adminOnly && !currentUser.isAdmin) {
    return <Navigate to="/overview" />;
  }
 
  return children;
}

export default App;
