import { useEffect, useState } from "react";
import { API } from "../api/axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

interface Project {
  _id: string;
  name: string;
}

export default function TaskModal({
  isOpen,
  onClose,
  onTaskCreated,
}: Props) {

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState("Pending");

  const [project, setProject] =
    useState("");

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    const fetchProjects = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const res = await API.get(
          "/projects",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const projectData =
          res.data || [];

        setProjects(projectData);

      } catch (error) {

        console.log(error);
      }
    };

    if (isOpen) {
      fetchProjects();
    }

  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!project) {
      alert(
        "Please select a project"
      );
      return;
    }

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      await API.post(
        "/tasks",
        {
          title,
          description,
          status,
          project,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert("Task Created 🚀");

      setTitle("");
      setDescription("");
      setStatus("Pending");
      setProject("");

      onTaskCreated();

      onClose();

    } catch (error: any) {

      console.log(
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Failed to save task"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">

      <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-8">

        {/* Header */}

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-4xl font-bold text-white">
            ➕ Create Task
          </h2>

          <button
            onClick={onClose}
            className="text-3xl text-slate-400 hover:text-white transition"
          >
            ×
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Task Title */}

          <div>

            <label className="text-slate-300">
              Task Title
            </label>

            <input
              type="text"
              required
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full mt-2 bg-white/10 border border-white/10 rounded-xl px-4 py-4 text-white outline-none"
              placeholder="Enter task title"
            />

          </div>

          {/* Description */}

          <div>

            <label className="text-slate-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="w-full mt-2 bg-white/10 border border-white/10 rounded-xl px-4 py-4 text-white outline-none min-h-[140px]"
              placeholder="Enter task description"
            />

          </div>

          {/* Grid */}

          <div className="grid md:grid-cols-2 gap-6">

            {/* Project Dropdown */}

            <div>

              <label className="text-slate-300">
                Select Project
              </label>

              <select
                required
                value={project}
                onChange={(e) =>
                  setProject(
                    e.target.value
                  )
                }
                className="w-full mt-2 bg-white/10 border border-white/10 rounded-xl px-4 py-4 text-white outline-none"
              >

                <option value="">
                  Choose Project
                </option>

                {projects.map((p) => (

                  <option
                    key={p._id}
                    value={p._id}
                  >
                    {p.name}
                  </option>

                ))}

              </select>

            </div>

            {/* Status */}

            <div>

              <label className="text-slate-300">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                className="w-full mt-2 bg-white/10 border border-white/10 rounded-xl px-4 py-4 text-white outline-none"
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

            </div>

          </div>

          {/* Empty Projects Warning */}

          {projects.length === 0 && (

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-300">
              ⚠️ No projects found.
              Please create a project first.
            </div>

          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={
              loading || projects.length === 0
            }
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-lg transition-all ${
              loading
                ? "opacity-70"
                : "hover:scale-[1.02]"
            }`}
          >
            {loading
              ? "Creating..."
              : "Create Task"}
          </button>

        </form>

      </div>

    </div>
  );
}