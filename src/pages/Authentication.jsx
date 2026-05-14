import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function Authentication() {
  const { login, signup, loading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (username, password) => {
    await login(username, password);
  };

  const handleSignup = async (username, password) => {
    await signup(username, password);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 p-4 font-sans">
        <div className="bg-white dark:bg-slate-900 p-10 md:p-12 rounded-[2.5rem] shadow-xl w-full max-w-[480px] flex flex-col items-center border border-gray-100 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-500 dark:text-slate-400">
              {isLogin
                ? "Enter your details to sign in"
                : "Join us to get started today"}
            </p>
          </div>

          <div className="w-full">
            {isLogin ? (
              <LoginForm onLogin={handleLogin} isLoading={loading} error={error} />
            ) : (
              <RegisterForm onSignup={handleSignup} isLoading={loading} error={error} />
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-slate-800 w-full text-center">
            <p className="text-gray-500 dark:text-slate-400">
              {isLogin ? "New to SmartHome? " : "Already a member? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold hover:underline ml-1"
                disabled={loading}
              >
                {isLogin ? "Create Account" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}