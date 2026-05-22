import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";

import { API } from "./api/axios";
import Dashboard from "./components/Dashboard";

export default function App() {

  const [isLogin, setIsLogin] = useState(true);

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {

      const endpoint = isLogin
        ? "/auth/login"
        : "/auth/register";

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : formData;

      const res = await API.post(
        endpoint,
        payload
      );

      alert(
        isLogin
          ? "Login Successful 🚀"
          : "Signup Successful 🎉"
      );

      if (res.data.token) {

        localStorage.setItem(
          "token",
          res.data.token
        );

        setLoggedIn(true);
      }

    } catch (error: any) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Authentication Failed"
      );
    }
  };

  if (loggedIn) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 overflow-hidden">

      <div className="absolute w-72 h-72 bg-purple-500/20 blur-3xl rounded-full top-10 left-10"></div>

      <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl shadow-2xl p-8 relative z-10">

        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Team Task Manager 🚀
        </h1>

        <p className="text-slate-300 text-center mb-8">
          {isLogin
            ? "Login to continue"
            : "Create your account"}
        </p>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >

          {!isLogin && (

            <div>

              <label className="text-slate-300 text-sm">
                Name
              </label>

              <div className="flex items-center bg-white/10 border border-white/10 rounded-xl px-4 mt-2">

                <FaUser className="text-slate-400" />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full bg-transparent outline-none px-3 py-4 text-white placeholder:text-slate-400"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>
          )}

          <div>

            <label className="text-slate-300 text-sm">
              Email
            </label>

            <div className="flex items-center bg-white/10 border border-white/10 rounded-xl px-4 mt-2">

              <FaEnvelope className="text-slate-400" />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none px-3 py-4 text-white placeholder:text-slate-400"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <div>

            <label className="text-slate-300 text-sm">
              Password
            </label>

            <div className="flex items-center bg-white/10 border border-white/10 rounded-xl px-4 mt-2">

              <FaLock className="text-slate-400" />

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none px-3 py-4 text-white placeholder:text-slate-400"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg"
          >
            {isLogin
              ? "Sign In"
              : "Create Account"}
          </button>

        </form>

        <p className="text-center text-slate-400 mt-6">

          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            onClick={() =>
              setIsLogin(!isLogin)
            }
            className="ml-2 text-indigo-400 hover:text-indigo-300"
          >
            {isLogin
              ? "Signup"
              : "Login"}
          </button>

        </p>

      </div>

    </div>
  );
}