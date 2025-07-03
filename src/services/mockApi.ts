import { SensorData, RiskResult, Equipment, Alert } from '../types';

// Mock equipment data
const mockEquipment: Equipment[] = [
  {
    id: 'EQ001',
    name: 'Compressor Unit A',
    type: 'Compressor',
    status: 'HEALTHY',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15',
    riskScore: 25
  },
  {
    id: 'EQ002',
    name: 'Turbine Generator B',
    type: 'Generator',
    status: 'WARNING',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-03-10',
    riskScore: 65
  },
  {
    id: 'EQ003',
    name: 'Cooling Pump C',
    type: 'Pump',
    status: 'CRITICAL',
    lastMaintenance: '2024-01-01',
    nextMaintenance: '2024-02-01',
    riskScore: 85
  },
  {
    id: 'EQ004',
    name: 'Heat Exchanger D',
    type: 'Heat Exchanger',
    status: 'HEALTHY',
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-05-20',
    riskScore: 15
  }
];

export class MockApiService {
  static generateSensorData(equipmentId: string): SensorData {
    const baseTemp = 75;
    const baseVibration = 2.5;
    const baseCurrent = 15;
    
    return {
      id: `sensor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      equipmentId,
      temperature: baseTemp + (Math.random() - 0.5) * 10,
      vibration: baseVibration + (Math.random() - 0.5) * 2,
      current: baseCurrent + (Math.random() - 0.5) * 5,
      timestamp: Date.now()
    };
  }

  static async postSensorData(data: SensorData): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Sensor data sent:', data);
  }

  static async predictRisk(sensorData: SensorData[]): Promise<RiskResult> {
    // Simulate ML prediction API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const latestData = sensorData[sensorData.length - 1] || sensorData[0];
    
    // Calculate risk score based on sensor values
    const tempRisk = Math.max(0, (latestData.temperature - 70) * 2);
    const vibRisk = Math.max(0, (latestData.vibration - 2) * 20);
    const currentRisk = Math.max(0, (latestData.current - 12) * 5);
    
    const riskScore = Math.min(100, Math.max(0, tempRisk + vibRisk + currentRisk + Math.random() * 20));
    
    let prediction: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (riskScore < 25) prediction = 'LOW';
    else if (riskScore < 50) prediction = 'MEDIUM';
    else if (riskScore < 75) prediction = 'HIGH';
    else prediction = 'CRITICAL';

    return {
      riskScore: Math.round(riskScore),
      timestamp: new Date().toISOString(),
      equipmentId: latestData.equipmentId,
      prediction,
      factors: {
        temperature: latestData.temperature,
        vibration: latestData.vibration,
        current: latestData.current
      }
    };
  }

  static async getEquipment(): Promise<Equipment[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockEquipment;
  }

  static async getAlerts(): Promise<Alert[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [
      {
        id: 'alert_1',
        equipmentId: 'EQ003',
        equipmentName: 'Cooling Pump C',
        severity: 'CRITICAL',
        message: 'High vibration detected - immediate maintenance required',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        acknowledged: false
      },
      {
        id: 'alert_2',
        equipmentId: 'EQ002',
        equipmentName: 'Turbine Generator B',
        severity: 'HIGH',
        message: 'Temperature approaching critical threshold',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        acknowledged: false
      }
    ];
  }
}