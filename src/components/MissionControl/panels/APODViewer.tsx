import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, ExternalLink } from 'lucide-react';

interface APODData {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  copyright?: string;
}

export const APODViewer: React.FC = () => {
  const [apodData, setApodData] = useState<APODData | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const NASA_API_KEY = 'K1IkwsGp3bWkkMbPTYeDtRCJjds4kUUOitFIeEtk';

  const fetchAPOD = async (date: Date) => {
    setLoading(true);
    setError(null);

    try {
      const dateString = date.toISOString().split('T')[0];
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${dateString}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch APOD data');
      }

      const data: APODData = await response.json();
      setApodData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPOD(currentDate);
  }, [currentDate]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    
    // Don't allow future dates
    if (newDate <= new Date()) {
      setCurrentDate(newDate);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Astronomy Picture of the Day</h2>
        <div className="text-center text-muted-foreground">Loading cosmic imagery...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Astronomy Picture of the Day</h2>
        <div className="text-center text-mission-critical">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Astronomy Picture of the Day</h2>
        <Badge variant="outline" className="animate-pulse-glow">
          NASA APOD
        </Badge>
      </div>

      {apodData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image/Video Display */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{apodData.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateDate('prev')}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Badge variant="secondary">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(apodData.date)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateDate('next')}
                      disabled={currentDate.toDateString() === new Date().toDateString()}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apodData.media_type === 'image' ? (
                    <div className="relative group">
                      <img
                        src={apodData.url}
                        alt={apodData.title}
                        className="w-full h-auto rounded-lg mission-glow transition-all duration-300 group-hover:scale-[1.02]"
                        style={{ maxHeight: '500px', objectFit: 'contain' }}
                      />
                      {apodData.hdurl && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => window.open(apodData.hdurl, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          HD
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video">
                      <iframe
                        src={apodData.url}
                        className="w-full h-full rounded-lg"
                        title={apodData.title}
                        allowFullScreen
                      />
                    </div>
                  )}
                  
                  {apodData.copyright && (
                    <div className="text-xs text-muted-foreground">
                      © {apodData.copyright}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description Panel */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed">
                    {apodData.explanation}
                  </p>
                  
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex flex-col space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Date: {formatDate(apodData.date)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Media Type: {apodData.media_type.charAt(0).toUpperCase() + apodData.media_type.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Navigation */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today's Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    const randomDaysBack = Math.floor(Math.random() * 365);
                    const randomDate = new Date();
                    randomDate.setDate(randomDate.getDate() - randomDaysBack);
                    setCurrentDate(randomDate);
                  }}
                >
                  Random Image
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};