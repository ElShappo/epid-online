import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button, Checkbox, GetProp, List, message, Modal, Spin, Table, TreeSelect, Upload } from "antd";
import { PopulationSingleYear } from "../../utils";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PageviewIcon from "@mui/icons-material/Pageview";
import { observer } from "mobx-react-lite";
import year from "../../store/year";
import TextArea, { TextAreaRef } from "antd/es/input/TextArea";
import {
  calculatedNoSexRecognitionTableColumns,
  calculatedSexRecognitionTableColumns,
  textAreaTitlesAgeEndChecked,
  textAreaTitlesAllChecked,
  textAreaTitlesAllUnchecked,
  textAreaTitlesSexRecognitionChecked,
  upperYearBound,
} from "../../constants";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { EpidCalculator, extractDataForPlotting } from "./classes/epidCalculator";
import { CalculatedTableRow, CalculationCategoriesType, Sex, TextAreaContentMeta, TextAreaTitle } from "../../types";
import { Store } from "react-notifications-component";
import Plot from "react-plotly.js";
import { Data } from "plotly.js";
import ModelEstimationTable from "./ModelEstimationTable";
import { InputMode, InputOption } from "./localTypes";
import { inputOptions } from "./localConstants";
const { SHOW_PARENT } = TreeSelect;

const checkboxOptions = [
  { label: "Деление по полу", value: "sexRecognition" },
  { label: "Указывать оба диапазона лет", value: "ageEnd" },
] as Array<{
  label: string;
  value: InputOption;
}>;

