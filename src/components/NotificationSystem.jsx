import React, { useEffect, useState } from 'react';
import { Bell, TrendingUp, Target, Zap, X, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { TrendingArtist, Keyword } from '../api/entities';

export function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check for important changes every 5 minutes
    const checkNotifications = async () => {
      const alerts = [];
      
      try {
        // Check for breakout artists
        const breakoutArtists = await checkBreakoutArtists();
        breakoutArtists.forEach(artist => {
          alerts.push({
            id: `breakout-${artist.id}`,
            type: 'breakout',
            priority: 'high',
            title: 'Breakout Alert!',
            message: `${artist.name} is trending! +${artist.growth_rate}% momentum this week`,
            action: 'Create beat now',
            actionUrl: `/trending-artists?highlight=${artist.id}`,
            timestamp: new Date().toISOString(),
            artist: artist.name,
            icon: TrendingUp,
            color: 'bg-green-500'
          });
        });

        // Check for low competition keywords
        const opportunities = await checkOpportunities();
        opportunities.forEach(keyword => {
          alerts.push({
            id: `opportunity-${keyword.id}`,
            type: 'opportunity',
            priority: 'medium',
            title: 'New Opportunity!',
            message: `"${keyword.keyword}" has low competition (${Math.round(keyword.competition_score * 100)}%)`,
            action: 'Analyze keyword',
            actionUrl: `/keyword-research?q=${encodeURIComponent(keyword.keyword)}`,
            timestamp: new Date().toISOString(),
            keyword: keyword.keyword,
            opportunityScore: keyword.opportunity_score,
            icon: Target,
            color: 'bg-blue-500'
          });
        });

        // Check for viral keywords
        const viralKeywords = await checkViralKeywords();
        viralKeywords.forEach(keyword => {
          alerts.push({
            id: `viral-${keyword.id}`,
            type: 'viral',
            priority: 'high',
            title: 'Viral Alert!',
            message: `"${keyword.keyword}" is going viral! ${keyword.search_volume.toLocaleString()} searches`,
            action: 'Create content',
            actionUrl: `/seo-tools?keyword=${encodeURIComponent(keyword.keyword)}`,
            timestamp: new Date().toISOString(),
            keyword: keyword.keyword,
            searchVolume: keyword.search_volume,
            icon: Zap,
            color: 'bg-purple-500'
          });
        });

        // Check for market shifts
        const marketShifts = await checkMarketShifts();
        marketShifts.forEach(shift => {
          alerts.push({
            id: `market-${shift.genre}`,
            type: 'market',
            priority: 'medium',
            title: 'Market Shift Detected',
            message: `${shift.genre} genre trending up +${shift.growth}%`,
            action: 'View trends',
            actionUrl: `/trending-artists?genre=${shift.genre}`,
            timestamp: new Date().toISOString(),
            genre: shift.genre,
            growth: shift.growth,
            icon: Eye,
            color: 'bg-orange-500'
          });
        });

        // Sort by priority and timestamp
        const sortedAlerts = alerts
          .sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority] || 
                   new Date(b.timestamp) - new Date(a.timestamp);
          })
          .slice(0, 5); // Limit to 5 notifications

        setNotifications(sortedAlerts);
        
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    };

    // Check immediately
    checkNotifications();

    // Then check every 5 minutes
    const interval = setInterval(checkNotifications, 5 * 60 * 1000);

    // Listen for data updates from AutoDataCollector
    const handleDataUpdate = () => {
      setTimeout(checkNotifications, 2000); // Wait 2 seconds for data to settle
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('dataUpdated', handleDataUpdate);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('dataUpdated', handleDataUpdate);
      }
    };
  }, []);

  const checkBreakoutArtists = async () => {
    try {
      const artists = await TrendingArtist.list('-trend_momentum', 10);
      return artists.filter(artist => 
        artist.breakout_potential && 
        artist.trend_momentum > 85 &&
        artist.growth_rate > 15
      );
    } catch (error) {
      console.error('Error checking breakout artists:', error);
      return [];
    }
  };

  const checkOpportunities = async () => {
    try {
      const keywords = await Keyword.list('-opportunity_score', 20);
      return keywords.filter(keyword => 
        keyword.opportunity_score > 70 && 
        keyword.competition_score < 0.6
      );
    } catch (error) {
      console.error('Error checking opportunities:', error);
      return [];
    }
  };

  const checkViralKeywords = async () => {
    try {
      const keywords = await Keyword.list('-search_volume', 10);
      return keywords.filter(keyword => 
        keyword.search_volume > 50000 && 
        keyword.trend_direction === 'rising'
      );
    } catch (error) {
      console.error('Error checking viral keywords:', error);
      return [];
    }
  };

  const checkMarketShifts = async () => {
    try {
      // Analyze genre trends
      const artists = await TrendingArtist.list('-trend_momentum', 50);
      const genreStats = {};
      
      artists.forEach(artist => {
        const genre = artist.genre_primary || 'hip-hop';
        if (!genreStats[genre]) {
          genreStats[genre] = { count: 0, totalMomentum: 0 };
        }
        genreStats[genre].count++;
        genreStats[genre].totalMomentum += artist.trend_momentum || 0;
      });

      return Object.entries(genreStats)
        .map(([genre, stats]) => ({
          genre,
          growth: Math.round((stats.totalMomentum / stats.count) - 50), // Baseline of 50
          avgMomentum: stats.totalMomentum / stats.count
        }))
        .filter(shift => shift.growth > 15)
        .slice(0, 2);
    } catch (error) {
      console.error('Error checking market shifts:', error);
      return [];
    }
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const dismissAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification) => {
    // Track click analytics
    console.log('Notification clicked:', notification.type);
    
    // Navigate to the action URL
    if (notification.actionUrl && typeof window !== 'undefined') {
      window.location.href = notification.actionUrl;
    }
    
    // Dismiss the notification
    dismissNotification(notification.id);
  };

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      {/* Header with dismiss all */}
      {notifications.length > 1 && (
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600 font-medium">
              {notifications.length} alerts
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={dismissAll}
            className="text-xs h-6"
          >
            Dismiss all
          </Button>
        </div>
      )}

      {/* Notifications */}
      {notifications.map((notification) => {
        const IconComponent = notification.icon;
        
        return (
          <Card 
            key={notification.id} 
            className="border-0 shadow-lg bg-white backdrop-blur-sm hover:shadow-xl transition-all duration-200 cursor-pointer animate-slide-in-right"
            onClick={() => handleNotificationClick(notification)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-8 h-8 rounded-full ${notification.color} flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                      {notification.title}
                    </h4>
                    <Badge 
                      variant={notification.priority === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {notification.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {notification.message}
                  </p>

                  {/* Action button */}
                  <Button 
                    size="sm" 
                    className="text-xs h-7 w-full justify-center"
                    variant="outline"
                  >
                    {notification.action} →
                  </Button>

                  {/* Metadata */}
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                    <span>
                      {new Date(notification.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {notification.type === 'opportunity' && notification.opportunityScore && (
                      <span className="font-medium text-green-600">
                        {notification.opportunityScore}% opportunity
                      </span>
                    )}
                    {notification.type === 'viral' && notification.searchVolume && (
                      <span className="font-medium text-purple-600">
                        {notification.searchVolume.toLocaleString()} searches
                      </span>
                    )}
                  </div>
                </div>

                {/* Dismiss button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 text-gray-400 hover:text-gray-600 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(notification.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Notification toggle */}
      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Hide notifications
        </Button>
      </div>
    </div>
  );
}

// Notification Bell component for header
export function NotificationBell() {
  const [hasUnread, setHasUnread] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const checkUnread = async () => {
      try {
        // Check for high-priority items
        const artists = await TrendingArtist.list('-trend_momentum', 5);
        const keywords = await Keyword.list('-opportunity_score', 5);
        
        const breakouts = artists.filter(a => a.breakout_potential && a.trend_momentum > 85).length;
        const opportunities = keywords.filter(k => k.opportunity_score > 70).length;
        
        const totalCount = breakouts + opportunities;
        setCount(totalCount);
        setHasUnread(totalCount > 0);
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    };

    checkUnread();
    const interval = setInterval(checkUnread, 2 * 60 * 1000); // Check every 2 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {count > 9 ? '9+' : count}
            </span>
          </div>
        )}
      </Button>
    </div>
  );
}
