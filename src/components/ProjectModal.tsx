import { useState } from "react";
import { API } from "../api/axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  taskId?: string;
  initialData?: any;
}

export default function TaskModal({
  isOpen,
  onClose,
  onTaskCreated,
  taskId,
  initialData,
}: Props) {

  const [title, setTitle] = useState(
    initialData?.title || ""
  );

  const [description, setDescription] =
    useState(
      initialData?.description || ""
    );

  const [status, setStatus] = useState(
    initialData?.status || "Pending"
  );

  const [projectId, setProjectId] =
    useState("");

  if (!isOpen) return null;

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem("token");

      const payload = {
        title,
        description,
        status,
        project: projectId,
      };

      if (taskId) {

        await API.put(
          `/tasks/${taskId}`,
          payload,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      } else {

        await API.post(
          "/tasks",
          payload,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );
      }

      onTaskCreated();

      onClose();

    } catch (error) {

      console.log(error);

      alert("Failed to save task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-8">

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-4xl font-bold text-white">
            ➕ New Task
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-white"
          >
            ×
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="text-slate-300">
              Task Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full mt-2 bg-white/10 border border-white/10 rounded-xl px-4 py-4 text-white outline-none"
              placeholder="Enter task title"
              required
            />

          </div>

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
              placeholder="Enter description"
            />

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="text-slate-300">
                Project ID
              </label>

              <input
                type="text"
                value={projectId}
                onChange={(e) =>
                  setProjectId(
                    e.target.value
                  )
                }
                className="w-full mt-2 bg-white/10 border border-white/10 rounded-xl px-4 py-4 text-white outline-none"
                placeholder="Enter project id"
              />

            </div>

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

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-lg hover:scale-[1.02] transition"
          >
            {taskId
              ? "Update Task"
              : "Create Task"}
          </button>

        </form>

      </div>

    </div>
  );
}