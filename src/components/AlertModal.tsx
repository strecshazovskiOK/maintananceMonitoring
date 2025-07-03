import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { RiskResult } from '../types';

interface AlertModalProps {
  risk: RiskResult;
  onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({ risk, onClose }) => {
  useEffect(() => {
    // In a real app, you would play an alert sound here
    console.log('Alert sound would play here');
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border-2 border-red-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-red-400">High Risk Alert</h3>
              <p className="text-sm text-gray-400">Equipment requires immediate attention</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Risk Score</span>
              <span className="text-xl font-bold text-red-400">{risk.riskScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Prediction</span>
              <span className="text-sm font-bold text-red-400">{risk.prediction} RISK</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Current Readings</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <div className="text-gray-400">Temperature</div>
                <div className="font-semibold">{risk.factors.temperature.toFixed(1)}°F</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Vibration</div>
                <div className="font-semibold">{risk.factors.vibration.toFixed(1)} Hz</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Current</div>
                <div className="font-semibold">{risk.factors.current.toFixed(1)} A</div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-3">
            <p className="text-sm text-yellow-200">
              <strong>Recommended Action:</strong> Schedule immediate maintenance inspection. 
              High risk readings indicate potential equipment failure.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Acknowledge Alert
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Schedule Maintenance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};