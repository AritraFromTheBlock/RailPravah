import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Papa from 'papaparse';

export interface AssetData {
  asset_id: string;
  asset_type: string;
  section_type: string;
  zone: string;
  age_years: number;
  inspection_interval_days: number;
  last_inspection_days_ago: number;
  overdue_ratio: number;
  traffic_density_trains_per_day: number;
  max_speed_kmph: number;
  load_tonnage_daily: number;
  weather_exposure_index: number;
  temperature_extremity_index: number;
  gradient_curvature_index: number;
  condition_rating: number;
  corrosion_index: number;
  historical_failures_last_2yrs: number;
  avg_repair_time_hours: number;
  redundancy_available: boolean;
  distance_from_depot_km: number;
  passenger_footfall_daily: number;
  freight_value_index: number;
  trains_affected_if_failure: number;
  risk_score: number;
  failure_within_30_days: number;
  criticality_score: number;
  urgency_score: number;
  impact_score: number;
  final_priority_score: number;
}

interface AssetContextType {
  data: AssetData[];
  loading: boolean;
  error: string | null;
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

  useEffect(() => {
    fetch('/block_asset_dataset.csv')
      .then(response => {
        if (!response.ok) throw new Error("Could not fetch dataset");
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data as AssetData[]);
            setLoading(false);
          },
          error: (err: any) => {
            setError(err.message);
            setLoading(false);
          }
        });
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <AssetContext.Provider value={{ data, loading, error }}>
      {children}
    </AssetContext.Provider>
  );
};
