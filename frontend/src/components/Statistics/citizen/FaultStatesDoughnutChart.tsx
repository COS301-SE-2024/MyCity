'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';

interface FaultStatesDoughnutChartProps {
  data: string;
}

export const FaultStates = {
  AssigningContract: {
    color: 'rgba(173, 216, 230, 0.6)', // blue
    text: 'Assigning Contract',
  },
  Closed: {
    color: 'rgba(144, 238, 144, 0.6)', // green
    text: 'Closed',
  },
  InProgress: {
    color: 'rgba(255, 255, 102, 0.6)', // yellow
    text: 'In Progress',
  },
  Opened: {
    color: 'rgba(255, 99, 132, 0.6)', // red
    text: 'Opened',
  },
  TakingTenders: {
    color: 'rgba(128, 0, 128, 0.6)', // purple
    text: 'Taking Tenders',
  },
  Default: {
    color: 'rgba(192, 192, 192, 0.6)', // gray (default for any state not mapped)
    text: 'Unknown',
  },
};

export default function FaultStatesDoughnutChart({ data }: FaultStatesDoughnutChartProps) {
  const resolvedVsUnresolved = JSON.parse(data.replace(/'/g, '"'));

  // Normalize fault state keys by removing spaces
  const normalizeState = (state: string) => state.replace(/\s+/g, '');

  // Create a function to safely get the state from FaultStates
  const getState = (state: string) => {
    const normalizedState = normalizeState(state);
    return FaultStates[normalizedState as keyof typeof FaultStates] || FaultStates.Default;
  };

  // Map fault states to their respective colors from FaultStates
  const backgroundColors = Object.keys(resolvedVsUnresolved).map((state) => getState(state).color);

  const donutChartData = {
    labels: Object.keys(resolvedVsUnresolved),
    datasets: [
      {
        label: 'Resolved vs Unresolved Tickets',
        data: Object.values(resolvedVsUnresolved),
        backgroundColor: backgroundColors,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg h-[38vh]">
      <h2 className="text-2xl font-bold mb-4 text-center">Fault States</h2>
      <div className="h-[80%]">
        <Doughnut data={donutChartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
}
