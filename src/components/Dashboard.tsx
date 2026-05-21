import { useState, useEffect } from "react";
import {
  FaTasks,
  FaProjectDiagram,
  FaCheckCircle,
  FaSignOutAlt,
  FaPlus,
  FaClock,
  FaHourglassEnd,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { API } from "../api/axios";
import ProjectModal from "./ProjectModal";
import TaskModal from "./TaskModal";

interface Project {
  _id: string;
  name: string;
  description: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  projectId?: string;
}

interface Stats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const statusConfig = {
  "Completed": { color: "bg-green-500/20", textColor: "text-green-400", icon: FaCheckCircle },
  "In Progress": { color: "bg-blue-500/20", textColor: "text-blue-400", icon: FaClock },
  "Pending": { color: "bg-yellow-500/20", textColor: "text-yellow-400", icon: FaHourglassEnd },
};

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({ totalProjects: 0, totalTasks: 0, completedTasks: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No auth token found");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [projectsRes, tasksRes] = await Promise.all([
        API.get("/projects", { headers }),
        API.get("/tasks", { headers }),
      ]);

      const projectsData = projectsRes.data || [];
      const tasksData = tasksRes.data || [];

      setProjects(projectsData);
      setTasks(tasksData);

      const completed = tasksData.filter((t: Task) => t.status === "Completed").length;
      setStats({
        totalProjects: projectsData.length,
        totalTasks: tasksData.length,
        completedTasks: completed,
      });
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await API.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(tasks.filter((t) => t._id !== taskId));
      const newCompleted = tasks.filter((t) => t._id !== taskId && t.status === "Completed").length;
      setStats((prev) => ({
        ...prev,
        totalTasks: prev.totalTasks - 1,
        completedTasks: newCompleted,
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: "Pending" | "In Progress" | "Completed") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const updatedTask = await API.put(`/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));

      const newCompleted = tasks
        .map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        .filter((t) => t.status === "Completed").length;

      setStats((prev) => ({
        ...prev,
        completedTasks: newCompleted,
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return config?.icon || FaTasks;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl"
        >
          ⚙️
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex">
      {/* Animated Gradients */}
      <div className="fixed w-96 h-96 bg-purple-500/10 blur-3xl rounded-full top-20 left-0"></div>
      <div className="fixed w-96 h-96 bg-blue-500/10 blur-3xl rounded-full bottom-20 right-0"></div>

      {/* Sidebar - Project Navigation */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold">🚀 TaskFlow</h1>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>

        <nav className="space-y-4 mb-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="w-full text-left px-4 py-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 transition-all"
          >
            📊 Dashboard
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition-all">
            📁 Projects ({projects.length})
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition-all">
            ✓ Tasks ({tasks.length})
          </motion.button>
        </nav>

        {/* Projects List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase">Recent Projects</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setProjectModalOpen(true)}
              className="cursor-pointer hover:text-indigo-400 transition-colors"
            >
              <FaPlus />
            </motion.button>
          </div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-slate-500 text-sm">No projects yet</p>
            ) : (
              projects.slice(0, 5).map((project) => (
                <motion.div
                  key={project._id}
                  variants={itemVariants}
                  whileHover={{ x: 8 }}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer border border-white/5 transition-all"
                >
                  <p className="text-sm font-semibold truncate">{project.name}</p>
                  <p className="text-xs text-slate-400 truncate">{project.description}</p>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-5xl font-bold mb-2">Dashboard</h2>
          <p className="text-slate-400 mb-10">Welcome back 👋 Here's your project overview</p>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
            {error}
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -5 }} className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-slate-300 mb-2">Total Projects</h3>
                <p className="text-5xl font-bold">{stats.totalProjects}</p>
              </div>
              <FaProjectDiagram className="text-4xl text-purple-400/40" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -5 }} className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-slate-300 mb-2">Total Tasks</h3>
                <p className="text-5xl font-bold">{stats.totalTasks}</p>
              </div>
              <FaTasks className="text-4xl text-blue-400/40" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -5 }} className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-slate-300 mb-2">Completed</h3>
                <p className="text-5xl font-bold">{stats.completedTasks}</p>
                <p className="text-sm text-slate-400 mt-1">
                  {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}% completion
                </p>
              </div>
              <FaCheckCircle className="text-4xl text-green-400/40" />
            </div>
          </motion.div>
        </motion.div>

        {/* Tasks Section */}
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">📋 Your Tasks</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingTask(null);
                setTaskModalOpen(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <FaPlus /> New Task
            </motion.button>
          </motion.div>

          {tasks.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-slate-400 text-lg">No tasks yet. Create your first task! 🎯</p>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task, index) => {
                const config = statusConfig[task.status as keyof typeof statusConfig];
                const StatusIcon = getStatusIcon(task.status);

                return (
                  <motion.div
                    key={task._id}
                    variants={itemVariants}
                    whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(139, 92, 246, 0.3)" }}
                    className={`${config.color} border border-white/10 rounded-2xl p-6 backdrop-blur-xl cursor-pointer transition-all hover:border-white/20`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold truncate">{task.title}</h4>
                        <p className="text-sm text-slate-300 mt-1 line-clamp-2">{task.description}</p>
                      </div>
                      <StatusIcon className={`${config.textColor} text-lg ml-2`} />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10 mb-4">
                      <motion.select
                        whileHover={{ scale: 1.05 }}
                        value={task.status}
                        onChange={(e) =>
                          handleUpdateTaskStatus(
                            task._id,
                            e.target.value as "Pending" | "In Progress" | "Completed"
                          )
                        }
                        className={`${config.textColor} px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </motion.select>
                      <span className="text-xs text-slate-400">#{index + 1}</span>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingTask(task);
                          setTaskModalOpen(true);
                        }}
                        className="flex-1 py-2 bg-white/10 hover:bg-indigo-500/30 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                      >
                        <FaEdit /> Edit
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteTask(task._id)}
                        className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/30 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                      >
                        <FaTrash /> Delete
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onProjectCreated={fetchData}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onTaskCreated={fetchData}
        taskId={editingTask?._id}
        initialData={editingTask}
      />
    </div>
  );
}