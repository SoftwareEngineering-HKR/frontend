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

  if (currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 font-sans">
        <div className="bg-white dark:bg-gray-800 p-12 rounded-[2rem] shadow-xl w-full max-w-[420px] flex flex-col items-center text-center border border-gray-100 dark:border-gray-700">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg shadow-primary/30 text-white font-bold">
            {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
            Logged in as <br/> 
            <span className="font-semibold text-primary">{currentUser.email}</span>
          </p>
          <button 
            onClick={handleLogout}
            className="w-full px-6 py-3.5 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 font-sans">
      <div className="bg-white dark:bg-gray-800 p-10 md:p-12 rounded-[2.5rem] shadow-xl w-full max-w-[480px] flex flex-col items-center border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>

        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
                {isLogin ? "Enter your details to sign in" : "Join us to get started today"}
            </p>
        </div>

        <div className="w-full">
            {isLogin ? (
                <LoginForm onLogin={handleAuthSuccess} />
            ) : (
                <RegisterForm onLogin={handleAuthSuccess} />
            )}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700 w-full text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {isLogin ? "New to SmartHome? " : "Already a member? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:underline ml-1"
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}