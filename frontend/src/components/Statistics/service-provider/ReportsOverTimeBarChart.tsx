'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import { format, subMonths } from 'date-fns';

interface ReportsOverTimeLineChartProps {
  data: string;
}

// Define the correct order of the months
const monthOrder = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getLastSixMonths() {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    months.push(format(date, 'MMMM'));
  }
  return months;
}

export default function ReportsOverTimeLineChart({ data }: ReportsOverTimeLineChartProps) {
  const reportsOverTime = JSON.parse(data.replace(/'/g, '"'));

  // Get the last 6 months
  const lastSixMonths = getLastSixMonths();

  // Populate data for the last six months or fill with 0 if missing
  const reportsData = lastSixMonths.map((month) => reportsOverTime[month] || 0);

  const lineChartData = {
    labels: lastSixMonths, // Display last 6 months dynamically
    datasets: [
      {
        label: 'Total Reports Over Time',
        data: reportsData, // Use reportsData which contains values or zero for each month
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white bg-opacity-90  rounded-lg p-4 shadow-lg h-[38vh]">
      <h2 className="text-2xl font-bold mb-4 text-center">Total Reports Over Time</h2>
      <div className="h-[80%]">
        <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
}
