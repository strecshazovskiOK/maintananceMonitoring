import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SensorData } from '../types';
import { TrendingUp } from 'lucide-react';

interface SensorChartProps {
  data: SensorData[];
}

export const SensorChart: React.FC<SensorChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    temperature: item.temperature,
    vibration: item.vibration,
    current: item.current
  }));

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2" />
        Live Sensor Data
      </h3>
      
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400">
          <p>Start monitoring to see sensor data</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Temperature (°F)"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="vibration" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Vibration (Hz)"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="current" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Current (A)"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};