import React, { useState, useCallback } from 'react';
import { useTasks } from '../context/TasksContext';

const TaskInput = React.memo(() => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const { addTask } = useTasks();

  const validateTask = useCallback((text) => {
    if (!text || !text.trim()) {
      return 'Task cannot be empty';
    }
    if (text.trim().length > 500) {
      return 'Task is too long (max 500 characters)';
    }
    return '';
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const validationError = validateTask(inputValue);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    addTask(inputValue);
    setInputValue('');
    setError('');
  }, [inputValue, validateTask, addTask]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Clear error when user starts typing
    if (error && value.trim()) {
      setError('');
    }
  }, [error]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <div className="task-input-container">
      <form className="task-input-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Add a new task..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`task-input ${error ? 'error' : ''}`}
            maxLength={500}
            aria-label="Task input"
            aria-describedby={error ? "input-error" : undefined}
          />
          <button type="submit" className="add-button" disabled={!inputValue.trim()}>
            <span className="button-icon">+</span>
            <span className="button-text">Add Task</span>
          </button>
        </div>
        {error && (
          <div id="input-error" className="error-message" role="alert">
            {error}
          </div>
        )}
      </form>
    </div>
  );
});

TaskInput.displayName = 'TaskInput';

export default TaskInput;
