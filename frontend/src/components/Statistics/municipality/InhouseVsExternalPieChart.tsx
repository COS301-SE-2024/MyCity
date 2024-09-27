import React from "react";
import { Pie } from "react-chartjs-2";
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels'; // Import the Context type for datalabels
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem, // Import TooltipItem type
  ChartData,
} from "chart.js";

// Register Chart.js components and plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface InhouseVsExternalPieChartProps {
  inhouse: number; // Type inhouse as a number
  external: number; // Type external as a number
}

const InhouseVsExternalPieChart: React.FC<InhouseVsExternalPieChartProps> = ({ inhouse, external }) => {
  // Create the data structure for the Pie chart
  const data: ChartData<'pie'> = {
    labels: ["In-house", "External"],  // Labels for the pie slices
    datasets: [
      {
        data: [inhouse, external],  // Values for each slice
        backgroundColor: ["rgba(173, 216, 230, 0.6)", "rgba(255, 99, 132, 0.6)"],  // Colors for the slices
        hoverBackgroundColor: ["rgba(173, 216, 230, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  // Options for displaying the percentage on the pie chart
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'pie'>) => {
            const value = tooltipItem.raw as number; // Explicitly cast raw value to number
            const total = (tooltipItem.dataset.data as number[]).reduce((sum, val) => sum + val, 0); // Calculate total
            const percentage = ((value / total) * 100).toFixed(2) + "%";
            return `${tooltipItem.label}: ${percentage}`;
          },
        },
      },
      datalabels: {
        formatter: (value: number, context: Context) => {
          const total = (context.dataset.data as number[]).reduce((sum, val) => sum + val, 0); // Calculate total
          const percentage = ((value / total) * 100).toFixed(0);
          return percentage + "%";
        },
        font: {
          size: 32,
        },
      },
    },
  };

  return (
    <div className="bg-white bg-opacity-80 rounded-lg p-4 shadow-lg h-[38vh]">
      <h2 className="text-2xl font-bold mb-4 text-center">
        In-house vs External Contracts
      </h2>
      <div className="flex h-[70%] justify-center w-full">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default InhouseVsExternalPieChart;
