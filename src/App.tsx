import React, { useState, useEffect } from 'react';
import { Sidebar, MobileNav } from './components/layout/Navigation';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import Today from './pages/Today';
import Matrix from './pages/Matrix';
import Weekly from './pages/Weekly';
import Review from './pages/Review';
import Logs from './pages/Logs';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case '#/': return <Dashboard />;
      case '#/inbox': return <Inbox />;
      case '#/today': return <Today />;
      case '#/matrix': return <Matrix />;
      case '#/weekly': return <Weekly />;
      case '#/review': return <Review />;
      case '#/logs': return <Logs />;
      default: return <Dashboard />;
    }
  };


  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar currentPath={currentPath} onNavigate={setCurrentPath} />
      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderPage()}
        </div>
      </main>
      <MobileNav currentPath={currentPath} onNavigate={setCurrentPath} />
    </div>
  );
};

export default App;
