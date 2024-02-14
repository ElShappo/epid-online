import { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { ChartData } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  type: "Line" | "Bar";
  chartData: ChartData;
  title?: string; // title of the whole chart
  position?: "top" | "right" | "bottom" | "left";
};

const LineChart = (props: Props) => {
  const options = {
    scales: {
      x: {
        grid: {
          color: "#524543",
        },
        ticks: {
          color: "#dddfe1",
        },
      },
      y: {
        grid: {
          color: "#524543",
        },
        ticks: {
          color: "#dddfe1",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: props.position || "top",
        labels: {
          color: "#dddfe1",
        },
      },
      title: {
        display: !!props.title,
        text: props.title,
        color: "#dddfe1",
        font: {
          size: 17,
          family: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
          weight: 400,
        },
      },
    },
  };

  const data: ChartData = {
    labels: props.chartData.labels,
    datasets: props.chartData.datasets,
  };

  useEffect(() => {
    function beforePrintHandler() {
      for (const id in ChartJS.instances) {
        ChartJS.instances[id].resize();
      }
    }
    window.addEventListener("beforeprint", beforePrintHandler);
  }, []);

  if (props.type === "Line") {
    return <Line options={options} data={data as any} />;
  } else {
    return <Bar options={options} data={data as any} />;
  }
};

export default LineChart;
