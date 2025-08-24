import { useEffect } from 'react';
import { autoDataCollector } from '../services/AutoDataCollector';
import { youtubeAPI } from '../api/youtubeClient';

export function useAutoDataCollector() {
  useEffect(() => {
    // Start the auto data collector when the app loads
    const initializeCollector = async () => {
      try {
        console.log('🚀 Initializing Auto Data Collector...');
        
        // Check if YouTube API is available
        if (!youtubeAPI.apiKey) {
          console.warn('⚠️ YouTube API key not available, skipping auto data collection');
          return;
        }
        
        await autoDataCollector.start();
        console.log('✅ Auto Data Collector started successfully');
      } catch (error) {
        console.error('❌ Failed to start Auto Data Collector:', error);
      }
    };

    // Start with a delay to allow the app to fully load
    const timer = setTimeout(initializeCollector, 3000);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      autoDataCollector.stop();
    };
  }, []);

  return autoDataCollector.getStatus();
}

export function useDataUpdateListener() {
  useEffect(() => {
    const handleDataUpdate = (event) => {
      console.log('📊 Data updated at:', event.detail.timestamp);
      // You can trigger UI updates here if needed
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('dataUpdated', handleDataUpdate);
      
      return () => {
        window.removeEventListener('dataUpdated', handleDataUpdate);
      };
    }
  }, []);
}
