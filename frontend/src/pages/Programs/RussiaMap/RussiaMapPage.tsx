import Plot from "react-plotly.js";
import regions from "../../../assets/filtered_regions_with_changed_names.json";
import { FormattedMorbidity, RegionPlotly, RussiaMapData } from "../../../types";
import { Layout } from "plotly.js";
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import year from "../../../store/year";
import {
  MapMode,
  defaultMaxColorValue,
  defaultMinColorValue,
  defaultNullColorValue,
  loadingRegionsMessage,
  plotlyMapModes,
  upperYearBound,
} from "../../../constants";
import {
  Button,
  Checkbox,
  CheckboxProps,
  ColorPicker,
  ColorPickerProps,
  Divider,
  Form,
  Input,
  Select,
  Spin,
  TreeSelect,
} from "antd";
import morbidityStructure from "../../../assets/morbidityStructure.json";
import formattedMorbidity from "../../../assets/formattedMorbidity.json";
import { PopulationSingleYear } from "../Population/classes/PopulationSingleYear";
import { capitalizeFirstLetter, getLinearInterpolation, getRGBComponent } from "../../../utils";
import { Store } from "react-notifications-component";
import Loader from "../../../components/Loader/Loader";
import headerHeight from "../../../store/headerHeight";
import { AbstractEpidCalculator } from "./classes/abstractEpidCalculator";
import { RussiaMapWorkerInput, RussiaMapWorkerOutput } from "./types/types";

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

const formattedPlotlyMapModes = plotlyMapModes.map((mode) => {
  return {
    value: mode,
    title: mode,
  };
});

