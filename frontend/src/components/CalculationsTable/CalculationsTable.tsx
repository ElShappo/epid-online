import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Button,
  Checkbox,
  GetProp,
  Modal,
  Spin,
  Table,
  TreeSelect,
} from "antd";
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
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { EpidCalculator, EpidCalculatorException } from "./utils";
import {
  CalculatedTableRow,
  TextAreaContentMeta,
  TextAreaTitle,
} from "../../types";
import { Store } from "react-notifications-component";

const { SHOW_PARENT } = TreeSelect;

const checkboxOptions = ["Деление по полу", "Указывать оба диапазона лет"];

const CalculationsTable = observer(() => {
  const headerHeight = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(headerHeight);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onCheckboxChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    console.log("checked = ", checkedValues);
    setCheckedOptions(checkedValues);
  };

  const [checkedOptions, setCheckedOptions] = useState<CheckboxValueType[]>([]);

  const [populationPerRegions, setPopulationPerRegions] =
    useState<PopulationSingleYear>();

  const [gotRegions, setGotRegions] = useState<boolean>(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>();

  const [calculatedTableRows, setCalculatedTableRows] = useState<
    CalculatedTableRow[]
  >([]);

  const [calculatedTableCols, setCalculatedTableCols] = useState<
    | typeof calculatedNoSexRecognitionTableColumns
    | typeof calculatedSexRecognitionTableColumns
  >(calculatedNoSexRecognitionTableColumns);

  const [spinning, setSpinning] = useState<boolean>(false);

  const textAreaRefs = useRef<Map<TextAreaTitle, TextAreaRef> | null>(null);

  function getTextAreaMap() {
    if (!textAreaRefs.current) {
      textAreaRefs.current = new Map();
    }
    return textAreaRefs.current;
  }

  const treeData = useMemo(() => {
    const onChange = (newValue: string[]) => {
      console.log("Old value: ", selectedRegions);
      console.log("New value: ", newValue);
      setSelectedRegions(newValue);
    };
    return {
      treeData: [
        populationPerRegions?.getRegions()?.getAntDesignTreeSelectFormat(),
      ],
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
        <Checkbox.Group
          options={checkboxOptions}
          onChange={onCheckboxChange}
          className="w-full justify-center"
        />
        <div className="max-h-36 overflow-y-auto">
          <TreeSelect {...(treeData as any)} className="min-w-72 max-w-96" />
        </div>
        <section className="w-full grow flex flex-wrap justify-center gap-4 pt-4">
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
          <Button
            type="primary"
            className="bg-gray-500 flex gap-1 justify-center p-5 items-center"
            onClick={showModal}
          >
            Превью
            <PageviewIcon />
          </Button>
          <Modal
            title="Basic Modal"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
          >
            {/* <Table columns={columns} dataSource={data} /> */}
          </Modal>
          <Button
            type="primary"
            className="flex gap-1 justify-center p-5 items-center"
            onClick={() => {
              setSpinning(true);
              const textAreaMap = getTextAreaMap();
              const newTextAreaMap: Map<TextAreaTitle, TextAreaContentMeta> =
                new Map();

              for (const key of textAreaMap.keys()) {
                newTextAreaMap.set(key, {
                  content:
                    textAreaMap.get(key)!.resizableTextArea!.textArea.value,
                  allowOnlyIntegers: true,
                  delimSymbol: "\n",
                  upperBound:
                    key === "Начальный возраст" || key === "Конечный возраст"
                      ? upperYearBound
                      : null,
                });
              }

              if (selectedRegions) {
                try {
                  const epidCalculator = new EpidCalculator(
                    newTextAreaMap,
                    populationPerRegions!,
                    selectedRegions
                  );
                  const result = epidCalculator.calculate();
                  setCalculatedTableRows(result);

                  if (checkedOptions.includes("Деление по полу")) {
                    setCalculatedTableCols(
                      calculatedSexRecognitionTableColumns
                    );
                  }
                  console.log(result);
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
        <div className="w-full">
          <Table
            columns={calculatedTableCols as any}
            dataSource={calculatedTableRows}
            bordered
            scroll={{ y: 500 }}
          />
        </div>
      </div>
    );
  } else {
    return <div>Loading regions...</div>;
  }

  {
    /* {selectedRegions && selectedRegions.length ? (
    <>
      <div className="flex flex-col md:flex-initial md:w-[80%] justify-end">
        <div className="flex gap-3 justify-end pb-3">
          <Button
            onClick={handleAdd}
            type="primary"
            className="flex"
            icon={<AddIcon />}
          >
            Добавить запись
          </Button>
          <Button
            onClick={handleAdd}
            type="primary"
            className="flex"
            danger
            icon={<DeleteIcon />}
          >
            Удалить всё
          </Button>
        </div>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns as ColumnTypes}
        />
      </div>
    </>
  ) : null} */
  }
});

export default CalculationsTable;
