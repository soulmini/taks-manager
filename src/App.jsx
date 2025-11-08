import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TasksProvider } from './context/TasksContext';
import Header from './components/Header';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import './App.css';

// Import dev tools for development
if (process.env.NODE_ENV === 'development') {
  import('./utils/devTools.js');
}

function App() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <div className="app">
          <div className="container">
            <Header />
            <main className="main-content">
              <TaskInput />
              <TaskList />
            </main>
          </div>
        </div>
      </TasksProvider>
    </ThemeProvider>
  );
}

export default App;
