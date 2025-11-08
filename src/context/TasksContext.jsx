import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TasksContext = createContext();

const tasksReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, { 
        id: Date.now(), 
        text: action.payload, 
        completed: false,
        createdAt: new Date().toISOString()
      }];
    case 'TOGGLE_TASK':
      return state.map(task => 
        task.id === action.payload 
          ? { ...task, completed: !task.completed }
          : task
      );
    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload);
    case 'EDIT_TASK':
      return state.map(task =>
        task.id === action.payload.id
          ? { ...task, text: action.payload.text }
          : task
      );
    case 'REORDER_TASKS':
      return action.payload;
    case 'SET_FILTER':
      return state; // Filter is handled in the component, not in state
    case 'LOAD_TASKS':
      return action.payload;
    default:
      return state;
  }
};

export const TasksProvider = ({ children }) => {
  const [storedTasks, setStoredTasks] = useLocalStorage('tasks', []);
  const [tasks, dispatch] = useReducer(tasksReducer, storedTasks);
  const [filter, setFilter] = React.useState('all'); // all, completed, pending

  // Update local storage whenever tasks change
  React.useEffect(() => {
    setStoredTasks(tasks);
  }, [tasks, setStoredTasks]);

  // Memoized actions for performance optimization
  const addTask = useCallback((text) => {
    if (text && text.trim()) {
      dispatch({ type: 'ADD_TASK', payload: text.trim() });
    }
  }, []);

  const toggleTask = useCallback((id) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  }, []);

  const deleteTask = useCallback((id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const editTask = useCallback((id, text) => {
    if (text && text.trim()) {
      dispatch({ type: 'EDIT_TASK', payload: { id, text: text.trim() } });
    }
  }, []);

  const reorderTasks = useCallback((newTasks) => {
    dispatch({ type: 'REORDER_TASKS', payload: newTasks });
  }, []);

  // Memoized filtered tasks
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'all':
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // Memoized task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [tasks]);

  const value = useMemo(() => ({
    tasks,
    filteredTasks,
    filter,
    setFilter,
    taskStats,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    reorderTasks,
    dispatch
  }), [
    tasks,
    filteredTasks,
    filter,
    taskStats,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    reorderTasks
  ]);

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