const CalculationsTable = observer(() => {
  const headerHeight = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(headerHeight);

  const [inputMode, setInputMode] = useState<InputMode>();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onCheckboxChange: GetProp<typeof Checkbox.Group, "onChange"> = (checkedValues) => {
    console.log("checked = ", checkedValues);
    const newInputMode = {} as Partial<InputMode>;

    for (const key of inputOptions) {
      newInputMode[key] = false;
    }
    for (const key of checkedValues as InputOption[]) {
      newInputMode[key] = true;
    }
    setCheckedOptions(checkedValues);
    setInputMode(newInputMode as InputMode);
  };

  const [checkedOptions, setCheckedOptions] = useState<CheckboxValueType[]>([]);

  const [populationPerRegions, setPopulationPerRegions] = useState<PopulationSingleYear>();

  const [gotRegions, setGotRegions] = useState<boolean>(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>();

  const [calculatedTableRows, setCalculatedTableRows] = useState<CalculatedTableRow[]>([]);

  const [spinning, setSpinning] = useState<boolean>(false);
  const [RussiaMorbidity, setRussiaMorbidity] = useState<number>();
  const [chosenRegionsMorbidity, setChosenRegionsMorbidity] = useState<number>();

  const [RussiaIntensiveMorbidity, setRussiaIntensiveMorbidity] = useState<number>();
  const [chosenRegionsIntensiveMorbidity, setChosenRegionsIntensiveMorbidity] = useState<number>();

  const [chosenRegionsStandardizedMorbidity, setChosenRegionsStandardizedMorbidity] = useState<number>();
  const [chosenRegionsStandardizedIntensiveMorbidity, setChosenRegionsStandardizedIntensiveMorbidity] =
    useState<number>();

  const [lambdaEstimation, setLambdaEstimation] = useState<CalculationCategoriesType>();
  const [cEstimation, setCEstimation] = useState<CalculationCategoriesType>();
  const [contactNumberEstimation, setContactNumberEstimation] = useState<CalculationCategoriesType>();
  const [absoluteErrorEstimation, setAbsoluteErrorEstimation] = useState<CalculationCategoriesType>();

  const textAreaRefs = useRef<Map<TextAreaTitle, TextAreaRef> | null>(null);

  function getTextAreaMap() {
    if (!textAreaRefs.current) {
      textAreaRefs.current = new Map();
    }
    return textAreaRefs.current;
  }

  const uploadProps: UploadProps = {
    accept: ".csv",
    maxCount: 1,
    showUploadList: false,
    async beforeUpload(file) {
      try {
        console.log(file);
        const text = await file.text();

        const rows = text.split("\n");
        let titles: TextAreaTitle[] = [];

        if (hasSexRecognition && hasAgeEnd) {
          titles = [
            "Начальный возраст",
            "Конечный возраст",
            "Число заболевших (мужчины, Россия)",
            "Число заболевших (женщины, Россия)",
            "Число заболевших (мужчины, выбран. регионы)",
            "Число заболевших (женщины, выбран. регионы)",
          ];
        } else if (hasSexRecognition && !hasAgeEnd) {
          titles = [
            "Начальный возраст",
            "Число заболевших (мужчины, Россия)",
            "Число заболевших (женщины, Россия)",
            "Число заболевших (мужчины, выбран. регионы)",
            "Число заболевших (женщины, выбран. регионы)",
          ];
        } else if (!hasSexRecognition && hasAgeEnd) {
          titles = [
            "Начальный возраст",
            "Конечный возраст",
            "Число заболевших (Россия)",
            "Число заболевших (выбран. регионы)",
          ];
        } else {
          titles = ["Начальный возраст", "Число заболевших (Россия)", "Число заболевших (выбран. регионы)"];
        }

        const map = getTextAreaMap();

        for (let i = 0; i < titles.length; ++i) {
          const title = titles[i];
          const dataForTextarea = [];

          for (const row of rows) {
            const splittedRow = row.split(";");
            dataForTextarea.push(splittedRow[i]);
          }
          const textAreaRef = map.get(title);
          textAreaRef!.resizableTextArea!.textArea!.value = dataForTextarea.join("\n");
        }

        console.log(text);
        message.success(`${file.name} был успешно загружен!`);
        return false;
      } catch (error) {
        console.error(error);
        message.error(`во время загрузки файла произошла ошибка...`);
      }
    },
  };

  const treeData = useMemo(() => {
    const onChange = (newValue: string[]) => {
      console.log("Old value: ", selectedRegions);
      console.log("New value: ", newValue);
      setSelectedRegions(newValue);
    };
    return {
      treeData: [populationPerRegions?.getRegions()?.getAntDesignTreeSelectFormat()],
      value: selectedRegions,
      onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      placeholder: "Выберите регионы",
    };
  }, [populationPerRegions, selectedRegions]);

  useEffect(() => {
    async function init() {
      console.log(`useEffect triggered with year = ${year.get()}`);
      const populationSingleYear = new PopulationSingleYear(year.get());
      try {
        await populationSingleYear.setRegions();
        setPopulationPerRegions(populationSingleYear);
        setGotRegions(true);
      } catch (error) {
        console.error("could not load regions");
        console.error(error);
      }
    }
    init();
    return () => {
      setGotRegions(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year.get()]);

  const textAreaTitles = useMemo(() => {
    switch (checkedOptions.length) {
      case 0:
        return textAreaTitlesAllUnchecked;
      case 1:
        if (checkedOptions.includes("Деление по полу")) {
          return textAreaTitlesSexRecognitionChecked;
        } else {
          return textAreaTitlesAgeEndChecked;
        }
      case 2:
        return textAreaTitlesAllChecked;
      default:
        console.error("not implemented");
    }
  }, [checkedOptions]);

  if (gotRegions) {
    return (
      <div className="flex flex-wrap justify-center gap-y-4">
        <Spin spinning={spinning} fullscreen />
        <Checkbox.Group options={checkboxOptions} onChange={onCheckboxChange} className="w-full justify-center" />
        <div className="max-h-36 overflow-y-auto">
          <TreeSelect {...(treeData as any)} className="min-w-72 max-w-96" />
          <Upload {...uploadProps} className="flex items-stretch justify-center pt-8">
            <Button icon={<UploadOutlined />} type="primary">
              Импорт CSV
            </Button>
          </Upload>
        </div>
        <section className="w-full grow flex flex-wrap justify-center gap-4">
          {textAreaTitles?.map((title) => {
            return (
              <div key={title}>
                <p className="text-center pb-2">{title}</p>
                <TextArea
                  rows={10}
                  ref={(node) => {
                    const map = getTextAreaMap();
                    if (node) {
                      map.set(title, node);
                    } else {
                      map.delete(title);
                    }
                  }}
                  name={title}
                  onInput={() => {
                    console.log(textAreaRefs.current);
                  }}
                  placeholder={`Введите ${title.toLowerCase()}:`}
                />
              </div>
            );
          })}
        </section>
        <section className="flex w-full justify-center gap-4">
          <Button type="primary" className="bg-gray-500 flex gap-1 justify-center p-5 items-center" onClick={showModal}>
            Превью
            <PageviewIcon />
          </Button>
          <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered>
            {/* <Table columns={columns} dataSource={data} /> */}
          </Modal>
          <Button
            type="primary"
            className="flex gap-1 justify-center p-5 items-center"
            onClick={() => {
              setSpinning(true);
              const textAreaMap = getTextAreaMap();
              const newTextAreaMap: Map<TextAreaTitle, TextAreaContentMeta> = new Map();

              for (const key of textAreaMap.keys()) {
                newTextAreaMap.set(key, {
                  content: textAreaMap.get(key)!.resizableTextArea!.textArea.value,
                  allowOnlyIntegers: true,
                  delimSymbol: "\n",
                  upperBound: key === "Начальный возраст" || key === "Конечный возраст" ? upperYearBound : null,
                });
              }

              if (selectedRegions && selectedRegions.length) {
                try {
                  const epidCalculator = new EpidCalculator(newTextAreaMap, populationPerRegions!, selectedRegions);
                  const tableRows = epidCalculator.calculateTable();

                  const resRussiaMorbidity = epidCalculator.getRussiaMorbidity();
                  const resChosenRegionsMorbidity = epidCalculator.getChosenRegionsMorbidity();

                  const resRussiaIntensiveMorbidity = epidCalculator.getRussiaIntensiveMorbidity();
                  const resChosenRegionsIntensiveMorbidity = epidCalculator.getChosenRegionsIntensiveMorbidity();

                  const resChosenRegionsStandardizedMorbidity = epidCalculator.getChosenRegionsStandardizedMorbidity();
                  const resChosenRegionsStandardizedIntensiveMorbidity =
                    epidCalculator.getChosenRegionsStandardizedIntensiveMorbidity();

                  setRussiaMorbidity(resRussiaMorbidity);
                  setChosenRegionsMorbidity(resChosenRegionsMorbidity);
                  setRussiaIntensiveMorbidity(resRussiaIntensiveMorbidity);
                  setChosenRegionsIntensiveMorbidity(resChosenRegionsIntensiveMorbidity);
                  setChosenRegionsStandardizedMorbidity(resChosenRegionsStandardizedMorbidity);
                  setChosenRegionsStandardizedIntensiveMorbidity(resChosenRegionsStandardizedIntensiveMorbidity);

                  setCalculatedTableRows(tableRows);

                  const sexes: (Sex | undefined)[] = hasSexRecognition ? ["male", "female", undefined] : [undefined];
                  const regionCodesArray = [undefined, selectedRegions];

                  const objLambda: Partial<CalculationCategoriesType> = {};
                  const objC: Partial<CalculationCategoriesType> = {};
                  const objContactNumber: Partial<CalculationCategoriesType> = {};
                  const objAbsoluteError: Partial<CalculationCategoriesType> = {};

                  for (const sex of sexes) {
                    const mappedSex = EpidCalculator.mapSex(sex);

                    for (const regionCodes of regionCodesArray) {
                      const mappedRegionCodes = EpidCalculator.mapRegionCodes(regionCodes);

                      const key = mappedSex + mappedRegionCodes;

                      objLambda[key as keyof CalculationCategoriesType] = epidCalculator.getLambdaEstimation(
                        sex,
                        regionCodes
                      );
                      objC[key as keyof CalculationCategoriesType] = epidCalculator.getCEstimation(sex, regionCodes);
                      objContactNumber[key as keyof CalculationCategoriesType] = epidCalculator.getContactNumber(
                        sex,
                        regionCodes
                      );
                      objAbsoluteError[key as keyof CalculationCategoriesType] = epidCalculator.getAbsoluteError(
                        sex,
                        regionCodes
                      );
                    }
                  }
                  setLambdaEstimation(objLambda as CalculationCategoriesType);
                  setCEstimation(objC as CalculationCategoriesType);
                  setContactNumberEstimation(objContactNumber as CalculationCategoriesType);
                  setAbsoluteErrorEstimation(objAbsoluteError as CalculationCategoriesType);

                  console.log(tableRows);
                } catch (error) {
                  console.error(error);

                  Store.addNotification({
                    title: "Не удалось провести расчёт",
                    message: (error as EpidCalculatorException).message,
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
                }
              } else {
                Store.addNotification({
                  title: "Расчёт не был проведен",
                  message: "Чтобы провести расчёт, необходимо выбрать регионы",
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
              }
              setSpinning(false);
            }}
          >
            Расчёт
            <ArrowForwardIcon />
          </Button>
        </section>
        <div className="w-full pt-2">
          <Table
            pagination={false}
            columns={
              hasSexRecognition
                ? (calculatedSexRecognitionTableColumns as any)
                : (calculatedNoSexRecognitionTableColumns as any)
            }
            dataSource={calculatedTableRows}
            bordered
            scroll={{ y: 500 }}
          />
          <section className="pt-4 flex flex-col gap-4">
            <List
              size="large"
              bordered
              dataSource={[
                `Россия - заболеваемость совокупного населения, абсолютная и на 100 тысяч ${RussiaMorbidity}; ${RussiaIntensiveMorbidity}`,
                `Выбран. регионы - заболеваемость совокупного населения, абсолютная и на 100 тысяч ${chosenRegionsMorbidity}; ${chosenRegionsIntensiveMorbidity}`,
                `Выбран. регионы - стандартизованная по возрастному населению заболеваемость совокупного населения, абсолютная и на 100 тысяч ${chosenRegionsStandardizedMorbidity}; ${chosenRegionsStandardizedIntensiveMorbidity}`,
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
            <ModelEstimationTable
              hasSexRecognition={hasSexRecognition}
              objLambda={lambdaEstimation}
              objC={cEstimation}
              objAbsoluteError={absoluteErrorEstimation}
              objContactNumber={contactNumberEstimation}
            />
          </section>
        </div>
        <div className="w-full text-center pt-1 pb-3" style={{ width: "100vw" }}>
          <Plot
            data={extractDataForPlotting(calculatedTableRows, hasSexRecognition) as unknown as Data[]}
            layout={{
              title: "График интенсивной заболеваемости",
              xaxis: {
                color: "white",
              },
              yaxis: {
                color: "white",
              },
              autosize: true,
              paper_bgcolor: "#375358",
              plot_bgcolor: "#375358",
              font: {
                color: "white",
              },
            }}
            config={{
              responsive: true,
            }}
            useResizeHandler={true}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    );
  } else {
    return <div>Loading regions...</div>;
  }
});

export default CalculationsTable;
