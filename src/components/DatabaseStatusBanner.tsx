import React, { useState } from 'react';
import { useAssetData } from '../contexts/AssetContext';

export const DatabaseStatusBanner: React.FC = () => {
  const {
    dbHealth,
    refreshData,
    isFallbackActive,
    autoFallbackEnabled,
    setAutoFallbackEnabled,
    loadFallbackData,
    unloadFallbackData,
    totalCount,
    loading,
  } = useAssetData();

  const [isPulling, setIsPulling] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const isConnected = dbHealth?.status === 'connected';

  const handlePullFallback = async () => {
    setIsPulling(true);
    await loadFallbackData();
    setIsPulling(false);
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    await refreshData();
    setIsRetrying(false);
  };

  const handleUnload = async () => {
    setIsRetrying(true);
    await unloadFallbackData();
    setIsRetrying(false);
  };

  // 1. PostgreSQL Connected State (Subtle bar)
  if (isConnected) {
    return (
      <div
        className="db-status-banner db-connected"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          marginBottom: '16px',
          borderRadius: '8px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          fontSize: '13px',
          color: 'var(--text-main, #f1f5f9)',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
          <strong>Live PostgreSQL ({dbHealth?.engine || 'Supabase'}) Connected</strong>
          {dbHealth?.latency_ms !== undefined && (
            <span style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '12px' }}>
              • Latency: {dbHealth.latency_ms}ms
            </span>
          )}
          <span style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '12px' }}>
            • {totalCount.toLocaleString()} Records Active
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleRetry}
            disabled={isRetrying || loading}
            style={{
              background: 'transparent',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              padding: '4px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Sync latest records from PostgreSQL"
          >
            <span>🔄</span> {isRetrying ? 'Syncing...' : 'Sync DB'}
          </button>
        </div>
      </div>
    );
  }

  // 2. Disconnected & Fallback IS Active (Amber Warning)
  if (isFallbackActive) {
    return (
      <div
        className="db-status-banner db-fallback-active"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 18px',
          marginBottom: '16px',
          borderRadius: '10px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          color: 'var(--text-main, #f1f5f9)',
          fontSize: '13px',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '280px' }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 600, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Operating on Local Training Dataset (Manual Fallback)
              <span
                style={{
                  fontSize: '11px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 500,
                }}
              >
                {totalCount.toLocaleString()} assets loaded
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', marginTop: '2px' }}>
              Database is disconnected. Using static training data (<code style={{ color: '#fbbf24' }}>block_asset_dataset.csv</code>).
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Auto fallback toggle */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--text-secondary, #cbd5e1)',
              cursor: 'pointer',
              background: 'rgba(0,0,0,0.15)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <input
              type="checkbox"
              checked={autoFallbackEnabled}
              onChange={(e) => setAutoFallbackEnabled(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            Auto-Fallback on Disconnect
          </label>

          {/* Unload fallback button */}
          <button
            onClick={handleUnload}
            disabled={isRetrying || loading}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Unload local training dataset and recheck PostgreSQL"
          >
            <span>✕</span> {isRetrying ? 'Resetting...' : 'Unload Fallback'}
          </button>

          {/* Retry DB Connection */}
          <button
            onClick={handleRetry}
            disabled={isRetrying || loading}
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>🔄</span> {isRetrying ? 'Reconnecting...' : 'Reconnect PostgreSQL'}
          </button>
        </div>
      </div>
    );
  }

  // 3. Disconnected & Fallback NOT Active (Red Alert + Explicit Pull Button)
  return (
    <div
      className="db-status-banner db-disconnected"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 18px',
        marginBottom: '16px',
        borderRadius: '10px',
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        color: 'var(--text-main, #f1f5f9)',
        fontSize: '13px',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            boxShadow: '0 0 10px #ef4444',
            display: 'inline-block',
          }}
        />
        <div>
          <div style={{ fontWeight: 600, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
            PostgreSQL Database Disconnected
            <span
              style={{
                fontSize: '11px',
                background: 'rgba(239, 68, 68, 0.2)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 500,
              }}
            >
              Offline
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', marginTop: '2px' }}>
            Backend at <code style={{ color: '#f87171' }}>https://railprava-backend-api-caller.onrender.com</code> is unreachable. Auto-fallback is <strong>OFF</strong>.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Auto fallback toggle */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--text-secondary, #cbd5e1)',
            cursor: 'pointer',
            background: 'rgba(0,0,0,0.15)',
            padding: '5px 9px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          title="When enabled, automatically switches to local dataset on connection failure"
        >
          <input
            type="checkbox"
            checked={autoFallbackEnabled}
            onChange={(e) => setAutoFallbackEnabled(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          Auto-Fallback: {autoFallbackEnabled ? 'ON' : 'OFF'}
        </label>

        {/* Retry DB Connection */}
        <button
          onClick={handleRetry}
          disabled={isRetrying || loading}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-color, rgba(255,255,255,0.15))',
            color: 'var(--text-main, #f1f5f9)',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span>🔄</span> {isRetrying ? 'Testing...' : 'Retry Connection'}
        </button>

        {/* EXPLICIT PULL BUTTON */}
        <button
          onClick={handlePullFallback}
          disabled={isPulling || loading}
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: 'none',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
          }}
          title="Explicitly load the local training dataset (block_asset_dataset.csv) to test frontend UI"
        >
          <span>📥</span> {isPulling ? 'Loading Dataset...' : 'Pull Local Training Dataset'}
        </button>
      </div>
    </div>
  );
};

export default DatabaseStatusBanner;
