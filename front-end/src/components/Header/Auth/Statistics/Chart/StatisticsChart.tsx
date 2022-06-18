import React from "react";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";

import classes from "./StatisticsChart.module.css";

Chart.register(...registerables);

const StatisticsChart: React.FC<{
  stats: {
    created_list: string[];
    trials_list: number[];
    spatial_list: number[];
    auditory_list: number[];
    total_list: number[];
  };
}> = (props) => {
  let color = "#adbac7";

  if (
    localStorage.getItem("light") &&
    Boolean(Number(localStorage.getItem("light")))
  )
    color = "#22272e";

  return (
    <div className={classes["chart-container"]}>
      <Line
        data={{
          labels: props.stats.created_list,
          datasets: [
            {
              label: "Spatial",
              data: props.stats.spatial_list,
              backgroundColor: ["rgba(215, 165, 0, 0.5)"],
              borderColor: ["rgba(215, 165, 0, 1)"],
              borderWidth: 1,
            },
            {
              label: "Auditory",
              data: props.stats.auditory_list,
              backgroundColor: ["rgba(83, 155, 245, 0.5)"],
              borderColor: ["rgba(83, 155, 245, 1)"],
              borderWidth: 1,
            },
            {
              label: "Total",
              data: props.stats.total_list,
              backgroundColor: ["rgba(220, 20, 60, 0.5)"],
              borderColor: ["rgba(220, 20, 60, 1)"],
              borderWidth: 1,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              labels: {
                color: color,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: color,
              },
            },
            x: {
              ticks: {
                color: color,
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default StatisticsChart;
