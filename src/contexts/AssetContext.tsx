import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import Papa from 'papaparse';
import {
  AssetData,
  DatabaseHealthResponse,
  PriorityResponse,
  getDatabaseHealth,
  fetchAssetsList,
  fetchAssetById,
  fetchLiveAssetPriority,
  enrichAsset,
} from '../services/api';

export type { AssetData, DatabaseHealthResponse, PriorityResponse };

interface AssetContextType {
  data: AssetData[];
  loading: boolean;
  error: string | null;
  dbHealth: DatabaseHealthResponse | null;
  totalCount: number;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshData: () => Promise<void>;
  fetchAssetDetails: (assetId: string) => Promise<AssetData | null>;
  fetchPriority: (assetId: string) => Promise<PriorityResponse | null>;
  // Fallback Controls
  isFallbackActive: boolean;
  autoFallbackEnabled: boolean;
  setAutoFallbackEnabled: (enabled: boolean) => void;
  loadFallbackData: () => Promise<void>;
  unloadFallbackData: () => Promise<void>;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const useAssetData = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssetData must be used within an AssetProvider');
  }
  return context;
};

interface AssetProviderProps {
  children: ReactNode;
}

export const AssetProvider: React.FC<AssetProviderProps> = ({ children }) => {
  const [data, setData] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbHealth, setDbHealth] = useState<DatabaseHealthResponse | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Fallback states
  const [isFallbackActive, setIsFallbackActive] = useState<boolean>(false);
  const [autoFallbackEnabled, setAutoFallbackEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('railpravah_auto_fallback') === 'true';
  });

  const setAutoFallbackEnabled = (enabled: boolean) => {
    setAutoFallbackEnabledState(enabled);
    localStorage.setItem('railpravah_auto_fallback', enabled ? 'true' : 'false');
  };

  // Filters
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadFallbackData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/block_asset_dataset.csv');
      if (!response.ok) throw new Error("Could not fetch fallback dataset");
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = (results.data as any[]).map(enrichAsset);
          setData(parsed);
          setTotalCount(parsed.length);
          setIsFallbackActive(true);
          setLoading(false);
          setDbHealth(prev => ({
            status: 'disconnected',
            detail: 'Running on local training dataset (manual fallback)',
            engine: prev?.engine,
            latency_ms: prev?.latency_ms,
            asset_count: parsed.length,
          }));
        },
        error: (err: any) => {
          setError(err.message);
          setLoading(false);
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to load local fallback dataset");
      setLoading(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Check live database health
      const health = await getDatabaseHealth();
      setDbHealth(health);

      if (health.status === 'connected') {
        setTotalCount(health.asset_count || 10000);

        // Fetch assets from PostgreSQL (fetch up to 500 assets for fast client filtering and rendering)
        const response = await fetchAssetsList({
          limit: 500,
          offset: 0,
          asset_type: selectedType !== 'All' ? selectedType : undefined,
          zone: selectedZone !== 'All' ? selectedZone : undefined,
        });

        setData(response.assets);
        setIsFallbackActive(false);
        setLoading(false);
        return;
      }

      // If database is not connected
      console.warn("Database not fully connected:", health.detail);
      if (autoFallbackEnabled) {
        console.warn("Auto-fallback enabled, attempting local fallback...");
        await loadFallbackData();
      } else {
        setData([]);
        setTotalCount(0);
        setIsFallbackActive(false);
        setError(health.detail || "PostgreSQL database is disconnected or unreachable.");
        setLoading(false);
      }
    } catch (err: any) {
      console.warn("Failed fetching from PostgreSQL backend:", err);
      setDbHealth({
        status: 'disconnected',
        detail: err.message || 'Unable to connect to backend server',
      });
      if (autoFallbackEnabled) {
        console.warn("Auto-fallback enabled, attempting local fallback...");
        await loadFallbackData();
      } else {
        setData([]);
        setTotalCount(0);
        setIsFallbackActive(false);
        setError(err.message || "Unable to reach PostgreSQL backend server.");
        setLoading(false);
      }
    }
  }, [selectedZone, selectedType, autoFallbackEnabled, loadFallbackData]);

  const unloadFallbackData = useCallback(async () => {
    setData([]);
    setTotalCount(0);
    setIsFallbackActive(false);
    await loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const fetchAssetDetails = async (assetId: string): Promise<AssetData | null> => {
    try {
      return await fetchAssetById(assetId);
    } catch {
      return data.find((a) => a.asset_id === assetId) || null;
    }
  };

  const fetchPriority = async (assetId: string): Promise<PriorityResponse | null> => {
    try {
      return await fetchLiveAssetPriority(assetId);
    } catch (err) {
      console.error(`Live priority fetch failed for ${assetId}:`, err);
      return null;
    }
  };

  return (
    <AssetContext.Provider
      value={{
        data,
        loading,
        error,
        dbHealth,
        totalCount,
        selectedZone,
        setSelectedZone,
        selectedType,
        setSelectedType,
        searchQuery,
        setSearchQuery,
        refreshData: loadData,
        fetchAssetDetails,
        fetchPriority,
        isFallbackActive,
        autoFallbackEnabled,
        setAutoFallbackEnabled,
        loadFallbackData,
        unloadFallbackData,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};
