import Plot from "react-plotly.js";
import regions from "../../../assets/filtered_regions_with_changed_names.json";
import { FormattedMorbidity, RegionPlotly, RussiaMapData } from "../../../types";
import { Layout } from "plotly.js";
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import year from "../../../store/year";
import {
  defaultMaxColorValue,
  defaultMinColorValue,
  defaultNullColorValue,
  plotlyMapModes,
  upperYearBound,
} from "../../../constants";
import {
  Button,
  ColorPicker,
  ColorPickerProps,
  Divider,
  Form,
  Input,
  Select,
  Spin,
  TreeSelect,
  notification,
} from "antd";
import morbidityStructure from "../../../assets/morbidityStructure.json";
import formattedMorbidity from "../../../assets/formattedMorbidity.json";
import { PopulationSingleYear } from "../Population/classes/PopulationSingleYear";
import { capitalizeFirstLetter, getLinearInterpolation, getRGBComponent } from "../../../utils";
import { Store } from "react-notifications-component";

const MyMultiPolygon = observer(() => {
  const containerRef = useRef(null);
  const [api, contextHolder] = notification.useNotification();
  const [mapData, setMapData] = useState<RussiaMapData[]>([]);

  const [characteristic, setCharacteristic] = useState<string>();
  const [disease, setDisease] = useState<string>();

  const [minCharacteristicValue, setMinCharacteristicValue] = useState<number>(0);
  const [maxCharacteristicValue, setMaxCharacteristicValue] = useState<number>(10);

  const [minCharacteristicColor, setMinCharacteristicColor] = useState<ColorPickerProps["value"]>(defaultMinColorValue);
  const [maxCharacteristicColor, setMaxCharacteristicColor] = useState<ColorPickerProps["value"]>(defaultMaxColorValue);
  const [nullCharacteristicColor, setNullCharacteristicColor] =
    useState<ColorPickerProps["value"]>(defaultNullColorValue);

  const [considerNullCharacteristic, setConsiderNullCharacteristic] = useState(false);

  const nullCharacteristicStatus = useMemo(() => {
    return considerNullCharacteristic ? "активирован" : "не активирован";
  }, [considerNullCharacteristic]);

  const minRgbString = useMemo(
    () => (typeof minCharacteristicColor === "string" ? minCharacteristicColor : minCharacteristicColor?.toRgbString()),
    [minCharacteristicColor]
  );

  const maxRgbString = useMemo(
    () => (typeof maxCharacteristicColor === "string" ? maxCharacteristicColor : maxCharacteristicColor?.toRgbString()),
    [maxCharacteristicColor]
  );

  const nullRgbString = useMemo(
    () =>
      typeof nullCharacteristicColor === "string" ? nullCharacteristicColor : nullCharacteristicColor?.toRgbString(),
    [nullCharacteristicColor]
  );

  const formattedPlotlyMapModes = useMemo(() => {
    return plotlyMapModes.map((mode) => {
      return {
        value: mode,
        title: mode,
      };
    });
  }, []);

  const onCharacteristicChange = (newValue: string) => {
    setCharacteristic(newValue);
  };

  const onDiseaseChange = (newValue: string) => {
    console.log(newValue);
    setDisease(newValue);
  };

  const onPopupScroll = (e: SyntheticEvent) => {
    console.log("onPopupScroll", e);
  };

  const handleMapCalculation = () => {
    if (!characteristic) {
      Store.addNotification({
        title: "Расчёт не был проведен",
        message: "Чтобы провести расчёт, необходимо выбрать характеристику",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    } else if (!disease) {
      Store.addNotification({
        title: "Расчёт не был проведен",
        message: "Чтобы провести расчёт, необходимо заболевание",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    } else {
      setMapData((prev) => {
        return prev.map((region) => {
          let R: number;
          let G: number;
          let B: number;

          // current characteristic value
          const value =
            (formattedMorbidity as FormattedMorbidity)[String(disease)]?.["2022-01-01 ; 2022-12-31"]?.[region.name!]?.[
              "0 ; 199"
            ]?.[String(characteristic)] || 0;

          // console.log(value);

          if (!value && considerNullCharacteristic) {
            [R, G, B] = [
              getRGBComponent(nullRgbString, "R")!,
              getRGBComponent(nullRgbString, "G")!,
              getRGBComponent(nullRgbString, "B")!,
            ];
          } else if (value <= minCharacteristicValue || value >= maxCharacteristicValue) {
            console.log(region.name);
            console.log("yep, that is right");
            if (value <= minCharacteristicValue) {
              [R, G, B] = [
                getRGBComponent(minRgbString, "R")!,
                getRGBComponent(minRgbString, "G")!,
                getRGBComponent(minRgbString, "B")!,
              ];
            } else {
              [R, G, B] = [
                getRGBComponent(maxRgbString, "R")!,
                getRGBComponent(maxRgbString, "G")!,
                getRGBComponent(maxRgbString, "B")!,
              ];
            }
          } else {
            const [minR, minG, minB] = [
              getRGBComponent(minRgbString, "R")!,
              getRGBComponent(minRgbString, "G")!,
              getRGBComponent(minRgbString, "B")!,
            ];

            const [maxR, maxG, maxB] = [
              getRGBComponent(maxRgbString, "R")!,
              getRGBComponent(maxRgbString, "G")!,
              getRGBComponent(maxRgbString, "B")!,
            ];

            R = getLinearInterpolation(value, minCharacteristicValue, +minR, maxCharacteristicValue, maxR);
            G = getLinearInterpolation(value, minCharacteristicValue, +minG, maxCharacteristicValue, maxG);
            B = getLinearInterpolation(value, minCharacteristicValue, +minB, maxCharacteristicValue, maxB);
          }

          const newText =
            `<b>${region.region}</b><br>${region.federal_district}<br>Население: ${
              region.population ?? "нет информации"
            } ` + `<br>${capitalizeFirstLetter(characteristic)}: ${value}`;

          return { ...region, fillcolor: `rgba(${R}, ${G}, ${B}, 0.8)`, text: newText };
        });
      });
    }
  };

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
      setMapData(
        res.map((item) => {
          return {
            population: item.population,
            region: item.region,
            federal_district: item.federal_district,
            x: item.x,
            y: item.y,
            name: item.region,
            text: `<b>${item.region}</b><br>${item.federal_district}<br>Население: ${
              item.population ?? "нет информации"
            } `,
            hoverinfo: "text",
            line: {
              color: "grey",
              width: 1,
            },
            fill: "toself", // specify the fill mode
            fillcolor: "rgba(255, 0, 0, 0.2)", // fill color with opacity
            type: "scatter", // trace type
            showlegend: false,
          };
        })
      );
    }
    getPopulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year.get(), api]);

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

  return (
    <>
      {contextHolder}
      <section className="flex flex-wrap justify-center gap-4">
        <article className="w-full flex flex-wrap gap-4 pt-4 justify-center">
          <Select
            className="min-w-72 max-w-96"
            options={formattedPlotlyMapModes}
            placeholder="Выберите характеристику"
            onChange={onCharacteristicChange}
          />
          <TreeSelect
            className="min-w-72 max-w-96"
            showSearch
            value={disease}
            dropdownStyle={{ overflow: "auto" }}
            placeholder="Выберите заболевание"
            allowClear
            treeDefaultExpandAll
            onChange={onDiseaseChange}
            treeData={morbidityStructure}
            onPopupScroll={onPopupScroll}
          />
        </article>
        <Form className="px-8 pt-4 flex flex-col 2xl:w-2/5 xl:w-1/2 lg:w-2/3 md:w-5/6 w-full card">
          <Form.Item name="min-value" label={<span className="text-base">Мин. значение выбранной характеристики</span>}>
            <Input
              defaultValue={minCharacteristicValue}
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
              defaultValue={minCharacteristicColor}
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
              defaultValue={maxCharacteristicValue}
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
              defaultValue={maxCharacteristicColor}
              value={maxCharacteristicColor}
              onChange={setMaxCharacteristicColor}
              format="rgb"
              disabledAlpha
              showText
            />
          </Form.Item>
        </Form>
        <Form className="flex flex-col 2xl:w-2/5 xl:w-1/2 lg:w-2/3 md:w-5/6 w-full card">
          <div className="flex p-5">
            <div className="text-base">
              Статус:{" "}
              <span className={considerNullCharacteristic ? "text-green-600" : "text-gray-500"}>
                {nullCharacteristicStatus}
              </span>
            </div>
            <div className="flex-grow flex justify-end">
              <Button type="primary" onClick={() => setConsiderNullCharacteristic((prev) => !prev)}>
                Активировать
              </Button>
            </div>
          </div>
          <Form.Item
            className="flex justify-center"
            name="null-color"
            label={<span className="text-base">Цветовая палитра, отвечающая нулевому значению</span>}
          >
            <ColorPicker
              defaultValue={nullCharacteristicColor}
              value={nullCharacteristicColor}
              onChange={setNullCharacteristicColor}
              format="rgb"
              disabledAlpha
              showText
            />
          </Form.Item>
        </Form>
        <div className="w-full text-center">
          <Button type="primary" className="bg-green-700" size="large" onClick={handleMapCalculation}>
            Рассчитать
          </Button>
        </div>
      </section>
      <Divider className="mt-4" />
      <div ref={containerRef} className="w-full text-center pb-3">
        <Plot
          data={mapData}
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
