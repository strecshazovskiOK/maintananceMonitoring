import React from 'react';
import { RiskResult } from '../types';
import { Brain, TrendingUp, Thermometer, Zap } from 'lucide-react';

interface RiskGaugeProps {
  risk: RiskResult | null;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ risk }) => {
  if (!risk) {
    return (
      <div className="text-center text-gray-400 py-8">
        <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Run ML prediction to see risk analysis</p>
      </div>
    );
  }

  const getRiskColor = (score: number) => {
    if (score < 25) return 'text-green-400';
    if (score < 50) return 'text-yellow-400';
    if (score < 75) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRiskBgColor = (score: number) => {
    if (score < 25) return 'bg-green-400';
    if (score < 50) return 'bg-yellow-400';
    if (score < 75) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'LOW': return 'text-green-400 bg-green-400/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/20';
      case 'HIGH': return 'text-orange-400 bg-orange-400/20';
      case 'CRITICAL': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Risk Score Gauge */}
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#374151"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${(risk.riskScore / 100) * 351.86} 351.86`}
              strokeLinecap="round"
              className={getRiskColor(risk.riskScore)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getRiskColor(risk.riskScore)}`}>
                {risk.riskScore}%
              </div>
              <div className="text-xs text-gray-400">RISK</div>
            </div>
          </div>
        </div>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPredictionColor(risk.prediction)}`}>
          {risk.prediction} RISK
        </div>
      </div>

      {/* Factors */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Contributing Factors</h4>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-red-400" />
            <span className="text-sm">Temperature</span>
          </div>
          <span className="text-sm font-medium">{risk.factors.temperature.toFixed(1)}°F</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm">Vibration</span>
          </div>
          <span className="text-sm font-medium">{risk.factors.vibration.toFixed(1)} Hz</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm">Current</span>
          </div>
          <span className="text-sm font-medium">{risk.factors.current.toFixed(1)} A</span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="text-xs text-gray-400 text-center">
        Last updated: {new Date(risk.timestamp).toLocaleString()}
      </div>
    </div>
  );
};