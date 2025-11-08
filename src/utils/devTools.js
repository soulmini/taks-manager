// Development utility functions for testing
// Only use this in development mode

export const addSampleTasks = (addTask) => {
  const sampleTasks = [
    'Buy groceries for the week',
    'Finish the quarterly report',
    'Call the dentist for appointment',
    'Review code changes',
    'Plan weekend trip',
    'Update project documentation',
    'Exercise for 30 minutes',
    'Read a chapter from the book'
  ];

  sampleTasks.forEach((task, index) => {
    setTimeout(() => {
      addTask(task);
    }, index * 100);
  });
};

export const clearAllData = () => {
  localStorage.removeItem('tasks');
  localStorage.removeItem('theme');
  window.location.reload();
};

// Add to window for easy testing in console
if (process.env.NODE_ENV === 'development') {
  window.taskManagerDevTools = {
    addSampleTasks,
    clearAllData
  };
}
