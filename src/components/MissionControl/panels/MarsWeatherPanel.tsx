import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Wind, Gauge, Calendar } from 'lucide-react';

interface MarsWeatherData {
  sol: number;
  temperature: {
    min: number;
    max: number;
    average: number;
  };
  pressure: number;
  windSpeed: number;
  season: string;
  earthDate: string;
}

export const MarsWeatherPanel: React.FC = () => {
  const [weatherData, setWeatherData] = useState<MarsWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarsWeather = async () => {
    try {
      // Since the InSight mission has ended, we'll simulate Mars weather data
      // In a real implementation, you could use other Mars weather APIs
      const simulatedData: MarsWeatherData = {
        sol: 4000 + Math.floor(Math.random() * 100),
        temperature: {
          min: -85 + Math.random() * 10,
          max: -15 + Math.random() * 10,
          average: -50 + Math.random() * 10,
        },
        pressure: 700 + Math.random() * 100,
        windSpeed: 5 + Math.random() * 15,
        season: 'Late Northern Spring',
        earthDate: new Date().toISOString().split('T')[0],
      };

      setWeatherData(simulatedData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch Mars weather data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarsWeather();
    const interval = setInterval(fetchMarsWeather, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const convertCelsiusToFahrenheit = (celsius: number) => {
    return (celsius * 9/5) + 32;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Mars Weather Station</h2>
        <div className="text-center text-muted-foreground">Loading Mars weather data...</div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Mars Weather Station</h2>
        <div className="text-center text-mission-critical">{error || 'No data available'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mars Weather Station</h2>
        <Badge variant="outline" className="animate-pulse-glow">
          SOL {weatherData.sol}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Temperature */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-cosmic-orange" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs text-muted-foreground">Current Average</div>
            <div className="text-2xl font-bold text-cosmic-orange">
              {weatherData.temperature.average.toFixed(1)}°C
            </div>
            <div className="text-xs text-muted-foreground">
              {convertCelsiusToFahrenheit(weatherData.temperature.average).toFixed(1)}°F
            </div>
            <div className="pt-2 space-y-1 border-t border-border/50">
              <div className="flex justify-between text-xs">
                <span>High:</span>
                <span className="text-mission-warning">
                  {weatherData.temperature.max.toFixed(1)}°C
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Low:</span>
                <span className="text-cosmic-cyan">
                  {weatherData.temperature.min.toFixed(1)}°C
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pressure */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pressure</CardTitle>
            <Gauge className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary mb-1">
              {weatherData.pressure.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">Pa (Pascals)</div>
            <div className="text-xs text-muted-foreground mt-2">
              ~{(weatherData.pressure / 133.322).toFixed(2)} mmHg
            </div>
          </CardContent>
        </Card>

        {/* Wind Speed */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
            <Wind className="h-4 w-4 text-cosmic-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cosmic-cyan mb-1">
              {weatherData.windSpeed.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">m/s</div>
            <div className="text-xs text-muted-foreground mt-2">
              {(weatherData.windSpeed * 2.237).toFixed(1)} mph
            </div>
          </CardContent>
        </Card>

        {/* Season */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Season</CardTitle>
            <Calendar className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-accent mb-1">
              {weatherData.season}
            </div>
            <div className="text-xs text-muted-foreground">
              Earth Date: {weatherData.earthDate}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Trends */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Mission Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-space-gray/50 rounded-lg">
              <div className="text-2xl font-bold text-mission-success">4000+</div>
              <div className="text-sm text-muted-foreground">Sols of Data</div>
            </div>
            <div className="text-center p-4 bg-space-gray/50 rounded-lg">
              <div className="text-2xl font-bold text-cosmic-orange">-63°C</div>
              <div className="text-sm text-muted-foreground">Average Temperature</div>
            </div>
            <div className="text-center p-4 bg-space-gray/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">750 Pa</div>
              <div className="text-sm text-muted-foreground">Average Pressure</div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>InSight Mission:</strong> The Interior Exploration using Seismic Investigations, 
              Geodesy and Heat Transport (InSight) lander provided weather data from Mars' surface 
              for over 4 years.
            </p>
            <p>
              <strong>Location:</strong> Elysium Planitia, approximately 4.5°N 135.6°E
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};