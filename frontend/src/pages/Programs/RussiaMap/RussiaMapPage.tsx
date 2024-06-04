import Plot from "react-plotly.js";
import regions from "../../../assets/filtered_regions_with_changed_names.json";
import { RegionPlotly } from "../../../types";
import { Data, Layout } from "plotly.js";
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import year from "../../../store/year";
import { defaultMaxColorValue, defaultMinColorValue, upperYearBound } from "../../../constants";
import { ColorPicker, ColorPickerProps, Divider, Form, Input, Select, Spin, TreeSelect, notification } from "antd";
import { plotlyMapModes } from "../../../constants";
import morbidityStructure from "../../../assets/morbidityStructure.json";
import { PopulationSingleYear } from "../Population/classes/PopulationSingleYear";

const MyMultiPolygon = observer(() => {
  const containerRef = useRef(null);
  const [disease, setDisease] = useState<string>();
  const [regionsWithPopulation, setRegionsWithPopulation] = useState<RegionPlotly[]>([]);
  const [api, contextHolder] = notification.useNotification();

  const [minCharacteristicValue, setMinCharacteristicValue] = useState<number>(0);
  const [maxCharacteristicValue, setMaxCharacteristicValue] = useState<number>(0);

  const [minCharacteristicColor, setMinCharacteristicColor] = useState<ColorPickerProps["value"]>(defaultMinColorValue);
  const [maxCharacteristicColor, setMaxCharacteristicColor] = useState<ColorPickerProps["value"]>(defaultMaxColorValue);

  const minRgbString = useMemo(
    () => (typeof minCharacteristicColor === "string" ? minCharacteristicColor : minCharacteristicColor?.toRgbString()),
    [minCharacteristicColor]
  );

  const maxRgbString = useMemo(
    () => (typeof maxCharacteristicColor === "string" ? maxCharacteristicColor : maxCharacteristicColor?.toRgbString()),
    [maxCharacteristicColor]
  );

  const formattedPlotlyMapModes = useMemo(() => {
    return plotlyMapModes.map((mode) => {
      return {
        value: mode,
        title: mode,
      };
    });
  }, []);

  const onChange = (newValue: string) => {
    setDisease(newValue);
  };

  const onPopupScroll = (e: SyntheticEvent) => {
    console.log("onPopupScroll", e);
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <section className="flex flex-wrap justify-center gap-4">
        <article className="w-full flex flex-wrap gap-4 pt-4 justify-center">
          <Select
            className="min-w-72 max-w-96"
            options={formattedPlotlyMapModes}
            placeholder="Выберите характеристику"
          />
          <TreeSelect
            className="min-w-72 max-w-96"
            showSearch
            value={disease}
            dropdownStyle={{ overflow: "auto" }}
            placeholder="Выберите заболевание"
            allowClear
            treeDefaultExpandAll
            onChange={onChange}
            treeData={morbidityStructure}
            onPopupScroll={onPopupScroll}
          />
        </article>
        <Form className="px-8 pt-4 flex flex-col 2xl:w-2/5 xl:w-1/2 lg:w-2/3 md:w-5/6 w-full card">
          <Form.Item name="min-value" label={<span className="text-base">Мин. значение выбранной характеристики</span>}>
            <Input
              size="large"
              value={minCharacteristicValue}
              onChange={(evt) => setMinCharacteristicValue(+evt.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="min-color"
            label={<span className="text-base">Цветовая палитра, отвечающая мин. значению</span>}
          >
            <ColorPicker
              value={minCharacteristicColor}
              onChange={setMinCharacteristicColor}
              format="rgb"
              disabledAlpha
              showText
            />
          </Form.Item>
        </Form>
        <Form className="px-8 pt-4 flex flex-col 2xl:w-2/5 xl:w-1/2 lg:w-2/3 md:w-5/6 w-full card">
          <Form.Item
            name="max-value"
            label={<span className="text-base">Макс. значение выбранной характеристики</span>}
          >
            <Input
              size="large"
              value={maxCharacteristicValue}
              onChange={(evt) => setMaxCharacteristicValue(+evt.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="max-color"
            label={<span className="text-base">Цветовая палитра, отвечающая макс. значению</span>}
          >
            <ColorPicker
              value={maxCharacteristicColor}
              onChange={setMaxCharacteristicColor}
              format="rgb"
              disabledAlpha
              showText
            />
          </Form.Item>
        </Form>
      </section>
      <Divider className="mt-5" />
      <div ref={containerRef} className="w-full text-center pb-3">
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
          }}
        />
      </div>
    </>
  );
});

export default MyMultiPolygon;
