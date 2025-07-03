import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Equipment } from '../types';

interface EquipmentCardProps {
  equipment: Equipment;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  const getStatusIcon = (status: Equipment['status']) => {
    switch (status) {
      case 'HEALTHY':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'CRITICAL':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'OFFLINE':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
  };

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'HEALTHY':
        return 'border-green-400';
      case 'WARNING':
        return 'border-yellow-400';
      case 'CRITICAL':
        return 'border-red-400';
      case 'OFFLINE':
        return 'border-gray-400';
      default:
        return 'border-green-400';
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore < 25) return 'text-green-400';
    if (riskScore < 50) return 'text-yellow-400';
    if (riskScore < 75) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-4 border-l-4 ${getStatusColor(equipment.status)}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white">{equipment.name}</h3>
          <p className="text-sm text-gray-400">{equipment.type}</p>
        </div>
        {getStatusIcon(equipment.status)}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Risk Score</span>
          <span className={`font-semibold ${getRiskColor(equipment.riskScore)}`}>
            {equipment.riskScore}%
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Status</span>
          <span className={`text-sm font-medium ${
            equipment.status === 'HEALTHY' ? 'text-green-400' :
            equipment.status === 'WARNING' ? 'text-yellow-400' :
            equipment.status === 'CRITICAL' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {equipment.status}
          </span>
        </div>
        
        <div className="pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Last Maintenance</span>
            <span className="text-xs text-gray-300">{equipment.lastMaintenance}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-400">Next Maintenance</span>
            <span className="text-xs text-gray-300">{equipment.nextMaintenance}</span>
          </div>
        </div>
      </div>
    </div>
  );
};