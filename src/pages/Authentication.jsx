// professional main auth page
import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function Authentication() {
  const [isLogin, setIsLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLogin(true);
  };

  // Logged In View (Profile Card)
  if (currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
        <div className="bg-white p-12 rounded-[2rem] shadow-2xl shadow-blue-900/5 w-full max-w-[420px] flex flex-col items-center text-center border border-gray-100">
          
          {/* Profile Avatar Placeholder */}
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg shadow-primary/30 text-white font-bold">
            {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-500 mb-8 text-lg">
            Logged in as <br/> 
            <span className="font-semibold text-primary">{currentUser.email}</span>
          </p>
          
          <button 
            onClick={handleLogout}
            className="w-full px-6 py-3.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Auth Forms View
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
      <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 w-full max-w-[480px] flex flex-col items-center border border-gray-100 relative overflow-hidden">
        
        {/* Decorative top shape */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>

        {/* Header */}
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-500">
                {isLogin ? "Enter your details to sign in" : "Join us to get started today"}
            </p>
        </div>

        {/* Toggle Form */}
        <div className="w-full">
            {isLogin ? (
                <LoginForm onLogin={handleAuthSuccess} />
            ) : (
                <RegisterForm onLogin={handleAuthSuccess} />
            )}
        </div>

        {/* Toggle Footer */}
        <div className="mt-10 pt-6 border-t border-gray-100 w-full text-center">
          <p className="text-gray-500">
            {isLogin ? "New to SmartHome? " : "Already a member? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:text-accent transition-colors ml-1"
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
