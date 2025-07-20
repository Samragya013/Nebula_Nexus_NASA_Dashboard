import React, { useState, useEffect } from 'react';
import { Sun, Moon, AlertTriangle, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TopNavigationProps {
  theme: 'cosmic' | 'solar';
  onThemeToggle: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  theme,
  onThemeToggle,
}) => {
  const [missionTime, setMissionTime] = useState(new Date());
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Near-Earth Object Detected' },
    { id: 2, type: 'info', message: 'ISS Pass Scheduled' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMissionTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatMissionTime = (date: Date) => {
    return date.toISOString().split('T')[1].slice(0, 8);
  };

  const getMissionDay = (date: Date) => {
    const missionStart = new Date('2024-01-01');
    const diffTime = date.getTime() - missionStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <header className="glass-card border-b border-border/50 p-4">
      <div className="flex items-center justify-between">
        {/* Mission Timer */}
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">MISSION TIME</div>
            <div className="text-lg font-mono text-accent">
              {formatMissionTime(missionTime)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">SOL</div>
            <div className="text-lg font-mono text-cosmic-cyan">
              {getMissionDay(missionTime)}
            </div>
          </div>
        </div>

        {/* Center Title */}
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            NASA MISSION CONTROL
          </h1>
          <p className="text-xs text-muted-foreground">Deep Space Operations Center</p>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Alerts */}
          <div className="flex items-center space-x-2">
            {alerts.length > 0 && (
              <Button variant="ghost" size="sm" className="relative">
                <AlertTriangle className="w-4 h-4 text-mission-warning" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs"
                >
                  {alerts.length}
                </Badge>
              </Button>
            )}
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-1">
            <Wifi className="w-4 h-4 text-mission-success" />
            <span className="text-xs text-mission-success">ONLINE</span>
          </div>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onThemeToggle}
            className="p-2"
          >
            {theme === 'cosmic' ? (
              <Sun className="w-4 h-4 text-cosmic-orange" />
            ) : (
              <Moon className="w-4 h-4 text-cosmic-purple" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};