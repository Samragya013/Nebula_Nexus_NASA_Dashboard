import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Cpu, Database, Wifi, Thermometer } from 'lucide-react';

export const TelemetryPanel: React.FC = () => {
  const [telemetryData, setTelemetryData] = useState({
    cpuUsage: 75,
    memoryUsage: 60,
    networkLatency: 45,
    temperature: 68,
    batteryLevel: 85,
    signalStrength: 92,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryData(prev => ({
        cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        networkLatency: Math.max(10, Math.min(200, prev.networkLatency + (Math.random() - 0.5) * 20)),
        temperature: Math.max(60, Math.min(80, prev.temperature + (Math.random() - 0.5) * 4)),
        batteryLevel: Math.max(0, Math.min(100, prev.batteryLevel + (Math.random() - 0.5) * 2)),
        signalStrength: Math.max(0, Math.min(100, prev.signalStrength + (Math.random() - 0.5) * 5)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, threshold: number = 80) => {
    if (value >= threshold) return 'text-mission-critical';
    if (value >= threshold * 0.7) return 'text-mission-warning';
    return 'text-mission-success';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Telemetry</h2>
        <Badge variant="outline" className="animate-pulse-glow">
          REAL-TIME DATA
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CPU Usage */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <span className={getStatusColor(telemetryData.cpuUsage)}>
                {telemetryData.cpuUsage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={telemetryData.cpuUsage} 
              className="h-2"
            />
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-cosmic-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <span className={getStatusColor(telemetryData.memoryUsage)}>
                {telemetryData.memoryUsage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={telemetryData.memoryUsage} 
              className="h-2"
            />
          </CardContent>
        </Card>

        {/* Network Latency */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Latency</CardTitle>
            <Wifi className="h-4 w-4 text-mission-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <span className={getStatusColor(telemetryData.networkLatency, 100)}>
                {telemetryData.networkLatency.toFixed(0)}ms
              </span>
            </div>
            <Progress 
              value={Math.min(100, telemetryData.networkLatency / 2)} 
              className="h-2"
            />
          </CardContent>
        </Card>

        {/* Temperature */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-cosmic-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <span className={getStatusColor(telemetryData.temperature, 75)}>
                {telemetryData.temperature.toFixed(1)}°F
              </span>
            </div>
            <Progress 
              value={(telemetryData.temperature - 60) * 5} 
              className="h-2"
            />
          </CardContent>
        </Card>

        {/* System Health Overview */}
        <Card className="glass-card md:col-span-2">
          <CardHeader>
            <CardTitle>System Health Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Battery Level</div>
                <div className="flex items-center space-x-2">
                  <Progress value={telemetryData.batteryLevel} className="flex-1 h-2" />
                  <span className="text-sm font-medium">{telemetryData.batteryLevel}%</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Signal Strength</div>
                <div className="flex items-center space-x-2">
                  <Progress value={telemetryData.signalStrength} className="flex-1 h-2" />
                  <span className="text-sm font-medium">{telemetryData.signalStrength}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};