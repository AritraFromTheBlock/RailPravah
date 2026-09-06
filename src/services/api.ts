/**
 * RailPravah API Service Layer
 * Connects the frontend to the PostgreSQL (Supabase) database via FastAPI priority engine backend.
 */

export interface AssetData {
  asset_id: string;
  asset_type: string;
  section_type: string;
  zone: string;
  age_years: number;
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
  risk_score: number;
  failure_within_30_days: boolean | number;
  created_at?: string;

  // Enriched client-side / ML values
  inspection_interval_days?: number;
  passenger_footfall_daily?: number;
  freight_value_index?: number;
  trains_affected_if_failure?: number;
  criticality_score?: number;
  urgency_score?: number;
  impact_score?: number;
  final_priority_score?: number;
}

export interface DatabaseHealthResponse {
  status: 'connected' | 'error' | 'disconnected';
  latency_ms?: number;
  asset_count?: number;
  engine?: string;
  detail?: string;
}

export interface ActionPlan {
  urgency_level: 'Critical' | 'High' | 'Medium' | 'Low' | string;
  recommended_action: string;
  suggested_team: string;
}

export interface PriorityResponse {
  asset_id: string;
  risk_score: number;
  failure_probability: number;
  priority_score: number;
  action_plan: ActionPlan;
  top_risk_factors: string[];
}

export interface AssetsListResponse {
  count: number;
  limit: number;
  offset: number;
  assets: AssetData[];
}

const RAW_API_URL = ((import.meta as any).env?.VITE_API_BASE_URL as string) || 'https://railprava-backend-api-caller.onrender.com';
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

/**
 * Check connectivity and latency to the PostgreSQL database.
 */
export async function getDatabaseHealth(): Promise<DatabaseHealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/database/health`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      return {
        status: 'error',
        detail: err.detail || `Server responded with ${res.status}`,
      };
    }
    return await res.json();
  } catch (error: any) {
    return {
      status: 'disconnected',
      detail: error.message || 'Unable to connect to backend server',
    };
  }
}

/**
 * Fetch paginated assets directly from PostgreSQL.
 */
export async function fetchAssetsList(params: {
  limit?: number;
  offset?: number;
  asset_type?: string;
  zone?: string;
}): Promise<AssetsListResponse> {
  const query = new URLSearchParams();
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.offset !== undefined) query.set('offset', params.offset.toString());
  if (params.asset_type && params.asset_type !== 'All') query.set('asset_type', params.asset_type);
  if (params.zone && params.zone !== 'All') query.set('zone', params.zone);

  const url = `${API_BASE_URL}/api/v1/assets?${query.toString()}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });

  if (!res.ok) {
    throw new Error(`Failed to fetch assets: ${res.status} ${res.statusText}`);
  }

  const data: AssetsListResponse = await res.json();
  
  // Enrich assets with calculated fields if not populated
  data.assets = data.assets.map(enrichAsset);
  return data;
}

/**
 * Fetch a single asset live from PostgreSQL.
 */
export async function fetchAssetById(assetId: string): Promise<AssetData> {
  const res = await fetch(`${API_BASE_URL}/api/v1/assets/${encodeURIComponent(assetId)}`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Asset ${assetId} not found (${res.status})`);
  }
  const asset = await res.json();
  return enrichAsset(asset);
}

/**
 * Run live ML XGBoost inference for an asset from PostgreSQL.
 */
export async function fetchLiveAssetPriority(assetId: string): Promise<PriorityResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/predict/live/${encodeURIComponent(assetId)}`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Failed to run priority calculation for ${assetId}`);
  }
  return await res.json();
}

/**
 * Enriches asset fields with scores for ranking and sorting.
 */
export function enrichAsset(asset: any): AssetData {
  const isFailure = asset.failure_within_30_days === true || asset.failure_within_30_days === 1;
  const failureProb = isFailure ? 0.85 : Math.min(1.0, (asset.overdue_ratio || 0) * 0.4 + (asset.corrosion_index || 0) * 0.3);
  const risk = Number(asset.risk_score || 0);

  // Consistent with backend Priority Engine formula: (failure_prob * 60) + (risk * 40)
  const priorityScore = asset.final_priority_score ?? Math.min(100, Math.max(0, (failureProb * 60) + (risk * 40)));
  const urgency = asset.urgency_score ?? Math.min(1.0, (priorityScore / 100) * 0.7 + (asset.overdue_ratio > 1 ? 0.3 : 0));
  const criticality = asset.criticality_score ?? ((asset.max_speed_kmph || 100) / 160) * 0.5 + ((asset.load_tonnage_daily || 2000) / 5000) * 0.5;

  return {
    ...asset,
    failure_within_30_days: isFailure ? 1 : 0,
    final_priority_score: Number(priorityScore.toFixed(2)),
    urgency_score: Number(urgency.toFixed(2)),
    criticality_score: Number(criticality.toFixed(2)),
    impact_score: Number(((criticality * 0.5) + (risk * 0.5)).toFixed(2)),
    condition_rating: Number(Number(asset.condition_rating || 3).toFixed(2)),
    risk_score: Number(risk.toFixed(4)),
    overdue_ratio: Number(Number(asset.overdue_ratio || 0).toFixed(3)),
    last_inspection_days_ago: Number(Number(asset.last_inspection_days_ago || 0).toFixed(1)),
    age_years: Number(Number(asset.age_years || 0).toFixed(1)),
  };
}
