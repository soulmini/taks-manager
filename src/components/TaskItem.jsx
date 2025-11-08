import React, { useState, useCallback, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTasks } from '../context/TasksContext';

const TaskItem = React.memo(({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const { toggleTask, deleteTask, editTask } = useTasks();
  const saveButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleToggle = useCallback(() => {
    if (!isEditing) {
      toggleTask(task.id);
    }
  }, [toggleTask, task.id, isEditing]);

  const handleDelete = useCallback(() => {
    if (!isEditing) {
      deleteTask(task.id);
    }
  }, [deleteTask, task.id, isEditing]);

  const handleSave = useCallback(() => {
    if (editText.trim() && editText !== task.text) {
      editTask(task.id, editText.trim());
    } else {
      setEditText(task.text); // Reset if no changes
    }
    setIsEditing(false);
  }, [editText, task.text, task.id, editTask]);

  const handleCancel = useCallback(() => {
    setEditText(task.text);
    setIsEditing(false);
  }, [task.text]);

  const handleEditInputBlur = useCallback((e) => {
    // Don't auto-cancel if user clicked on save or cancel buttons
    const relatedTarget = e.relatedTarget;
    if (relatedTarget === saveButtonRef.current || relatedTarget === cancelButtonRef.current) {
      return;
    }
    // Auto-save on blur if there are changes
    if (editText.trim() && editText !== task.text) {
      handleSave();
    } else {
      handleCancel();
    }
  }, [editText, task.text, handleSave, handleCancel]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === ' ' && !isEditing) {
      // Spacebar to toggle completion when not editing
      e.preventDefault();
      handleToggle();
    }
  }, [handleSave, handleCancel, isEditing, handleToggle]);

  const handleEditInputChange = useCallback((e) => {
    setEditText(e.target.value);
  }, []);

  const startEditing = useCallback(() => {
    if (!isDragging) {
      setIsEditing(true);
    }
  }, [isDragging]);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-item ${task.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
      data-task-id={task.id}
      tabIndex={0}
      onKeyDown={handleKeyPress}
      role="listitem"
      aria-label={`Task: ${task.text}. ${task.completed ? 'Completed' : 'Pending'}. Press space to toggle completion, double-click to edit.`}
    >
      <div className="task-content">
        <div className="task-main">
          <div className="task-checkbox-container">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggle}
              className="task-checkbox"
              aria-label={`Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
              disabled={isEditing}
            />
            <span className="checkbox-helper">
              {task.completed ? '✅' : '⭕'}
            </span>
          </div>
          
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={handleEditInputChange}
              onKeyDown={handleKeyPress}
              onBlur={handleEditInputBlur}
              className="task-edit-input"
              autoFocus
              maxLength={500}
            />
          ) : (
            <div className="task-text-container">
              <span 
                className="task-text" 
                onDoubleClick={startEditing}
                title="Double-click to edit"
              >
                {task.text}
              </span>
              <span className="task-date" title={new Date(task.createdAt).toLocaleString()}>
                {formatDate(task.createdAt)}
              </span>
            </div>
          )}
        </div>

        <div className="task-actions">
          {!isEditing && (
            <button
              {...attributes}
              {...listeners}
              className="drag-handle"
              aria-label="Drag to reorder task"
              title="Drag to reorder"
            >
              ⋮⋮
            </button>
          )}
          
          {isEditing ? (
            <>
              <button 
                ref={saveButtonRef}
                onMouseDown={handleSave} // Use onMouseDown to fire before onBlur
                className="save-button"
                title="Save changes"
                aria-label="Save changes"
                type="button"
              >
                ✓
              </button>
              <button 
                ref={cancelButtonRef}
                onMouseDown={handleCancel} // Use onMouseDown to fire before onBlur
                className="cancel-button"
                title="Cancel editing"
                aria-label="Cancel editing"
                type="button"
              >
                ✗
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={startEditing} 
                className="edit-button"
                title="Edit task"
                aria-label="Edit task"
              >
                ✏️
              </button>
              <button 
                onClick={handleDelete} 
                className="delete-button"
                title="Delete task"
                aria-label="Delete task"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;
