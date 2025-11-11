import { useEffect, useState, useRef } from "react";
import { handleError, handleSuccess } from "./Handle";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  const username = localStorage.getItem("loggedInUser");
  const useremail = localStorage.getItem("userEmail");

  // ref to avoid duplicate localStorage trigger in StrictMode
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (!useremail) return; // safety check

    const key = `tasks_${useremail}`;

    if (isFirstRun.current) {
      // Load user's specific tasks
      const savedTasks = JSON.parse(localStorage.getItem(key)) || [];
      setTasks(savedTasks);
      isFirstRun.current = false;
      return; // skip saving first time
    }

    // Save user's tasks after first render
    localStorage.setItem(key, JSON.stringify(tasks));
  }, [tasks, useremail]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      handleError("Task cannot be empty..");
      return;
    }

    if (editId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editId ? { ...task, text: newTask } : task
        )
      );
      setEditId(null);
      handleSuccess("Task updated successfully!");
    } else {
      const newTaskItem = {
        id: Date.now(),
        text: newTask,
        completed: false,
      };
      setTasks((prev) => [...prev, newTaskItem]);
      handleSuccess("Your task is added");
    }
    setNewTask("");
  };

  const handleToggle = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleEdit = (id) => {
    const task = tasks.find((t) => t.id === id);
    setNewTask(task.text);
    setEditId(id);
  };

  const hanldelogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userEmail");
    handleSuccess("You logout successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-blue-50 via-gray-100 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <h1 className="text-2xl font-semibold text-blue-700">My Dashboard</h1>

        <div className="text-center">
          <h2 className="text-gray-800 font-medium">{username}</h2>
          <h3 className="text-gray-500 text-sm">{useremail}</h3>
        </div>

        <button
          onClick={hanldelogout}
          className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2 rounded-lg transition font-medium"
        >
          Logout
        </button>
      </header>

      {/* Main */}
      <main className="grow flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            📝 My Todo Tasks
          </h2>

          {/* Add Task */}
          <form
            onSubmit={handleAddTask}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter your task..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2 rounded-lg transition font-medium"
            >
              {editId ? "Update" : "Add"}
            </button>
          </form>

          {/* Task List */}
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center italic">
              No tasks yet — add one above!
            </p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-lg px-4 py-3 transition-shadow ${
                    task.completed
                      ? "bg-green-100 border-green-300"
                      : "bg-gray-50 hover:shadow-md"
                  }`}
                >
                  <span
                    onClick={() => handleToggle(task.id)}
                    className={`cursor-pointer wrap-break-words ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800 font-medium"
                    }`}
                  >
                    {task.text}
                  </span>

                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleEdit(task.id)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-600 py-4 text-sm">
        © {new Date().getFullYear()} My Todo Dashboard
      </footer>

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
