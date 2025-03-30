import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import useUserStore from "../stores/userStore";

function Login() {
  const navigate = useNavigate();
  const [loginInput, setLoginInput] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const login = useUserStore((state) => state.login);

  const handleLoginChange = (e) => {
    setLoginInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const { username, password } = loginInput;

    // Validation
    if (username.trim() === "" || password.trim() === "") {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send API request to login
      let data = await login(loginInput);
      console.log("Token after login:", data.token);
      
      // Navigate to home page
      navigate("/");
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      console.log(err);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 z-0">
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        {/* Stars effect */}
        <div className="stars"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo and Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <Book className="text-yellow-500 mr-2" size={32} />
            <h1 className="text-3xl font-bold text-yellow-500">8 LINES</h1>
          </div>
          <p className="text-gray-300 text-lg">Welcome back to your literary journey</p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border border-gray-700 transform transition-all hover:scale-[1.01]">
          {/* Card Header */}
          <div className="bg-gray-800 bg-opacity-80 p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white text-center">Sign In</h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-6">
            {/* Username Field */}
            <div className="group">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={loginInput.username}
                  onChange={handleLoginChange}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={loginInput.password}
                  onChange={handleLoginChange}
                  required
                  className="block w-full pl-10 pr-10 py-2 border border-gray-600 rounded-md bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-white focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <a href="#" className="text-sm text-yellow-500 hover:text-yellow-400 hover:underline transition-colors">
                Forgot your password?
              </a>
            </div>

            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          {/* Register Section */}
          <div className="px-6 py-4 bg-gray-800 bg-opacity-80 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-300">
              Don't have an account?{' '}
              <button
                className="font-medium text-yellow-500 hover:text-yellow-400 hover:underline transition-colors"
                onClick={() => setIsRegisterOpen(true)}
              >
                Sign up now
              </button>
            </p>
          </div>
        </div>

        {/* Quote Section */}
        <div className="mt-8 text-center max-w-md">
          <p className="text-gray-300 italic">
            "Journey knows no limits—except those set by imagination."
          </p>
          <p className="text-gray-400 mt-1">- Visarut, Founder of '8 Lines'</p>
        </div>
      </div>

      {/* Register Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Register form content here */}
              {/* You can add your register form here */}
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx="true">{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .stars:before, .stars:after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image:
            radial-gradient(2px 2px at 20px 30px, white, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 40px 70px, white, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 90px 40px, white, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 160px 120px, white, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 230px 190px, white, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          opacity: 0.2;
        }

        .stars:after {
          background-size: 300px 300px;
          background-position: 50px 50px;
          animation: stars 15s linear infinite;
        }

        @keyframes stars {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-200px);
          }
        }
      `}</style>
    </div>
  );
}

export default Login;