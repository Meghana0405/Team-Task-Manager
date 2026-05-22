import { useState, useEffect } from "react";

import {
  FaTasks,
  FaProjectDiagram,
  FaCheckCircle,
  FaSignOutAlt,
  FaPlus,
  FaClock,
  FaHourglassEnd,
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
}

interface Stats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
}

const statusConfig = {
  Completed: {
    color: "bg-green-500/10 border-green-500/30",
    textColor: "text-green-400",
    icon: FaCheckCircle,
  },

  "In Progress": {
    color: "bg-blue-500/10 border-blue-500/30",
    textColor: "text-blue-400",
    icon: FaClock,
  },

  Pending: {
    color: "bg-yellow-500/10 border-yellow-500/30",
    textColor: "text-yellow-400",
    icon: FaHourglassEnd,
  },
};

export default function Dashboard() {

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [stats, setStats] =
    useState<Stats>({
      totalProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [projectModalOpen, setProjectModalOpen] =
    useState(false);

  const [taskModalOpen, setTaskModalOpen] =
    useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {

        setError("No token found");

        setLoading(false);

        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let projectsData: Project[] = [];
      let tasksData: Task[] = [];

      // FETCH PROJECTS

      try {

        const projectsRes =
          await API.get(
            "/projects",
            { headers }
          );

        projectsData =
          projectsRes.data || [];

      } catch (error) {

        console.log(
          "Projects API failed",
          error
        );
      }

      // FETCH TASKS

      try {

        const tasksRes =
          await API.get(
            "/tasks",
            { headers }
          );

        tasksData =
          tasksRes.data || [];

      } catch (error) {

        console.log(
          "Tasks API failed",
          error
        );
      }

      setProjects(projectsData);

      setTasks(tasksData);

      const completed =
        tasksData.filter(
          (task: Task) =>
            task.status === "Completed"
        ).length;

      setStats({
        totalProjects:
          projectsData.length,

        totalTasks:
          tasksData.length,

        completedTasks:
          completed,
      });

    } catch (err) {

      console.log(err);

      setError(
        "Failed to load dashboard"
      );

    } finally {

      setLoading(false);
    }
  };

  const handleDeleteTask = async (
    taskId: string
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      await API.delete(
        `/tasks/${taskId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      fetchData();

    } catch (err) {

      console.log(err);
    }
  };

  const handleUpdateTaskStatus =
    async (
      taskId: string,
      status: string
    ) => {

      try {

        const token =
          localStorage.getItem("token");

        await API.put(
          `/tasks/${taskId}`,
          { status },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchData();

      } catch (err) {

        console.log(err);
      }
    };

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.reload();
  };

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-4xl">
        ⚙️ Loading Dashboard...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row overflow-hidden">

      {/* Sidebar */}

      <aside className="hidden md:flex md:w-72 flex-col bg-white/5 border-r border-white/10 backdrop-blur-xl p-6 overflow-y-auto">

        <div className="flex items-center justify-between mb-10">

          <h1 className="text-4xl font-bold">
            🚀 TaskFlow
          </h1>

          <button
            onClick={handleLogout}
            className="hover:text-red-400 transition"
          >
            <FaSignOutAlt />
          </button>

        </div>

        {/* Navigation */}

        <div className="space-y-4">

          <button className="w-full text-left px-4 py-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
            📊 Dashboard
          </button>

          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition">
            📁 Projects ({projects.length})
          </button>

          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition">
            ✓ Tasks ({tasks.length})
          </button>

        </div>

        {/* Recent Projects */}

        <div className="mt-10">

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-sm uppercase text-slate-400 font-bold">
              Recent Projects
            </h3>

            <button
              onClick={() =>
                setProjectModalOpen(true)
              }
              className="hover:text-indigo-400"
            >
              <FaPlus />
            </button>

          </div>

          <div className="space-y-3">

            {projects.map((project) => (

              <div
                key={project._id}
                className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition"
              >

                <h4 className="text-white font-medium">
                  {project.name}
                </h4>

                <p className="text-slate-400 text-xs mt-1 truncate">
                  {project.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </aside>

      {/* Main Content */}

      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8">

        {/* Header */}

        <div className="mb-10">

          <h2 className="text-3xl md:text-6xl font-bold mb-2">
            Dashboard
          </h2>

          <p className="text-slate-400">
            Welcome back 👋 Here's your productivity overview
          </p>

        </div>

        {/* Error */}

        {error && (

          <div className="mb-6 bg-red-500/20 border border-red-500/40 p-4 rounded-xl text-red-300">
            {error}
          </div>

        )}

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="rounded-3xl p-6 bg-purple-500/10 border border-purple-500/30">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-300">
                  Total Projects
                </p>

                <h3 className="text-5xl font-bold mt-2">
                  {stats.totalProjects}
                </h3>

              </div>

              <FaProjectDiagram className="text-4xl text-purple-400/50" />

            </div>

          </div>

          <div className="rounded-3xl p-6 bg-blue-500/10 border border-blue-500/30">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-300">
                  Total Tasks
                </p>

                <h3 className="text-5xl font-bold mt-2">
                  {stats.totalTasks}
                </h3>

              </div>

              <FaTasks className="text-4xl text-blue-400/50" />

            </div>

          </div>

          <div className="rounded-3xl p-6 bg-green-500/10 border border-green-500/30">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-300">
                  Completed
                </p>

                <h3 className="text-5xl font-bold mt-2">
                  {stats.completedTasks}
                </h3>

              </div>

              <FaCheckCircle className="text-4xl text-green-400/50" />

            </div>

          </div>

        </div>

        {/* Tasks Header */}

        <div className="flex items-center justify-between mb-6">

          <h3 className="text-3xl font-bold">
            📋 Your Tasks
          </h3>

          <button
            onClick={() =>
              setTaskModalOpen(true)
            }
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl font-semibold hover:scale-105 transition flex items-center gap-2"
          >
            <FaPlus />
            New Task
          </button>

        </div>

        {/* Tasks */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">

          {tasks.map((task, index) => {

            const config =
              statusConfig[
                task.status as keyof typeof statusConfig
              ];

            const StatusIcon =
              config.icon;

            return (

              <motion.div
                whileHover={{ y: -5 }}
                key={task._id}
                className={`${config.color} border rounded-3xl p-6 min-h-[280px] backdrop-blur-xl`}
              >

                <div className="flex items-start justify-between mb-4">

                  <div>

                    <h4 className="text-xl font-bold">
                      {task.title}
                    </h4>

                    <p className="text-slate-300 mt-2 line-clamp-3">
                      {task.description}
                    </p>

                  </div>

                  <StatusIcon
                    className={`${config.textColor} text-xl`}
                  />

                </div>

                <div className="flex items-center justify-between mt-6 mb-4">

                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleUpdateTaskStatus(
                        task._id,
                        e.target.value
                      )
                    }
                    className="bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm"
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                  </select>

                  <span className="text-slate-400 text-sm">
                    #{index + 1}
                  </span>

                </div>

                <button
                  onClick={() =>
                    handleDeleteTask(task._id)
                  }
                  className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/30 transition flex items-center justify-center gap-2"
                >
                  <FaTrash />
                  Delete
                </button>

              </motion.div>
            );
          })}

        </div>

      </main>

      {/* Modals */}

      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() =>
          setProjectModalOpen(false)
        }
        onProjectCreated={fetchData}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() =>
          setTaskModalOpen(false)
        }
        onTaskCreated={fetchData}
      />

    </div>
  );
}
