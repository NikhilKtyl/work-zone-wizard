import { useState, useEffect, useCallback } from 'react';

export interface SyncQueueItem {
  id: string;
  type: 'unit_update' | 'emergency_job' | 'change_request' | 'photo' | 'gps';
  data: unknown;
  timestamp: string;
  retries: number;
}

const SYNC_QUEUE_KEY = 'berrytech_sync_queue';
const CACHED_DATA_KEY = 'berrytech_cached_data';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Load sync queue from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SYNC_QUEUE_KEY);
    if (stored) {
      try {
        setSyncQueue(JSON.parse(stored));
      } catch {
        setSyncQueue([]);
      }
    }
    
    const lastSync = localStorage.getItem('berrytech_last_sync');
    if (lastSync) {
      setLastSyncTime(lastSync);
    }
  }, []);

  // Save sync queue to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(syncQueue));
  }, [syncQueue]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Add item to sync queue
  const addToSyncQueue = useCallback((type: SyncQueueItem['type'], data: unknown) => {
    const item: SyncQueueItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date().toISOString(),
      retries: 0,
    };
    setSyncQueue((prev) => [...prev, item]);
    return item.id;
  }, []);

  // Remove item from sync queue
  const removeFromSyncQueue = useCallback((id: string) => {
    setSyncQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Simulate syncing (in real app, this would call APIs)
  const syncData = useCallback(async () => {
    if (!isOnline || syncQueue.length === 0 || isSyncing) return;

    setIsSyncing(true);
    const itemsToSync = [...syncQueue];
    const syncedIds: string[] = [];

    for (const item of itemsToSync) {
      try {
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // In real implementation, send data to server based on item.type
        console.log(`Synced ${item.type}:`, item.data);
        syncedIds.push(item.id);
      } catch (error) {
        console.error(`Failed to sync ${item.id}:`, error);
        // Increment retry count
        setSyncQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, retries: q.retries + 1 } : q
          )
        );
      }
    }

    // Remove successfully synced items
    setSyncQueue((prev) => prev.filter((item) => !syncedIds.includes(item.id)));
    
    const now = new Date().toISOString();
    setLastSyncTime(now);
    localStorage.setItem('berrytech_last_sync', now);
    setIsSyncing(false);
  }, [isOnline, syncQueue, isSyncing]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && syncQueue.length > 0) {
      syncData();
    }
  }, [isOnline, syncData, syncQueue.length]);

  return {
    isOnline,
    syncQueue,
    pendingCount: syncQueue.length,
    isSyncing,
    lastSyncTime,
    addToSyncQueue,
    removeFromSyncQueue,
    syncData,
  };
};

// Hook for caching data locally
export const useCachedData = <T,>(key: string, initialData: T) => {
  const [data, setData] = useState<T>(() => {
    const cached = localStorage.getItem(`${CACHED_DATA_KEY}_${key}`);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return initialData;
      }
    }
    return initialData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(`${CACHED_DATA_KEY}_${key}`, JSON.stringify(data));
  }, [data, key]);

  const updateData = useCallback((newData: T | ((prev: T) => T)) => {
    setData(newData);
  }, []);

  const clearCache = useCallback(() => {
    localStorage.removeItem(`${CACHED_DATA_KEY}_${key}`);
    setData(initialData);
  }, [key, initialData]);

  return { data, updateData, clearCache };
};
