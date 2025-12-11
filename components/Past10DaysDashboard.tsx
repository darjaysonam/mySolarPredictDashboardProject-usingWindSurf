import React, { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { HistoricalWeatherData, Theme } from '../types';
import { format, parseISO } from 'date-fns';
import { Thermometer, Wind, CloudRain, Sun, AlertCircle } from 'lucide-react';

interface Past10DaysDashboardProps {
  data: HistoricalWeatherData | null;
  theme: Theme;
  locationName?: string;
}

const Past10DaysDashboard: React.FC<Past10DaysDashboardProps> = ({ data, theme, locationName = 'Location' }) => {
  
  // Process data for daily aggregates
  const dailyData = useMemo(() => {
    if (!data || data.time.length === 0) return [];

    const dayMap = new Map<string, {
      date: string;
      avgTemp: number[];
      maxTemp: number;
      minTemp: number;
      avgHumidity: number[];
      avgWindSpeed: number[];
      totalPrecipitation: number;
      avgRadiation: number[];
      dataPoints: number;
    }>();

    // Group by date
    data.time.forEach((time, idx) => {
      const date = time.split('T')[0];
      
      if (!dayMap.has(date)) {
        dayMap.set(date, {
          date,
          avgTemp: [],
          maxTemp: -Infinity,
          minTemp: Infinity,
          avgHumidity: [],
          avgWindSpeed: [],
          totalPrecipitation: 0,
          avgRadiation: [],
          dataPoints: 0
        });
      }

      const day = dayMap.get(date)!;
      const temp = data.temperature_2m[idx];
      const humidity = data.humidity[idx];
      const windSpeed = data.windSpeed[idx];
      const radiation = data.shortwave_radiation[idx];
      const precip = data.precipitation[idx];

      day.avgTemp.push(temp);
      day.maxTemp = Math.max(day.maxTemp, temp);
      day.minTemp = Math.min(day.minTemp, temp);
      day.avgHumidity.push(humidity);
      day.avgWindSpeed.push(windSpeed);
      day.totalPrecipitation += precip;
      day.avgRadiation.push(radiation);
      day.dataPoints++;
    });

    // Calculate averages
    return Array.from(dayMap.values())
      .map(day => ({
        date: day.date,
        dateLabel: format(parseISO(day.date), 'MMM dd'),
        avgTemp: Number((day.avgTemp.reduce((a, b) => a + b, 0) / day.avgTemp.length).toFixed(1)),
        maxTemp: Number(day.maxTemp.toFixed(1)),
        minTemp: Number(day.minTemp.toFixed(1)),
        avgHumidity: Number((day.avgHumidity.reduce((a, b) => a + b, 0) / day.avgHumidity.length).toFixed(1)),
        avgWindSpeed: Number((day.avgWindSpeed.reduce((a, b) => a + b, 0) / day.avgWindSpeed.length).toFixed(1)),
        totalPrecipitation: Number(day.totalPrecipitation.toFixed(1)),
        avgRadiation: Number((day.avgRadiation.reduce((a, b) => a + b, 0) / day.avgRadiation.length).toFixed(1)),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    if (dailyData.length === 0) return null;

    const temps = dailyData.map(d => d.avgTemp);
    const humidity = dailyData.map(d => d.avgHumidity);
    const windSpeeds = dailyData.map(d => d.avgWindSpeed);
    const radiation = dailyData.map(d => d.avgRadiation);
    const precipitation = dailyData.map(d => d.totalPrecipitation);

    return {
      avgTemp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
      maxTemp: Math.max(...dailyData.map(d => d.maxTemp)).toFixed(1),
      minTemp: Math.min(...dailyData.map(d => d.minTemp)).toFixed(1),
      avgHumidity: (humidity.reduce((a, b) => a + b, 0) / humidity.length).toFixed(1),
      avgWindSpeed: (windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length).toFixed(1),
      totalPrecipitation: precipitation.reduce((a, b) => a + b, 0).toFixed(1),
      avgRadiation: (radiation.reduce((a, b) => a + b, 0) / radiation.length).toFixed(1),
      maxRadiation: Math.max(...radiation).toFixed(1),
    };
  }, [dailyData]);

  if (!data || dailyData.length === 0) {
    return (
      <div className={`${theme.classes.bgCard} rounded-xl p-8 border ${theme.classes.border} text-center`}>
        <AlertCircle className={`w-8 h-8 mx-auto mb-3 ${theme.classes.textDim}`} />
        <p className={`${theme.classes.textMuted}`}>No past 10 days data available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4`}>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`${theme.classes.bgCard} p-4 rounded-xl border ${theme.classes.border}`}>
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="w-4 h-4 text-orange-400" />
            <p className={`text-xs ${theme.classes.textMuted} uppercase font-semibold`}>Avg Temp</p>
          </div>
          <p className="text-2xl font-bold text-orange-400">{stats?.avgTemp}°C</p>
          <p className={`text-xs ${theme.classes.textDim} mt-1`}>
            <span className="text-green-400">{stats?.maxTemp}°</span> / 
            <span className="text-blue-400"> {stats?.minTemp}°</span>
          </p>
        </div>

        <div className={`${theme.classes.bgCard} p-4 rounded-xl border ${theme.classes.border}`}>
          <div className="flex items-center gap-2 mb-2">
            <CloudRain className="w-4 h-4 text-blue-400" />
            <p className={`text-xs ${theme.classes.textMuted} uppercase font-semibold`}>Humidity</p>
          </div>
          <p className="text-2xl font-bold text-blue-400">{stats?.avgHumidity}%</p>
          <p className={`text-xs ${theme.classes.textDim}`}>Average</p>
        </div>

        <div className={`${theme.classes.bgCard} p-4 rounded-xl border ${theme.classes.border}`}>
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-4 h-4 text-cyan-400" />
            <p className={`text-xs ${theme.classes.textMuted} uppercase font-semibold`}>Wind Speed</p>
          </div>
          <p className="text-2xl font-bold text-cyan-400">{stats?.avgWindSpeed} m/s</p>
          <p className={`text-xs ${theme.classes.textDim}`}>Average</p>
        </div>

        <div className={`${theme.classes.bgCard} p-4 rounded-xl border ${theme.classes.border}`}>
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-yellow-400" />
            <p className={`text-xs ${theme.classes.textMuted} uppercase font-semibold`}>Solar Rad</p>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{stats?.avgRadiation} W/m²</p>
          <p className={`text-xs ${theme.classes.textDim}`}>Average</p>
        </div>
      </div>

      {/* Temperature Chart */}
      <div className={`${theme.classes.bgCard} rounded-xl p-4 border ${theme.classes.border}`}>
        <h3 className={`text-sm font-semibold ${theme.classes.textMain} mb-4`}>Temperature Trend (Past 10 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={`${theme.id === 'cosmic' ? '#475569' : '#57534e'}`} />
            <XAxis 
              dataKey="dateLabel" 
              tick={{ fill: theme.id === 'cosmic' ? '#94a3b8' : '#a8a29e', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: theme.id === 'cosmic' ? '#94a3b8' : '#a8a29e', fontSize: 12 }}
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.id === 'cosmic' ? '#1e293b' : '#292423',
                border: `1px solid ${theme.id === 'cosmic' ? '#475569' : '#57534e'}`
              }}
            />
            <Legend />
            <Bar dataKey="maxTemp" fill="#ef4444" name="Max Temp" />
            <Bar dataKey="minTemp" fill="#3b82f6" name="Min Temp" />
            <Line type="monotone" dataKey="avgTemp" stroke="#f97316" name="Avg Temp" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Solar Radiation Chart */}
      <div className={`${theme.classes.bgCard} rounded-xl p-4 border ${theme.classes.border}`}>
        <h3 className={`text-sm font-semibold ${theme.classes.textMain} mb-4`}>Solar Radiation (Past 10 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={`${theme.id === 'cosmic' ? '#475569' : '#57534e'}`} />
            <XAxis 
              dataKey="dateLabel" 
              tick={{ fill: theme.id === 'cosmic' ? '#94a3b8' : '#a8a29e', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: theme.id === 'cosmic' ? '#94a3b8' : '#a8a29e', fontSize: 12 }}
              label={{ value: 'Radiation (W/m²)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.id === 'cosmic' ? '#1e293b' : '#292423',
                border: `1px solid ${theme.id === 'cosmic' ? '#475569' : '#57534e'}`
              }}
            />
            <Bar dataKey="avgRadiation" fill="#facc15" name="Avg Radiation" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Wind Speed & Humidity Chart */}
      <div className={`${theme.classes.bgCard} rounded-xl p-4 border ${theme.classes.border}`}>
        <h3 className={`text-sm font-semibold ${theme.classes.textMain} mb-4`}>Wind Speed & Humidity (Past 10 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={`${theme.id === 'cosmic' ? '#475569' : '#57534e'}`} />
            <XAxis 
              dataKey="dateLabel" 
              tick={{ fill: theme.id === 'cosmic' ? '#94a3b8' : '#a8a29e', fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: theme.id === 'cosmic' ? '#94a3b8' : '#a8a29e', fontSize: 12 }}
              label={{ value: 'Wind Speed (m/s)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: theme.id === 'cosmic' ? '#94a3b8' : '#a8a29e', fontSize: 12 }}
              label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.id === 'cosmic' ? '#1e293b' : '#292423',
                border: `1px solid ${theme.id === 'cosmic' ? '#475569' : '#57534e'}`
              }}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="avgWindSpeed" stroke="#06b6d4" name="Wind Speed (m/s)" strokeWidth={2} />
            <Bar yAxisId="right" dataKey="avgHumidity" fill="#3b82f6" name="Humidity (%)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Statistics Table */}
      <div className={`${theme.classes.bgCard} rounded-xl p-4 border ${theme.classes.border}`}>
        <h3 className={`text-sm font-semibold ${theme.classes.textMain} mb-4`}>Detailed Daily Data</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${theme.classes.border}`}>
                <th className={`text-left py-2 px-3 ${theme.classes.textMuted} font-semibold`}>Date</th>
                <th className={`text-right py-2 px-3 ${theme.classes.textMuted} font-semibold`}>Avg Temp (°C)</th>
                <th className={`text-right py-2 px-3 ${theme.classes.textMuted} font-semibold`}>Max/Min</th>
                <th className={`text-right py-2 px-3 ${theme.classes.textMuted} font-semibold`}>Humidity (%)</th>
                <th className={`text-right py-2 px-3 ${theme.classes.textMuted} font-semibold`}>Wind (m/s)</th>
                <th className={`text-right py-2 px-3 ${theme.classes.textMuted} font-semibold`}>Radiation (W/m²)</th>
                <th className={`text-right py-2 px-3 ${theme.classes.textMuted} font-semibold`}>Precip (mm)</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.map((day, idx) => (
                <tr key={idx} className={`border-b ${theme.classes.border} hover:${theme.classes.bgInput} transition-colors`}>
                  <td className={`py-2 px-3 ${theme.classes.textMain}`}>{day.dateLabel}</td>
                  <td className={`text-right py-2 px-3 ${theme.classes.textMain} font-semibold`}>{day.avgTemp}</td>
                  <td className={`text-right py-2 px-3 ${theme.classes.textDim}`}>{day.maxTemp} / {day.minTemp}</td>
                  <td className={`text-right py-2 px-3 ${theme.classes.textMain}`}>{day.avgHumidity}</td>
                  <td className={`text-right py-2 px-3 ${theme.classes.textMain}`}>{day.avgWindSpeed}</td>
                  <td className={`text-right py-2 px-3 ${theme.classes.textMain}`}>{day.avgRadiation}</td>
                  <td className={`text-right py-2 px-3 ${theme.classes.textMain}`}>{day.totalPrecipitation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Past10DaysDashboard;
