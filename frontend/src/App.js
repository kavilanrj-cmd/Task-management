import React, { useState, useEffect, useCallback } from "react";
import Modal from "./components/Modal";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:8000/api/task/";

function App() {
  const [viewCompleted, setViewCompleted] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    priority: "medium",
    completed: false,
  });

  // ----- Refresh list -----
  const refreshList = useCallback(() => {
    axios
      .get(API_URL)
      .then((res) => {
        console.log("🔄 Refreshed task list:", res.data);
        setTaskList(res.data);
      })
      .catch((err) => {
        console.error("Refresh error:", err);
      });
  }, []);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  // ----- Toggle (functional update) -----
  const toggle = () => setModal((prev) => !prev);

  // ----- Submit handler (the one you provided) -----
  const handleSubmit = (item) => {
    setLoading(true);

    const payload = {
      title: item.title.trim(),
      description: item.description.trim(),
      priority: item.priority || "medium",
      completed: item.completed,
    };

    console.log("📤 Sending payload:", payload);

    const request = item.id
      ? axios.put(`${API_URL}${item.id}/`, payload)
      : axios.post(API_URL, payload);

    request
      .then(() => {
        refreshList();
        setModal(false);
        setLoading(false);
        console.log("✅ Task saved successfully");
      })
      .catch((error) => {
        console.error("❌ Save error:", error.response?.data || error);
        alert(
          "Failed to save task.\n" +
          JSON.stringify(error.response?.data || error.message, null, 2)
        );
        setLoading(false);
      });
  };

  // ----- Delete -----
  const handleDelete = (item) => {
    if (!window.confirm("Delete this task?")) return;
    axios
      .delete(`${API_URL}${item.id}/`)
      .then(() => refreshList())
      .catch((err) => {
        console.error("Delete error:", err);
        alert("Could not delete task.");
      });
  };

  // ----- Stamp (toggle complete) -----
  const stampItem = (item) => {
    const updated = {
      title: item.title,
      description: item.description,
      priority: item.priority || "medium",
      completed: !item.completed,
    };
    axios
      .put(`${API_URL}${item.id}/`, updated)
      .then(() => refreshList())
      .catch((err) => {
        console.error("Stamp error:", err);
        alert("Could not update task status.");
      });
  };

  // ----- Create and Edit -----
  const createItem = () => {
    setActiveItem({
      title: "",
      description: "",
      priority: "medium",
      completed: false,
    });
    setModal(true);
  };

  const editItem = (item) => {
    setActiveItem({ ...item });
    setModal(true);
  };

  // ----- Stats -----
  const total = taskList.length;
  const openCount = taskList.filter((i) => !i.completed).length;
  const doneCount = taskList.filter((i) => i.completed).length;
  const highPriority = taskList.filter((i) => i.priority === "high" || i.priority === "urgent").length;
  const items = taskList.filter((item) => item.completed === viewCompleted);

  // ----- Render -----
  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <svg viewBox="0 0 24 24" width="32" height="32">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          TaskFlow
        </div>
        <div className="navbar-actions">
          <button className="nav-btn">📅 Calendar</button>
          <button
            className="nav-btn nav-btn-primary"
            onClick={createItem}
            disabled={loading}
          >
            {loading ? "⏳ Saving..." : "+ New Task"}
          </button>
        </div>
      </nav>

      <div className="stats-grid">
        <div className="stats-card">
          <span className="icon">📋</span>
          <div className="label">Total Tasks</div>
          <div className="value">{total}</div>
          <div className="sub">+{openCount} open</div>
        </div>
        <div className="stats-card">
          <span className="icon">✅</span>
          <div className="label">Completed</div>
          <div className="value">{doneCount}</div>
          <div className="sub">{total ? Math.round((doneCount/total)*100) : 0}% done</div>
        </div>
        <div className="stats-card">
          <span className="icon">⏳</span>
          <div className="label">In Progress</div>
          <div className="value">{openCount}</div>
          <div className="sub">{openCount > 0 ? "Keep going!" : "All done 🎉"}</div>
        </div>
        <div className="stats-card">
          <span className="icon">🔥</span>
          <div className="label">Priority</div>
          <div className="value">{highPriority}</div>
          <div className="sub">high urgency</div>
        </div>
      </div>

      <div className="dashboard">
        <aside className="sidebar">
          <div
            className={`sidebar-item ${!viewCompleted ? "active" : ""}`}
            onClick={() => setViewCompleted(false)}
          >
            <span className="emoji">📌</span> Open
          </div>
          <div
            className={`sidebar-item ${viewCompleted ? "active" : ""}`}
            onClick={() => setViewCompleted(true)}
          >
            <span className="emoji">✅</span> Completed
          </div>
          <div className="sidebar-item" onClick={createItem}>
            <span className="emoji">➕</span> New Task
          </div>
        </aside>

        <main className="main-content">
          {items.length === 0 && (
            <div className="empty-state">
              {viewCompleted
                ? "Nothing completed yet. Stamp a task once it's done."
                : "The ledger is clear. Add your first task above."}
            </div>
          )}
          {items.map((item) => (
            <div key={item.id} className="task-item">
              <div className="info" onClick={() => editItem(item)}>
                <span
                  className={`checkbox ${item.completed ? "checked" : ""}`}
                  onClick={(e) => { e.stopPropagation(); stampItem(item); }}
                >
                  {item.completed && "✓"}
                </span>
                <span className={`title ${item.completed ? "done" : ""}`}>
                  {item.title}
                </span>
                {item.description && (
                  <span className="task-desc">{item.description}</span>
                )}
              </div>
              <div className="task-actions">
                <span className={`tag ${item.completed ? "done-tag" : ""}`}>
                  {item.completed ? "done" : "open"}
                </span>
                <button
                  className="icon-btn edit"
                  onClick={() => editItem(item)}
                  aria-label="Edit"
                >
                  ✎
                </button>
                <button
                  className="icon-btn delete"
                  onClick={() => handleDelete(item)}
                  aria-label="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </main>
      </div>

      {modal && (
        <Modal
          activeItem={activeItem}
          toggle={toggle}
          onSave={handleSubmit}
        />
      )}
    </div>
  );
}

export default App;