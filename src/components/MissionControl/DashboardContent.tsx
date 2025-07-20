import React from 'react';
import { TelemetryPanel } from './panels/TelemetryPanel';
import { ISSTracker } from './panels/ISSTracker';
import { MarsWeatherPanel } from './panels/MarsWeatherPanel';
import { APODViewer } from './panels/APODViewer';
import { AsteroidsPanel } from './panels/AsteroidsPanel';
import { cn } from '@/lib/utils';

interface DashboardContentProps {
  activePanel: string;
  className?: string;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  activePanel,
  className,
}) => {
  const renderPanel = () => {
    switch (activePanel) {
      case 'telemetry':
        return <TelemetryPanel />;
      case 'iss':
        return <ISSTracker />;
      case 'mars-weather':
        return <MarsWeatherPanel />;
      case 'apod':
        return <APODViewer />;
      case 'asteroids':
        return <AsteroidsPanel />;
      default:
        return <TelemetryPanel />;
    }
  };

  return (
    <main className={cn("p-6", className)}>
      <div className="animate-fade-in">
        {renderPanel()}
      </div>
    </main>
  );
};