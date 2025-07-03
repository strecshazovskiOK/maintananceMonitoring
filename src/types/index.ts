export interface SensorData {
  id: string;
  equipmentId: string;
  temperature: number;
  vibration: number;
  current: number;
  timestamp: number;
}

export interface RiskResult {
  riskScore: number;
  timestamp: string;
  equipmentId: string;
  prediction: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: {
    temperature: number;
    vibration: number;
    current: number;
  };
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  lastMaintenance: string;
  nextMaintenance: string;
  riskScore: number;
}

export interface Alert {
  id: string;
  equipmentId: string;
  equipmentName: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}