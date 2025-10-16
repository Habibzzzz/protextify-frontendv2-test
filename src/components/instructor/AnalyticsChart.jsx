// src/components/instructor/AnalyticsChart.jsx

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui";
import { BarChart3 } from "lucide-react";

/**
 * Komponen AnalyticsChart
 * Menampilkan grafik analitik (Bar, Line, Area) berdasarkan data yang diberikan.
 *
 * Props:
 * - data: Array data yang akan divisualisasikan.
 * - title: Judul chart yang ditampilkan di atas.
 * - type: Jenis chart ('bar', 'line', 'area'). Default 'bar'.
 * - xAxisKey: Key untuk sumbu X. Default 'name'.
 * - dataKey: Key data utama untuk chart (bar/area).
 * - dataKeys: Array key data untuk chart multi-line.
 * - colors: Array warna untuk elemen chart.
 */
const AnalyticsChart = ({
  data,
  title,
  type = "bar",
  xAxisKey = "name", // Default ke 'name', bisa di-override
  dataKey, // 'submissions', 'count', 'avgHours'
  dataKeys, // Untuk chart multi-line: ['submissions', 'graded']
  colors = ["#3b82f6", "#16a34a", "#8b5cf6"],
}) => {
  /**
   * Fungsi renderChart
   * Menentukan jenis chart yang akan dirender berdasarkan props 'type'.
   * - BarChart: Untuk data tunggal.
   * - LineChart: Untuk data multi-line.
   * - AreaChart: Untuk data area.
   */
  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill={colors[0]} />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
              />
            ))}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      default:
        return null;
    }
  };

  /**
   * Render utama komponen
   * Menampilkan Card berisi chart atau pesan jika data kosong.
   */
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Belum ada data untuk ditampilkan.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
