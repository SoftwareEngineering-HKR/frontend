import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function Authentication({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, loading, error } = useAuth();

  const handleLogin = async (username, password) => {
    const result = await login(username, password);
    if (result.success) {
      onAuthSuccess({ username });
    }
  };

  const handleSignup = async (username, password) => {
    const result = await signup(username, password);
    if (result.success) {
      onAuthSuccess({ username });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
        <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl w-full max-w-[480px] flex flex-col items-center border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-500">
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

          <div className="mt-10 pt-6 border-t border-gray-100 w-full text-center">
            <p className="text-gray-500">
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