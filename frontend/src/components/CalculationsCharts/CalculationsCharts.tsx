import Plot from "react-plotly.js";
import { PopulationSingleYear } from "../../utils";
import regions from "../../assets/filtered_regions.json";
import { RegionPlotly } from "../../types";
import { Data, Layout } from "plotly.js";
import { useEffect, useRef } from "react";

const MyMultiPolygon = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current as null | HTMLElement;

    function adjustSize() {
      if (container) {
        const containerWidth = container.offsetWidth;
        const desiredAspectRatio = 16 / 9; // Set your desired aspect ratio here
        const containerHeight = containerWidth / desiredAspectRatio;
        container.style.height = `${containerHeight}px`;
      }
    }

    adjustSize();
    window.addEventListener("resize", adjustSize);
  }, []);

  const data: Data[] = (regions as RegionPlotly[]).map((item) => {
    return {
      x: item.x,
      y: item.y,
      name: item.region,
      text: `<b>${item.region}</b><br>${item.federal_district}<br>Население: some`,
      hoverinfo: "text",
      line_color: "grey",
      fill: "toself", // specify the fill mode
      line_width: 1,
      fillcolor: "rgba(255, 0, 0, 0.2)", // fill color with opacity
      type: "scatter", // trace type
      showlegend: false,
    };
  });

  const layout = {
    title: "Карта Российской Федерации",
    autosize: true,
    xaxis: {
      visible: false,
    },
    yaxis: {
      visible: false,
      scaleanchor: "x",
      scaleratio: 1,
    },
    margin: {
      l: 10,
      r: 10,
      b: 10,
      t: 50,
      pad: 10,
    },
    legend: {
      font: {
        size: 8,
      },
    },
  } as Layout;

  return (
    <div ref={containerRef} className="w-full text-center pt-6 pb-3">
      <Plot
        data={data}
        layout={layout}
        config={{
          responsive: true,
        }}
        className="w-[80%] h-[80%] min-w-[800px] min-h-[560px]"
        useResizeHandler={true}
      />
    </div>
  );
};

export default MyMultiPolygon;
