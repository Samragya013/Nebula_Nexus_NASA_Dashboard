import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavigation } from './TopNavigation';
import { DashboardContent } from './DashboardContent';

export interface MissionControlLayoutProps {}

export const MissionControlLayout: React.FC<MissionControlLayoutProps> = () => {
  const [activePanel, setActivePanel] = useState('telemetry');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'cosmic' | 'solar'>('cosmic');

  const toggleTheme = () => {
    setTheme(prev => prev === 'cosmic' ? 'solar' : 'cosmic');
    document.documentElement.className = theme === 'cosmic' ? 'solar' : '';
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Particle background effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full animate-pulse-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex h-screen">
        <Sidebar 
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className="flex-1 flex flex-col">
          <TopNavigation 
            theme={theme}
            onThemeToggle={toggleTheme}
          />
          
          <DashboardContent 
            activePanel={activePanel}
            className="flex-1 overflow-auto"
          />
        </div>
      </div>
    </div>
  );
};