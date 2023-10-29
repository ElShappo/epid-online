import React, { useEffect } from "react";
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
  datasets: ChartDataset[]; // holds data and legend
  xlabels: string[] | number[];
  title?: string; // title of the whole chart
  position?: "top" | "right" | "bottom" | "left";
};

const LineChart = (props: Props) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
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

  useEffect(() => {
    function beforePrintHandler () {
      for (let id in ChartJS.instances) {
          ChartJS.instances[id].resize();
      }
    }
    window.addEventListener('beforeprint', beforePrintHandler);
  }, []);

  return <Line options={options} data={data as any} />;
};

export default LineChart;
