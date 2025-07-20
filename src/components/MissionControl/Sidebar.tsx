import React from 'react';
import { 
  Satellite, 
  Globe, 
  CloudSnow, 
  Camera, 
  Zap,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  { id: 'telemetry', label: 'Telemetry', icon: Satellite },
  { id: 'iss', label: 'ISS Tracker', icon: Globe },
  { id: 'mars-weather', label: 'Mars Weather', icon: CloudSnow },
  { id: 'apod', label: 'APOD Viewer', icon: Camera },
  { id: 'asteroids', label: 'Asteroids', icon: Zap },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activePanel,
  onPanelChange,
  collapsed,
  onToggleCollapse,
}) => {
  return (
    <div className={cn(
      "glass-card border-r transition-all duration-300 ease-in-out relative z-20",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 cosmic-gradient rounded-lg flex items-center justify-center">
                <Satellite className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold">MISSION</h2>
                <p className="text-xs text-muted-foreground">CONTROL</p>
              </div>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleCollapse}
            className="p-2 hover:bg-accent/20"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activePanel === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start transition-all duration-200",
                activePanel === item.id && "mission-gradient text-white mission-glow",
                collapsed && "px-2"
              )}
              onClick={() => onPanelChange(item.id)}
            >
              <Icon className={cn("w-4 h-4", !collapsed && "mr-3")} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Mission Status */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="glass-card p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">MISSION STATUS</span>
              <div className="w-2 h-2 bg-mission-success rounded-full animate-pulse-glow" />
            </div>
            <p className="text-xs text-mission-success font-medium">ALL SYSTEMS NOMINAL</p>
          </div>
        </div>
      )}
    </div>
  );
};