import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { YearlyStats } from '../services/homepageContentService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarGraphProps {
  stats: Record<string, YearlyStats>;
  title: string;
  metric: keyof YearlyStats;
  backgroundColor: string;
  borderColor: string;
}

const BarGraph: React.FC<BarGraphProps> = ({ 
  stats, 
  title, 
  metric, 
  backgroundColor, 
  borderColor 
}) => {
  const years = Object.keys(stats).sort();
  const dataValues = years.map(year => stats[year][metric]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: metric.charAt(0).toUpperCase() + metric.slice(1),
        },
      },
      x: {
        title: {
          display: true,
          text: 'Year',
        },
      },
    },
  };

  const data = {
    labels: years,
    datasets: [
      {
        label: metric.charAt(0).toUpperCase() + metric.slice(1),
        data: dataValues,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Bar options={options} data={data} />
    </div>
  );
};

export default BarGraph;
