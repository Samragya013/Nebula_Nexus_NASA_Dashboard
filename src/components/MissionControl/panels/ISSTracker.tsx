import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Orbit } from 'lucide-react';

interface ISSPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export const ISSTracker: React.FC = () => {
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchISSPosition = async () => {
    try {
      const response = await fetch('https://api.open-notify.org/iss-now.json');
      const data = await response.json();
      
      setIssPosition({
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.longitude),
        timestamp: data.timestamp,
      });
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ISS position:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchISSPosition();
    const interval = setInterval(fetchISSPosition, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const formatCoordinate = (coord: number, type: 'lat' | 'lng') => {
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${Math.abs(coord).toFixed(4)}° ${direction}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">ISS Live Tracker</h2>
        <Badge variant="outline" className="animate-pulse-glow">
          <Orbit className="w-3 h-3 mr-1 animate-orbit" />
          ORBITAL TRACKING
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Position */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-mission-success" />
              <span>Current Position</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center text-muted-foreground">Loading position data...</div>
            ) : issPosition ? (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Latitude</div>
                  <div className="text-xl font-mono text-cosmic-cyan">
                    {formatCoordinate(issPosition.latitude, 'lat')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Longitude</div>
                  <div className="text-xl font-mono text-cosmic-cyan">
                    {formatCoordinate(issPosition.longitude, 'lng')}
                  </div>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Last Updated: {lastUpdate.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-mission-critical">Failed to load position data</div>
            )}
          </CardContent>
        </Card>

        {/* Orbital Information */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Orbit className="w-5 h-5 text-primary" />
              <span>Orbital Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Altitude</div>
                <div className="text-lg font-mono text-accent">~408 km</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Velocity</div>
                <div className="text-lg font-mono text-accent">27,600 km/h</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Orbital Period</div>
                <div className="text-lg font-mono text-accent">93 min</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Inclination</div>
                <div className="text-lg font-mono text-accent">51.6°</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Crew */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-cosmic-orange" />
              <span>Current Crew</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Expedition 70</div>
              <div className="space-y-1">
                <div className="text-sm">• Commander: Andreas Mogensen (ESA)</div>
                <div className="text-sm">• Flight Engineer: Satoshi Furukawa (JAXA)</div>
                <div className="text-sm">• Flight Engineer: Konstantin Borisov (Roscosmos)</div>
                <div className="text-sm">• Flight Engineer: Oleg Kononenko (Roscosmos)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* World Map Visualization */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Ground Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-48 bg-space-gray rounded-lg overflow-hidden">
              {/* Simple world map representation */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-green-900/20" />
              
              {/* ISS position dot */}
              {issPosition && (
                <div
                  className="absolute w-3 h-3 bg-mission-success rounded-full animate-pulse-glow"
                  style={{
                    left: `${((issPosition.longitude + 180) / 360) * 100}%`,
                    top: `${((90 - issPosition.latitude) / 180) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )}
              
              {/* Grid lines */}
              <div className="absolute inset-0">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute w-full border-t border-border/20"
                    style={{ top: `${(i / 8) * 100}%` }}
                  />
                ))}
                {[...Array(19)].map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute h-full border-l border-border/20"
                    style={{ left: `${(i / 18) * 100}%` }}
                  />
                ))}
              </div>
              
              <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
                ISS Ground Track
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};