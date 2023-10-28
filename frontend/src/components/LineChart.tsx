import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartDataset } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  datasets: ChartDataset[];
  xlabels: string[] | number[];
  title?: string;
  position?: "top" | "right" | "bottom" | "left";
};

const LineChart = (props: Props) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: props.position || "top",
      },
      title: {
        display: !!props.title,
        text: props.title,
      },
    },
  };

  const data: ChartData = {
    labels: props.xlabels,
    datasets: props.datasets
  }

  return <Line options={options} data={data as any} />;
};

export default LineChart;
