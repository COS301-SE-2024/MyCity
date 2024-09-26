import React from "react";
import { Pie } from "react-chartjs-2";

interface InhouseVsExternalProps {
  inhouse: number;
  external: number;
}

const InhouseVsExternalPieChart: React.FC<InhouseVsExternalProps> = ({ inhouse, external }) => {
  const data = {
    labels: ["In-house", "External"],
    datasets: [
      {
        label: "In-house vs External Contractors",
        data: [inhouse, external],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg w-full h-[38vh]">
      <h2 className="text-white text-xl">In-house vs External Contractors</h2>
      <Pie data={data} />
    </div>
  );
};

export default InhouseVsExternalPieChart;
