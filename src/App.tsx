import { useState, useEffect } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { API } from "./api/axios";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      alert("Login Successful 🚀");
      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <div className="text-4xl animate-spin">⚙️</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4">

      <div className="absolute w-72 h-72 bg-purple-500/20 blur-3xl rounded-full top-10 left-10"></div>

      <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl shadow-2xl p-8 relative z-10">

        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Team Task Manager 🚀
        </h1>

        <p className="text-slate-300 text-center mb-8">
          Manage projects and tasks beautifully
        </p>

        <form
          className="space-y-5"
          onSubmit={handleLogin}
        >

          <div>
            <label className="text-slate-300 text-sm">
              Email
            </label>

            <div className="flex items-center bg-white/10 border border-white/10 rounded-xl px-4 mt-2">

              <FaEnvelope className="text-slate-400" />

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none px-3 py-4 text-white placeholder:text-slate-400"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
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
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none px-3 py-4 text-white placeholder:text-slate-400"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg"
          >
            Sign In
          </button>

        </form>

      </div>
    </div>
  );
}