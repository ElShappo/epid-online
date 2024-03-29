import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Checkbox, GetProp, List, message, Modal, Spin, Table, TreeSelect, Upload } from "antd";
import { PopulationSingleYear } from "../../utils";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PageviewIcon from "@mui/icons-material/Pageview";
import { observer } from "mobx-react-lite";
import year from "../../store/year";
import TextArea from "antd/es/input/TextArea";
import { calculatedNoSexRecognitionTableColumns, calculatedSexRecognitionTableColumns } from "../../constants";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { EpidCalculator, EpidCalculatorException } from "./classes/epidCalculator";
import { Sex } from "../../types";
import { Store } from "react-notifications-component";
import Plot from "react-plotly.js";
import { Data } from "plotly.js";
import { EpidTextArea, InputMode, InputOption, RawEpidTextArea, TextAreaDataIndex } from "./types/textAreaTypes";
import {
  inputOptions,
  textAreaAgeEnd,
  textAreaNone,
  textAreaSexRecognition,
  textAreaSexRecognitionAgeEnd,
} from "./constants/textAreaConstants";
import { capitalize, extractDataForPlotting, mapRegionCodes, mapSex } from "./utils/utils";
import { CalculatedTableRow } from "./types/calculatedTableTypes";
import ModelEstimationTable, { ModelEstimationTableColumns } from "./ModelEstimationTable";
const { SHOW_PARENT } = TreeSelect;

const checkboxOptions = [
  { label: "Деление по полу", value: "sexRecognition" },
  { label: "Указывать оба диапазона лет", value: "ageEnd" },
] as Array<{
  label: string;
  value: InputOption;
}>;