const MyMultiPolygon = observer(() => {
  const containerRef = useRef(null);
  const [spinning, setSpinning] = useState(false);

  const [populationSingleYear, setPopulationSingleYear] = useState<PopulationSingleYear>();
  const [mapData, setMapData] = useState<RussiaMapData[]>([]);
  const [gotRegions, setGotRegions] = useState(false);

  const [characteristic, setCharacteristic] = useState<MapMode>();
  const [disease, setDisease] = useState<string>();

  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(upperYearBound);

  const [minCharacteristicValue, setMinCharacteristicValue] = useState<number>(0);
  const [maxCharacteristicValue, setMaxCharacteristicValue] = useState<number>(10);

  const [minCharacteristicColor, setMinCharacteristicColor] = useState<ColorPickerProps["value"]>(defaultMinColorValue);
  const [maxCharacteristicColor, setMaxCharacteristicColor] = useState<ColorPickerProps["value"]>(defaultMaxColorValue);
  const [nullCharacteristicColor, setNullCharacteristicColor] =
    useState<ColorPickerProps["value"]>(defaultNullColorValue);

  const [considerNullCharacteristic, setConsiderNullCharacteristic] = useState(true);

  const [displayCharacteristic, setDisplayCharacteristic] = useState<string>("");
  const [displayDisease, setDisplayDisease] = useState<string>("");

  // if that thing doesn't change, then it means that all form options (not to say about color pallete values)
  // stay the same - thus we are able to memoize the result of the previous calculation
  // and only change colors (again, without actually recalculating the characteristics)
  const stringifiedFormOptions = useMemo(() => {
    return `${characteristic} ; ${disease} ; ${minAge} ; ${maxAge}`;
  }, [characteristic, disease, maxAge, minAge]);

  const [prevStringifiedFormOptions, setPrevStringifiedFormOptions] = useState("");

  const mapTitle = useMemo(() => {
    if (displayDisease && displayCharacteristic) {
      return `<b>Карта Российской Федерации</b><br><br><i>заболевание</i>: ${displayDisease};<br><i>характеристика:</i> ${displayCharacteristic};<br><i>возрастная группа</i>: ${minAge}-${maxAge} (лет)`;
    }
    return `<b>Карта Российской Федерации</b><br><br><i>возрастная группа</i>: ${minAge}-${maxAge} (лет)`;
  }, [displayCharacteristic, displayDisease, maxAge, minAge]);

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

  const onCharacteristicChange = (newValue: MapMode) => {
    setCharacteristic(newValue);
  };

  const onDiseaseChange = (newValue: string) => {
    setDisease(newValue);
  };

  const onPopupScroll = (e: SyntheticEvent) => {
    console.log("onPopupScroll", e);
  };

  const onLegendChange: CheckboxProps["onChange"] = (e) => {
    const showLegend = e.target.checked;

    setMapData((prev) => {
      return prev.map((region) => {
        return { ...region, showlegend: showLegend };
      });
    });
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
        message: "Чтобы провести расчёт, необходимо выбрать заболевание",
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
      setSpinning(true);
      if (window.Worker) {
        console.log("workers are available");
        const worker = new Worker(new URL("./workers/worker.ts", import.meta.url), { type: "module" });

        // note that structuredClone algorithm is unable to encode a class instance correctly
        // which is used to transfer items in worker
        const workerParams: RussiaMapWorkerInput = {
          minAge,
          maxAge,
          disease,
          characteristic,
          mapData,
          stringifiedFormOptions,
          prevStringifiedFormOptions,
          considerNullCharacteristic,
          nullRgbString: nullRgbString!,
          minRgbString: minRgbString!,
          maxRgbString: maxRgbString!,
          minCharacteristicValue,
          maxCharacteristicValue,
          year: year.get(),
        };

        worker.postMessage(workerParams);

        worker.onmessage = (e: MessageEvent<RussiaMapWorkerOutput>) => {
          setMapData(e.data);
          setSpinning(false);
        };

        worker.onerror = (error) => {
          Store.addNotification({
            title: "Не удалось провести расчёт",
            message: error.message,
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
          setSpinning(false);
        };
      } else {
        const newMapData = mapData.map((region) => {
          let R: number;
          let G: number;
          let B: number;

          let value: number;

          // this if-block is used to check whether we can memoize calculations if only color pallete has changed
          if (stringifiedFormOptions !== prevStringifiedFormOptions) {
            const ageRange = `${minAge} ; ${maxAge}`;

            const absoluteMorbidity =
              (formattedMorbidity as FormattedMorbidity)[disease]?.["2022-01-01 ; 2022-12-31"]?.[region.name!]?.[
                ageRange
              ]?.[plotlyMapModes[0]] || 0;

            // current characteristic value
            value = (formattedMorbidity as FormattedMorbidity)[disease]?.["2022-01-01 ; 2022-12-31"]?.[region.name!]?.[
              ageRange
            ]?.[String(characteristic)];

            const abstractEpidCalculator = new AbstractEpidCalculator();

            if (value === null || value === undefined) {
              switch (characteristic) {
                case "интенсивная заболеваемость на 100 тысяч": {
                  const n = populationSingleYear!.n(minAge, maxAge, undefined, [region.region_code!]);
                  value = abstractEpidCalculator.getIntensiveMorbidity(absoluteMorbidity, n);
                  break;
                }
                case "стандартизованная абсолютная заболеваемость": {
                  const h = populationSingleYear!.h(minAge, maxAge);
                  value = abstractEpidCalculator.getStandardizedMorbidity([absoluteMorbidity], [h]) as number;
                  break;
                }
                case "стандартизованная интенсивная на 100 тысяч заболеваемость": {
                  const n = populationSingleYear!.n(minAge, maxAge, undefined, [region.region_code!]);
                  const h = populationSingleYear!.h(minAge, maxAge);
                  const intensiveMorbidity = abstractEpidCalculator.getIntensiveMorbidity(absoluteMorbidity, n);
                  value = abstractEpidCalculator.getStandardizedMorbidity([intensiveMorbidity], [h]) as number;
                  break;
                }
                case "контактное число": {
                  const ageStep = 1;
                  const paramStep = 0.1;

                  const n = populationSingleYear!.n(minAge, maxAge, undefined, [region.region_code!]);
                  const illFraction = absoluteMorbidity / n;
                  const lambda = abstractEpidCalculator.getLambdaEstimation(
                    illFraction,
                    minAge,
                    maxAge,
                    ageStep,
                    paramStep
                  );

                  const hArray = [];

                  for (let i = 0; i <= 100; i += ageStep) {
                    const flooredI = Math.floor(i);
                    hArray.push(populationSingleYear!.h(flooredI, flooredI, undefined, [region.region_code!]));
                  }

                  value = abstractEpidCalculator.getContactNumber(lambda, hArray, ageStep) as number;
                  break;
                }
                default: {
                  value = 0;
                }
              }
            }
            setPrevStringifiedFormOptions(stringifiedFormOptions);
          } else {
            value = region.characteristicValue!;
          }

          if (!value && considerNullCharacteristic) {
            [R, G, B] = [
              getRGBComponent(nullRgbString, "R")!,
              getRGBComponent(nullRgbString, "G")!,
              getRGBComponent(nullRgbString, "B")!,
            ];
          } else if (value <= minCharacteristicValue || value >= maxCharacteristicValue) {
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
            `<b>${region.region}</b><br>${region.federal_district}<br>Общее население: ${
              region.totalPopulation ?? "нет информации"
            } ` + `<br>${capitalizeFirstLetter(characteristic)}: ${value}`;

          setDisplayCharacteristic(characteristic);
          setDisplayDisease(disease);

          return { ...region, fillcolor: `rgba(${R}, ${G}, ${B}, 0.8)`, text: newText, characteristicValue: value };
        });
        setSpinning(false);
        setMapData(newMapData);
      }
    }
  };

  useEffect(() => {
    async function getPopulation() {
      const populationSingleYearLocal = new PopulationSingleYear(year.get());
      await populationSingleYearLocal.setRegions();

      setPopulationSingleYear(populationSingleYearLocal);

      const regionsList = populationSingleYearLocal.getRegions();

      const res: RegionPlotly[] = (regions as RegionPlotly[]).map((region) => {
        const regionCode = regionsList?.getRegionByName(region.region)?.territory_code;
        if (regionCode) {
          const totalPopulation = populationSingleYearLocal.n(0, upperYearBound, undefined, [regionCode]);
          return { ...region, totalPopulation };
        } else {
          return region;
        }
      });

      const newMapData: RussiaMapData[] = res.map((item) => {
        return {
          region_code: populationSingleYearLocal?.getRegionByName(item.region)?.territory_code,
          totalPopulation: item.totalPopulation,
          region: item.region,
          federal_district: item.federal_district,
          x: item.x,
          y: item.y,
          name: item.region,
          text: `<b>${item.region}</b><br>${item.federal_district}<br>Общее население: ${
            item.totalPopulation ?? "нет информации"
          } `,
          hoverinfo: "text",
          line: {
            color: minRgbString,
            width: 1,
          },
          fill: "toself", // specify the fill mode
          fillcolor: "rgba(255, 0, 0, 0.2)", // fill color with opacity
          type: "scatter", // trace type
          showlegend: false,
        };
      });
      setGotRegions(true);
      setMapData(newMapData);
    }
    getPopulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year.get()]);

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

  if (!gotRegions) {
    return <Loader text={loadingRegionsMessage} height={`calc(100vh - ${headerHeight.get()}px)`} />;
  }

  return (
    <>
      <Spin spinning={spinning} fullscreen />
      <Form
        className="flex flex-wrap justify-center gap-4"
        autoComplete="off"
        onFinish={() => {
          handleMapCalculation();
        }}
        onFinishFailed={() => {
          Store.addNotification({
            title: "Расчёт не был проведен",
            message: "Необходимо правильно заполнить все поля формы",
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
        }}
      >
        <section className="w-full flex flex-wrap gap-4 pt-4 justify-center">
          <Select
            size="large"
            className="min-w-72 max-w-96"
            options={formattedPlotlyMapModes}
            placeholder="Выберите характеристику"
            onChange={onCharacteristicChange}
          />
          <TreeSelect
            size="large"
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
        </section>
        <section className="px-8 pt-4 flex flex-col 2xl:w-2/5 xl:w-1/2 lg:w-2/3 md:w-5/6 w-full card">
          <Form.Item
            initialValue={minAge}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите число",
              },
              {
                validator: (_, value) => {
                  if (value >= 0 && Number.isInteger(+value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Значение должно быть неотрицательным целым числом"));
                },
              },
            ]}
            name="min-age"
            label={<span className="text-base">Начальный возраст</span>}
          >
            <Input size="large" value={minAge} onChange={(evt) => setMinAge(+evt.target.value)} />
          </Form.Item>
          <Form.Item
            initialValue={maxAge}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите число",
              },
              {
                validator: (_, value) => {
                  if (value >= 0 && Number.isInteger(+value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Значение должно быть неотрицательным целым числом"));
                },
              },
            ]}
            name="max-age"
            label={<span className="text-base">Конечный возраст</span>}
          >
            <Input size="large" value={maxAge} onChange={(evt) => setMaxAge(+evt.target.value)} />
          </Form.Item>
        </section>
        <section className="flex flex-col 2xl:w-2/5 xl:w-1/2 lg:w-2/3 md:w-5/6 w-full card">
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
        </section>
        <section className="px-8 pt-4 flex flex-col 2xl:w-2/5 xl:w-1/2 lg:w-2/3 md:w-5/6 w-full card">
          <Form.Item
            initialValue={minCharacteristicValue}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите число",
              },
              {
                validator: (_, value) => {
                  if (value >= 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Значение должно быть неотрицательным числом"));
                },
              },
            ]}
            name="min-value"
            label={<span className="text-base">Мин. значение выбранной характеристики</span>}
          >
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
              defaultValue={minCharacteristicColor}
              value={minCharacteristicColor}
              onChange={setMinCharacteristicColor}
              format="rgb"
              disabledAlpha
              showText
            />
          </Form.Item>
        </section>
        <section className="px-8 pt-4 flex flex-col 2xl:w-2/5 xl:w-1/2 lg:w-2/3 md:w-5/6 w-full card">
          <Form.Item
            initialValue={maxCharacteristicValue}
            name="max-value"
            label={<span className="text-base">Макс. значение выбранной характеристики</span>}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите число",
              },
              {
                validator: (_, value) => {
                  if (value >= 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Значение должно быть неотрицательным числом"));
                },
              },
            ]}
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
              defaultValue={maxCharacteristicColor}
              value={maxCharacteristicColor}
              onChange={setMaxCharacteristicColor}
              format="rgb"
              disabledAlpha
              showText
            />
          </Form.Item>
        </section>
        <Form.Item className="w-full text-center">
          <Button type="primary" className="bg-green-700" size="large" htmlType="submit">
            Рассчитать
          </Button>
        </Form.Item>
      </Form>
      <Divider className="my-0" />
      <article className="text-center py-4">
        <Checkbox defaultChecked={false} onChange={onLegendChange} className="text-xl">
          Легенда карты
        </Checkbox>
      </article>
      <div ref={containerRef} className="w-full text-center pb-3">
        <Plot
          data={mapData}
          layout={{ ...layout, title: mapTitle }}
          config={{
            responsive: true,
          }}
          className="w-[80%] h-[80%] min-w-[800px] min-h-[750px]"
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
