import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = React.memo(() => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-text">
          <h1>Task Manager</h1>
          <p>Stay organized and productive</p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
