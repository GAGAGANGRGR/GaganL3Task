// EditModal.js
import React, { useState } from "react";
import "./EditModal.css";

const EditModal = ({ task, onClose, onSave }) => {
    const [editedTitle, setEditedTitle] = useState(task ? task.title : "");
    const [editedDescription, setEditedDescription] = useState(
        task ? task.description : ""
    );

    const handleSave = () => {
        onSave(
            task ? task.id : null,
            editedTitle,
            editedDescription,
            !task // isNewTask is true if task is null (indicating a new task)
        );
        onClose();
    };

    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal">
                <h2>{task ? "Edit Task" : "Add Task"}</h2>
                <label>Title:</label>
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                />
                <label>Description:</label>
                <input
                    type="text"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                />
                <div className="edit-modal-buttons">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;