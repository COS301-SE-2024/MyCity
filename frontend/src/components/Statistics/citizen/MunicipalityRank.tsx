// components/Statistics/citizen/MunicipalityRank.tsx

import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css'; // Import styles for circular progress bar

interface MunicipalityRankProps {
  rank: number;
  stateRank: number;
  costRank: number;
  timeRank: number;
}

const MunicipalityRank: React.FC<MunicipalityRankProps> = ({
  rank,
  stateRank,
  costRank,
  timeRank,
}) => {
  const totalMunicipalities = 213;

  // Calculate percentage for each rank
  const overallRankPercent = Math.floor(((totalMunicipalities - rank) / totalMunicipalities) * 100);
  const stateRankPercent = Math.floor(((totalMunicipalities - stateRank) / totalMunicipalities) * 100);
  const costRankPercent = Math.floor(((totalMunicipalities - costRank) / totalMunicipalities) * 100);
  const timeRankPercent = Math.floor(((totalMunicipalities - timeRank) / totalMunicipalities) * 100);

  // Function to get color based on percentage
  const getColor = (percentage: number) => {
    if (percentage > 80) return 'rgba(144, 238, 144, 0.6)'; // LightGreen
    if (percentage > 60) return 'rgba(173, 216, 230, 0.6)'; // LightBlue
    if (percentage > 40) return 'rgba(255, 255, 102, 0.6)';
    if (percentage > 20) return 'rgba(255, 99, 132, 0.6)'; // LightYellow
    return 'rgba(128, 0, 128, 0.6)'; // LightRed
  };

  return (
    <div className="h-[38vh] w-1/2 flex flex-col justify-center border bg-white bg-opacity-80 overflow-hidden rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Municipality Rankings</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <h3 className="font-bold">Overall Rank:</h3>
          <h3 className="mb-2 font-bold">{Math.floor(rank)}/{totalMunicipalities}</h3>
          <CircularProgressbar
            value={overallRankPercent}
            text={`${overallRankPercent}%`}
            strokeWidth={12} // Thicker bar
            styles={buildStyles({
              pathColor: getColor(overallRankPercent),
              textColor: "#000",
              trailColor: "#d6d6d6",
            })}
            className="w-full h-[8vh]"
          />
        </div>

        <div className="flex flex-col items-center">
          <h3 className=" font-bold">Fault Progress:</h3>
          <h3 className="mb-2 font-bold">{Math.floor(stateRank)}/{totalMunicipalities}</h3>
          <CircularProgressbar
            value={stateRankPercent}
            text={`${stateRankPercent}%`}
            strokeWidth={12} // Thicker bar
            styles={buildStyles({
              pathColor: getColor(stateRankPercent),
              textColor: "#000",
              trailColor: "#d6d6d6",
            })}
            className="w-full h-[8vh]"
          />
        </div>

        <div className="flex flex-col items-center">
          <h3 className=" font-bold">Jobs on Budget:</h3>
          <h3 className="mb-2 font-bold">{Math.floor(costRank)}/{totalMunicipalities}</h3>
          <CircularProgressbar
            value={costRankPercent}
            text={`${costRankPercent}%`}
            strokeWidth={12} // Thicker bar
            styles={buildStyles({
              pathColor: getColor(costRankPercent),
              textColor: "#000",
              trailColor: "#d6d6d6",
            })}
            className="w-full h-[8vh]"
          />
        </div>

        <div className="flex flex-col items-center">
          <h3 className="font-bold">Jobs on Time:</h3>
          <h3 className="mb-2 font-bold">{Math.floor(timeRank)}/{totalMunicipalities}</h3>
          <CircularProgressbar
            value={timeRankPercent}
            text={`${timeRankPercent}%`}
            strokeWidth={12} // Thicker bar
            styles={buildStyles({
              pathColor: getColor(timeRankPercent),
              textColor: "#000",
              trailColor: "#d6d6d6",
            })}
            className="w-full h-[8vh]"
          />
        </div>
      </div>
    </div>
  );
};

export default MunicipalityRank;
