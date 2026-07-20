import React, { useState, useEffect } from "react";
import "./Modal.css";

function Modal({ activeItem, toggle, onSave }) {
  const [item, setItem] = useState(activeItem);

  useEffect(() => {
    setItem(activeItem);
  }, [activeItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItem({
      ...item,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Modal Submit:", item);
  onSave(item);
};

  return (
    <div className="modal-overlay open" onClick={toggle}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h3>{item.id ? "✏️ Edit Task" : "✨ New Task"}</h3>
            <button className="modal-close" type="button" onClick={toggle}>
              ✕
            </button>
          </div>
          <div className="modal-body">
            <label htmlFor="title">Task title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={item.title}
              onChange={handleChange}
              placeholder="e.g. Build the modal"
              required
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={item.description}
              onChange={handleChange}
              placeholder="Add some details…"
            />

            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={item.priority || "medium"}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="completed"
                  checked={item.completed}
                  onChange={handleChange}
                />
                Completed
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-cancel" type="button" onClick={toggle}>
              Cancel
            </button>
            <button className="btn-save" type="submit">
              💾 Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;