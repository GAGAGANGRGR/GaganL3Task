
import React, { useState } from "react";
import { format, startOfWeek, addDays, isBefore, isToday } from "date-fns";
import "./App.css"; // Import the external CSS file
import EditModal from "./EditModal";

const TaskContainer = ({ tasks, handleDelete, handleEdit, handleAddTask }) => {
  return (
    <div className="task-container">
      {tasks.map((task) => (
        <div key={task.id} className="task">
          <div className="task-details">
            <h2>{task.title}</h2>
            <p>{task.description}</p>
          </div>
          <div className="task-buttons">
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
            <button onClick={() => handleAddTask(task.date)}>Add Task</button>
          </div>
        </div>
      ))}
    </div>
  );
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    if (title && selectedDate) {
      const newTask = {
        id: Date.now(),
        title,
        description,
        date: selectedDate,
      };

      setTasks([...tasks, newTask]);
      setTitle("");
      setDescription("");
      setIsModalOpen(false); // Close the modal after saving
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleDelete = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleAddTask = (date) => {
    setSelectedDate(date);
    setTitle("");
    setDescription("");
    setEditingTask(null); // Clear any previous editing task
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleModalSave = (taskId, editedTitle, editedDescription, isNewTask) => {
    const updatedTasks = isNewTask
      ? [...tasks, { id: Date.now(), title: editedTitle, description: editedDescription, date: selectedDate }]
      : tasks.map((task) =>
        task.id === taskId
          ? { ...task, title: editedTitle, description: editedDescription }
          : task
      );
    setTasks(updatedTasks);
    setIsModalOpen(false);
  };

  const handleDateChange = (newDate) => {
    if (!isBefore(newDate, new Date()) || isToday(newDate)) {
      setSelectedDate(newDate);
    }
  };

  const renderDayPicker = () => {
    const startOfCurrentWeek = startOfWeek(selectedDate);
    const tasksForSelectedDate = tasks.filter(
      (task) =>
        format(new Date(task.date), "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd")
    );

    return (
      <div className="day-picker">
        <div className="day-buttons-container">
          {Array.from({ length: 7 }).map((_, i) => {
            const day = addDays(startOfCurrentWeek, i);
            return (
              <button
                key={i}
                onClick={() => handleDateChange(day)}
                className={
                  format(day, "yyyy-MM-dd") ===
                    format(selectedDate, "yyyy-MM-dd")
                    ? "selected-day-button"
                    : ""
                }
              >
                {format(day, "E").toUpperCase()}
              </button>
            );
          })}
        </div>

        <div className="selected-day-container">
          <TaskContainer
            tasks={tasksForSelectedDate}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleAddTask={handleAddTask}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="form-container">
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => handleDateChange(new Date(e.target.value))}
          />
        </div>

        <div>
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      </div>

      {renderDayPicker()}

      {isModalOpen && (
        <EditModal
          task={editingTask}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

export default App;