import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle, Settings, Power, Cpu } from 'lucide-react';
import { SensorData, RiskResult, Equipment, Alert } from '../types';
import { MockApiService } from '../services/mockApi';
import { SensorChart } from './SensorChart';
import { AlertModal } from './AlertModal';
import { EquipmentCard } from './EquipmentCard';
import { RiskGauge } from './RiskGauge';

export const Dashboard: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentRisk, setCurrentRisk] = useState<RiskResult | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string>('EQ001');

  // Initialize equipment and alerts
  useEffect(() => {
    const loadInitialData = async () => {
      const [equipmentData, alertData] = await Promise.all([
        MockApiService.getEquipment(),
        MockApiService.getAlerts()
      ]);
      setEquipment(equipmentData);
      setAlerts(alertData);
    };
    loadInitialData();
  }, []);

  // Sensor data streaming
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(async () => {
      const newSensorData = MockApiService.generateSensorData(selectedEquipment);
      
      setSensorData(prev => {
        const newData = [...prev, newSensorData];
        return newData.slice(-50); // Keep last 50 readings
      });

      // Send to mock API
      await MockApiService.postSensorData(newSensorData);
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring, selectedEquipment]);

  const startMonitoring = () => {
    setIsMonitoring(true);
    setSensorData([]);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const testMLPrediction = async () => {
    if (sensorData.length === 0) return;

    try {
      const result = await MockApiService.predictRisk(sensorData);
      setCurrentRisk(result);
      
      // Show alert if risk is high
      if (result.riskScore > 70) {
        setShowAlert(true);
        // In a real app, you'd play a sound here
      }
    } catch (error) {
      console.error('ML prediction failed:', error);
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
  };

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'CRITICAL');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">Smart Equipment Maintenance Assistant</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-400' : 'bg-gray-400'}`} />
              <span className="text-sm">{isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}</span>
            </div>
            {unacknowledgedAlerts.length > 0 && (
              <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">{unacknowledgedAlerts.length} Active Alerts</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Control Panel */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Control Panel
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium">Equipment:</label>
              <select 
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
              >
                {equipment.map(eq => (
                  <option key={eq.id} value={eq.id}>{eq.name}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={startMonitoring}
              disabled={isMonitoring}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              <Power className="w-4 h-4" />
              <span>Start Monitoring</span>
            </button>
            
            <button
              onClick={stopMonitoring}
              disabled={!isMonitoring}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Stop Monitoring</span>
            </button>
            
            <button
              onClick={testMLPrediction}
              disabled={sensorData.length === 0}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              <Cpu className="w-4 h-4" />
              <span>Test ML Prediction</span>
            </button>
          </div>
        </div>

        {/* Equipment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {equipment.map(eq => (
            <EquipmentCard key={eq.id} equipment={eq} />
          ))}
        </div>

        {/* Sensor Data and Risk Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sensor Charts */}
          <div className="lg:col-span-2">
            <SensorChart data={sensorData} />
          </div>
          
          {/* Risk Gauge */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Risk Analysis</h3>
            <RiskGauge risk={currentRisk} />
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Active Alerts ({unacknowledgedAlerts.length})
          </h3>
          <div className="space-y-3">
            {unacknowledgedAlerts.length === 0 ? (
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>No active alerts</span>
              </div>
            ) : (
              unacknowledgedAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.severity === 'CRITICAL' 
                      ? 'bg-red-900/20 border-red-500 text-red-200'
                      : alert.severity === 'HIGH'
                      ? 'bg-orange-900/20 border-orange-500 text-orange-200'
                      : 'bg-yellow-900/20 border-yellow-500 text-yellow-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.equipmentName}</h4>
                      <p className="text-sm opacity-90">{alert.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      {showAlert && currentRisk && (
        <AlertModal
          risk={currentRisk}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};