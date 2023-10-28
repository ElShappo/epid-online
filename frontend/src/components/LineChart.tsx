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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ChartsDataset = {
  data: number[];
  label?: string;
  borderColor?: string;
  backgroundColor?: string;
};

type ChartsData = {
  labels: string[] | number[];
  datasets: ChartsDataset[];
};

type Props = {
  datasets: ChartsDataset[];
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

  const data: ChartsData = {
    labels: props.xlabels,
    datasets: props.datasets
  }

  return <Line options={options} data={data as any} />;
};

export default LineChart;
