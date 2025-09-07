// components/ui/business-dashboard.tsx
// Dashboard de métricas para sócios - Feature operacional

'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Home, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Target
} from 'lucide-react';

interface BusinessMetrics {
  totalListings: number;
  averagePriceForSale: number;
  averagePriceForRent: number;
  hottestProperty: any;
  priceDistribution: {
    under500k: number;
    between500k1m: number;
    over1m: number;
  };
  locationStats: Array<{
    bairro: string;
    count: number;
    averagePrice: number;
  }>;
}

interface BusinessDashboardProps {
  className?: string;
  compact?: boolean;
}

export default function BusinessDashboard({ className = '', compact = false }: BusinessDashboardProps) {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
    
    // Auto-refresh a cada 5 minutos
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/business-metrics?metric=overview');
      const result = await response.json();
      
      if (result.success) {
        setMetrics(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch metrics');
      }
    } catch (err) {
      setError('Network error fetching metrics');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-md ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-slate-200 rounded"></div>
            <div className="h-20 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">Erro ao carregar métricas</span>
        </div>
        <p className="text-red-600 text-xs mt-1">{error}</p>
        <button 
          onClick={fetchMetrics}
          className="mt-2 text-red-700 text-xs underline hover:text-red-800"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-slate-900">
              {compact ? 'Métricas' : 'Dashboard Executivo'}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle className="w-3 h-3" />
            <span>Online</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Métricas Principais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Home className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Imóveis Ativos</span>
            </div>
            <p className="text-xl font-bold text-blue-900">{metrics.totalListings}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Preço Médio Venda</span>
            </div>
            <p className="text-sm font-bold text-green-900">
              {formatPrice(metrics.averagePriceForSale)}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">Preço Médio Aluguel</span>
            </div>
            <p className="text-sm font-bold text-purple-900">
              {formatPrice(metrics.averagePriceForRent)}
            </p>
          </div>

          <div className="bg-amber-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">Em Destaque</span>
            </div>
            <p className="text-xl font-bold text-amber-900">
              {metrics.hottestProperty ? '1' : '0'}
            </p>
          </div>
        </div>

        {!compact && (
          <>
            {/* Distribuição de Preços */}
            <div className="mb-6">
              <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Distribuição de Preços (Venda)
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded p-3 text-center">
                  <p className="text-xs text-slate-600 mb-1">Até R$ 500k</p>
                  <p className="text-lg font-bold text-slate-900">{metrics.priceDistribution.under500k}</p>
                </div>
                <div className="bg-slate-50 rounded p-3 text-center">
                  <p className="text-xs text-slate-600 mb-1">R$ 500k - R$ 1M</p>
                  <p className="text-lg font-bold text-slate-900">{metrics.priceDistribution.between500k1m}</p>
                </div>
                <div className="bg-slate-50 rounded p-3 text-center">
                  <p className="text-xs text-slate-600 mb-1">Acima de R$ 1M</p>
                  <p className="text-lg font-bold text-slate-900">{metrics.priceDistribution.over1m}</p>
                </div>
              </div>
            </div>

            {/* Top Bairros */}
            <div>
              <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Top Bairros
              </h4>
              <div className="space-y-2">
                {metrics.locationStats.slice(0, 5).map((location, index) => (
                  <div key={location.bairro} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-900">{location.bairro}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-600">{location.count} imóveis</p>
                      <p className="text-xs font-medium text-slate-900">
                        {formatPrice(location.averagePrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Atualizado há {new Date().toLocaleTimeString('pt-BR', { timeStyle: 'short' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>Dashboard Executivo</span>
          </div>
        </div>
      </div>
    </div>
  );
}