import Plot from "react-plotly.js";
import { PopulationSingleYear } from "../../utils";
import regions from "../../assets/filtered_regions_with_changed_names.json";
import { RegionPlotly } from "../../types";
import { Data, Layout } from "plotly.js";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import year from "../../store/year";
import { upperYearBound } from "../../constants";
import { Spin, notification } from "antd";

const MyMultiPolygon = observer(() => {
  const containerRef = useRef(null);
  const [regionsWithPopulation, setRegionsWithPopulation] = useState<RegionPlotly[]>([]);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    async function getPopulation() {
      api.info({
        message: (
          <div className="flex items-center gap-4">
            Загружаю карту
            <Spin />
          </div>
        ),
      });

      const populationSingleYear = new PopulationSingleYear(year.get());
      await populationSingleYear.setRegions();

      const regionsList = populationSingleYear.getRegions();

      const res: RegionPlotly[] = (regions as RegionPlotly[]).map((region) => {
        const regionCode = regionsList?.getRegionByName(region.region)?.territory_code;
        if (regionCode) {
          const population = populationSingleYear.n(0, upperYearBound, undefined, [regionCode]);
          return { ...region, population };
        } else {
          return region;
        }
      });
      api.destroy();
      setRegionsWithPopulation(res);
    }
    getPopulation();
  }, [year.get(), api]);

  const data: Data[] = (regionsWithPopulation as RegionPlotly[]).map((item) => {
    return {
      x: item.x,
      y: item.y,
      name: item.region,
      text: `<b>${item.region}</b><br>${item.federal_district}<br>Население: ${item.population ?? "нет информации"} `,
      hoverinfo: "text",
      line_color: "grey",
      fill: "toself", // specify the fill mode
      line_width: 1,
      fillcolor: "rgba(255, 0, 0, 0.2)", // fill color with opacity
      type: "scatter", // trace type
      showlegend: false,
    };
  });

  useEffect(() => {});

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
    <>
      {contextHolder}
      <div ref={containerRef} className="w-full text-center pt-6 pb-3">
        <Plot
          data={data}
          layout={layout}
          config={{
            responsive: true,
          }}
          className="w-[80%] h-[80%] min-w-[800px] min-h-[560px]"
          useResizeHandler={true}
          onHover={(data) => {
            console.log(data);
            console.log(data.points[0].data);
            // popupRef.current.innerHTML = "Hello there";
          }}
        />
      </div>
    </>
  );
});

export default MyMultiPolygon;
