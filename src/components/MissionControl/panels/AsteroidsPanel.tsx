import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, Calendar, Ruler, Target } from 'lucide-react';

interface CloseApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}

interface Asteroid {
  id: string;
  name: string;
  estimated_diameter: {
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
  absolute_magnitude_h: number;
}

interface AsteroidFeedData {
  near_earth_objects: Record<string, Asteroid[]>;
  element_count: number;
}

export const AsteroidsPanel: React.FC = () => {
  const [asteroidData, setAsteroidData] = useState<AsteroidFeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const NASA_API_KEY = 'K1IkwsGp3bWkkMbPTYeDtRCJjds4kUUOitFIeEtk';

  const fetchAsteroids = async (date: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${NASA_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch asteroid data');
      }

      const data: AsteroidFeedData = await response.json();
      setAsteroidData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsteroids(selectedDate);
  }, [selectedDate]);

  const getAllAsteroids = (): Asteroid[] => {
    if (!asteroidData) return [];
    
    const allAsteroids: Asteroid[] = [];
    Object.values(asteroidData.near_earth_objects).forEach(dayAsteroids => {
      allAsteroids.push(...dayAsteroids);
    });
    
    return allAsteroids.sort((a, b) => {
      const aDistance = parseFloat(a.close_approach_data[0]?.miss_distance?.kilometers || '0');
      const bDistance = parseFloat(b.close_approach_data[0]?.miss_distance?.kilometers || '0');
      return aDistance - bDistance;
    });
  };

  const getHazardousAsteroids = (): Asteroid[] => {
    return getAllAsteroids().filter(asteroid => asteroid.is_potentially_hazardous_asteroid);
  };

  const formatDistance = (km: string): string => {
    const distance = parseFloat(km);
    if (distance > 1000000) {
      return `${(distance / 1000000).toFixed(2)}M km`;
    }
    return `${distance.toLocaleString()} km`;
  };

  const formatDiameter = (asteroid: Asteroid): string => {
    const min = asteroid.estimated_diameter.meters.estimated_diameter_min;
    const max = asteroid.estimated_diameter.meters.estimated_diameter_max;
    return `${min.toFixed(0)}-${max.toFixed(0)}m`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Near-Earth Asteroids</h2>
        <div className="text-center text-muted-foreground">Scanning for near-Earth objects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Near-Earth Asteroids</h2>
        <div className="text-center text-mission-critical">{error}</div>
      </div>
    );
  }

  const allAsteroids = getAllAsteroids();
  const hazardousAsteroids = getHazardousAsteroids();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Near-Earth Asteroids</h2>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 bg-card border border-border rounded text-sm"
          />
          <Badge variant="outline" className="animate-pulse-glow">
            <Zap className="w-3 h-3 mr-1" />
            {allAsteroids.length} DETECTED
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-accent">{allAsteroids.length}</p>
                <p className="text-xs text-muted-foreground">Total Objects</p>
              </div>
              <Target className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-mission-critical">{hazardousAsteroids.length}</p>
                <p className="text-xs text-muted-foreground">Potentially Hazardous</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-mission-critical" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-cosmic-cyan">
                  {allAsteroids.length > 0 
                  ? formatDistance(allAsteroids[0].close_approach_data[0]?.miss_distance?.kilometers || '0')
                  : 'N/A'
                  }
                </p>
                <p className="text-xs text-muted-foreground">Closest Approach</p>
              </div>
              <Ruler className="h-8 w-8 text-cosmic-cyan" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-cosmic-orange">
                  {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs text-muted-foreground">Observation Date</p>
              </div>
              <Calendar className="h-8 w-8 text-cosmic-orange" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asteroid List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* All Asteroids */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>All Near-Earth Objects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allAsteroids.map((asteroid, index) => (
                <div
                  key={asteroid.id}
                  className="p-3 bg-space-gray/50 rounded-lg space-y-2 hover:bg-space-gray/70 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm truncate flex-1">
                      {asteroid.name}
                    </div>
                    {asteroid.is_potentially_hazardous_asteroid && (
                      <AlertTriangle className="w-4 h-4 text-mission-critical flex-shrink-0 ml-2" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Distance:</span>
                      <div className="text-cosmic-cyan">
                        {formatDistance(asteroid.close_approach_data[0]?.miss_distance?.kilometers || '0')}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Diameter:</span>
                      <div className="text-accent">
                        {formatDiameter(asteroid)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Velocity:</span> {parseFloat(asteroid.close_approach_data[0]?.relative_velocity?.kilometers_per_hour || '0').toFixed(0)} km/h
                  </div>
                </div>
              ))}
              
              {allAsteroids.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No asteroids detected for this date
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Potentially Hazardous Asteroids */}
        <Card className="glass-card border-mission-critical/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-mission-critical" />
              <span>Potentially Hazardous Objects</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {hazardousAsteroids.map((asteroid) => (
                <div
                  key={asteroid.id}
                  className="p-3 bg-mission-critical/10 border border-mission-critical/20 rounded-lg space-y-2"
                >
                  <div className="font-medium text-sm text-mission-critical">
                    {asteroid.name}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Miss Distance:</span>
                      <span className="text-mission-critical font-medium">
                        {formatDistance(asteroid.close_approach_data[0]?.miss_distance?.kilometers || '0')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lunar Distance:</span>
                      <span className="text-accent">
                        {parseFloat(asteroid.close_approach_data[0]?.miss_distance?.lunar || '0').toFixed(2)} LD
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Diameter:</span>
                      <span className="text-cosmic-orange">
                        {formatDiameter(asteroid)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {hazardousAsteroids.length === 0 && (
                <div className="text-center text-mission-success py-8">
                  <div className="text-lg font-medium">All Clear</div>
                  <div className="text-sm text-muted-foreground">
                    No potentially hazardous objects detected
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};