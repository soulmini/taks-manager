import React from 'react';
import { useTasks } from '../context/TasksContext';

const TaskFilter = React.memo(() => {
  const { filter, setFilter, taskStats } = useTasks();

  const filters = [
    { key: 'all', label: 'All', count: taskStats.total },
    { key: 'pending', label: 'Pending', count: taskStats.pending },
    { key: 'completed', label: 'Completed', count: taskStats.completed }
  ];

  return (
    <div className="task-filter">
      <div className="filter-buttons">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            className={`filter-button ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
            title={`View ${label.toLowerCase()} tasks`}
          >
            {label}
            <span className="filter-count">{count}</span>
          </button>
        ))}
      </div>
      
      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{taskStats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completion:</span>
          <span className="stat-value">{taskStats.completionRate}%</span>
        </div>
      </div>
      
      <div className="task-help">
        <small>💡 Click checkbox or press Space to complete tasks</small>
      </div>
    </div>
  );
});

TaskFilter.displayName = 'TaskFilter';

export default TaskFilter;
