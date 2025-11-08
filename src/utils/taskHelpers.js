// Utility functions for task management

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTaskStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  
  return {
    total,
    completed,
    pending,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  };
};

export const filterTasks = (tasks, filter) => {
  switch (filter) {
    case 'completed':
      return tasks.filter(task => task.completed);
    case 'pending':
      return tasks.filter(task => !task.completed);
    case 'all':
    default:
      return tasks;
  }
};

export const sortTasks = (tasks, sortBy) => {
  const tasksCopy = [...tasks];
  
  switch (sortBy) {
    case 'newest':
      return tasksCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest':
      return tasksCopy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'alphabetical':
      return tasksCopy.sort((a, b) => a.text.localeCompare(b.text));
    case 'completed':
      return tasksCopy.sort((a, b) => a.completed - b.completed);
    default:
      return tasksCopy;
  }
};

export const validateTask = (text) => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Task text is required' };
  }
  
  if (text.trim().length === 0) {
    return { isValid: false, error: 'Task text cannot be empty' };
  }
  
  if (text.trim().length > 500) {
    return { isValid: false, error: 'Task text is too long (max 500 characters)' };
  }
  
  return { isValid: true };
};