const CalculationsTable = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>({
    ageEnd: false,
    sexRecognition: false,
  });

  const [spinning, setSpinning] = useState<boolean>(false);

  const [populationPerRegions, setPopulationPerRegions] = useState<PopulationSingleYear>();
  const [gotRegions, setGotRegions] = useState<boolean>(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>();

  const [calculatedTableRows, setCalculatedTableRows] = useState<CalculatedTableRow[]>([]);
  const [modelEstimationTableRows, setModelEstimationTableRows] = useState<ModelEstimationTableColumns[]>([]);

  const [chosenRegionsStandardizedMorbidity, setChosenRegionsStandardizedMorbidity] = useState<number>();
  const [chosenRegionsStandardizedIntensiveMorbidity, setChosenRegionsStandardizedIntensiveMorbidity] =
    useState<number>();

  const textAreaRefs = useRef<Map<TextAreaDataIndex, RawEpidTextArea> | null>(null);

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
    setInputMode(newInputMode as InputMode);
  };

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
        const map = getTextAreaMap();

        for (let i = 0; i < epidTextAreas.length; ++i) {
          const dataIndex = epidTextAreas[i].dataIndex;
          const dataForTextarea = [];

          for (const row of rows) {
            const splittedRow = row.split(";");
            dataForTextarea.push(splittedRow[i]);
          }
          const textAreaRef = map.get(dataIndex);
          textAreaRef!.ref.resizableTextArea!.textArea!.value = dataForTextarea.join("\n");
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

  const epidTextAreas = useMemo(() => {
    if (inputMode.sexRecognition && inputMode.ageEnd) {
      return textAreaSexRecognitionAgeEnd;
    } else if (inputMode.sexRecognition && !inputMode.ageEnd) {
      return textAreaSexRecognition;
    } else if (!inputMode.sexRecognition && inputMode.ageEnd) {
      return textAreaAgeEnd;
    } else {
      return textAreaNone;
    }
  }, [inputMode.sexRecognition, inputMode.ageEnd]);

  const sexes = useMemo(() => {
    if (inputMode.sexRecognition) {
      return ["male", "female", ""] as Sex[];
    } else {
      return [undefined];
    }
  }, [inputMode.sexRecognition]);

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
          {epidTextAreas.map((epidTextArea) => {
            return (
              <div key={epidTextArea.dataIndex}>
                <p className="text-center pb-2">{epidTextArea.title}</p>
                <TextArea
                  rows={10}
                  ref={(node) => {
                    const map = getTextAreaMap();
                    if (node) {
                      map.set(epidTextArea.dataIndex, {
                        dataIndex: epidTextArea.dataIndex,
                        title: epidTextArea.title,
                        restrictions: epidTextArea.restrictions,
                        ref: node,
                        delimSymbol: "\n",
                      });
                    } else {
                      map.delete(epidTextArea.dataIndex);
                    }
                  }}
                  name={epidTextArea.dataIndex}
                  onInput={() => {
                    console.log(textAreaRefs.current);
                  }}
                  placeholder={`Введите ${epidTextArea.title.toLowerCase()}:`}
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
              const rawTextAreas = getTextAreaMap();
              const textAreas = new Map<TextAreaDataIndex, EpidTextArea>();

              for (const [key, value] of rawTextAreas.entries()) {
                textAreas.set(key, {
                  dataIndex: value.dataIndex,
                  title: value.title,
                  restrictions: value.restrictions,
                  content: value.ref.resizableTextArea!.textArea.value,
                  delimSymbol: value.delimSymbol,
                });
              }

              if (selectedRegions && selectedRegions.length) {
                try {
                  const epidCalculator = new EpidCalculator(
                    textAreas,
                    inputMode,
                    populationPerRegions!,
                    selectedRegions
                  );

                  const tableRows = epidCalculator.calculateTable();
                  const resChosenRegionsStandardizedMorbidity = epidCalculator.getChosenRegionsStandardizedMorbidity();
                  const resChosenRegionsStandardizedIntensiveMorbidity =
                    epidCalculator.getChosenRegionsStandardizedIntensiveMorbidity();

                  setCalculatedTableRows(tableRows);
                  setChosenRegionsStandardizedMorbidity(resChosenRegionsStandardizedMorbidity);
                  setChosenRegionsStandardizedIntensiveMorbidity(resChosenRegionsStandardizedIntensiveMorbidity);

                  const rows: ModelEstimationTableColumns[] = [];

                  let i = 0;
                  for (const sex of sexes) {
                    for (const regionCodes of [selectedRegions, undefined]) {
                      const type = "data" + capitalize(mapSex(sex)) + capitalize(mapRegionCodes(regionCodes));

                      const totalMorbidity = epidCalculator.getTotalMorbidity(sex, regionCodes);
                      const totalIntensiveMorbidity = epidCalculator.getTotalIntensiveMorbidity(sex, regionCodes);

                      const lambdaEstimation = epidCalculator.getLambdaEstimation(sex, regionCodes);
                      const cEstimation = epidCalculator.getCEstimation(sex, regionCodes);
                      const contactNumberEstimation = epidCalculator.getContactNumberEstimation(sex, regionCodes);
                      const absoluteErrorEstimation = epidCalculator.getAbsoluteErrorEstimation(sex, regionCodes);

                      const obj: ModelEstimationTableColumns = {
                        key: String(i),
                        type,
                        totalMorbidity,
                        totalIntensiveMorbidity,
                        lambda: lambdaEstimation,
                        c: cEstimation,
                        contactNumber: contactNumberEstimation,
                        absoluteError: absoluteErrorEstimation,
                      };
                      rows.push(obj);
                      ++i;
                    }
                  }
                  setModelEstimationTableRows(rows);
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
              inputMode.sexRecognition
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
                `Выбран. регионы - стандартизованная по возрастному населению заболеваемость совокупного населения, абсолютная и на 100 тысяч ${chosenRegionsStandardizedMorbidity}; ${chosenRegionsStandardizedIntensiveMorbidity}`,
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
            <ModelEstimationTable data={modelEstimationTableRows} />
          </section>
        </div>
        <div className="w-full text-center pt-1 pb-3" style={{ width: "100vw" }}>
          <Plot
            data={extractDataForPlotting(calculatedTableRows, inputMode.sexRecognition) as unknown as Data[]}
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
