import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Button,
  Checkbox,
  Form,
  GetProp,
  GetRef,
  Input,
  Popconfirm,
  Table,
  TreeSelect,
} from "antd";
import { PopulationSingleYear } from "../../utils";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PageviewIcon from "@mui/icons-material/Pageview";
import { observer } from "mobx-react-lite";
import year from "../../store/year";
import TextArea, { TextAreaRef } from "antd/es/input/TextArea";
import {
  textAreaTitlesAgeEndChecked,
  textAreaTitlesAllChecked,
  textAreaTitlesAllUnchecked,
  textAreaTitlesGenderRecognitionChecked,
} from "../../constants";
import { CheckboxValueType } from "antd/es/checkbox/Group";

const { SHOW_PARENT } = TreeSelect;

type InputRef = GetRef<typeof Input>;
type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  ageStart: string;
  ageEnd: string;

  numberOfInfectedMenRussia: string;
  numberOfInfectedWomenRussia: string;

  numberOfInfectedMenChosenRegions: string;
  numberOfInfectedWomenChosenRegions: string;
}

interface EditableRowProps {
  index: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;

  ageStart: string;
  ageEnd: string;

  numberOfInfectedMenRussia: string;
  numberOfInfectedWomenRussia: string;

  numberOfInfectedMenChosenRegions: string;
  numberOfInfectedWomenChosenRegions: string;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const checkboxOptions = ["Деление по полу", "Указывать оба диапазона лет"];

const CalculationsTable = observer(() => {
  const headerHeight = useOutletContext();
  console.log(headerHeight);

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

  type TextAreaRefWithTitle = {
    title: string;
    ref: TextAreaRef;
  };

  const textAreaRefs = useRef<Map<string, TextAreaRef> | null>(null);

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

  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: "0",
      ageStart: "5",
      ageEnd: "7",

      numberOfInfectedMenRussia: "5000",
      numberOfInfectedWomenRussia: "4000",

      numberOfInfectedMenChosenRegions: "5000",
      numberOfInfectedWomenChosenRegions: "4000",
    },
  ]);

  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "Начальный возраст",
      dataIndex: "ageStart",
      width: "10%",
      editable: true,
    },
    {
      title: "Конечный возраст",
      dataIndex: "ageEnd",
      editable: true,
    },
    {
      title: "Число заболевших (мужчины, Россия)",
      dataIndex: "numberOfInfectedMenRussia",
      editable: true,
    },
    {
      title: "Число заболевших (женщины, Россия)",
      dataIndex: "numberOfInfectedWomenRussia",
      editable: true,
    },
    {
      title: "Число заболевших (мужчины, выбран. регионы)",
      dataIndex: "numberOfInfectedMenChosenRegions",
      editable: true,
    },
    {
      title: "Число заболевших (женщины, выбран. регионы)",
      dataIndex: "numberOfInfectedWomenChosenRegions",
      editable: true,
    },
    {
      title: "Действие",
      dataIndex: "operation",
      render: (_, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Вы точно хотите удалить?"
            onConfirm={() => handleDelete(record.key)}
            okText="Да"
            cancelText="Нет"
          >
            <a>Удалить</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      ageStart: "0",
      ageEnd: "0",

      numberOfInfectedMenRussia: "0",
      numberOfInfectedWomenRussia: "0",

      numberOfInfectedMenChosenRegions: "0",
      numberOfInfectedWomenChosenRegions: "0",
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

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
  }, [year.get()]);

  const textAreaTitles = useMemo(() => {
    switch (checkedOptions.length) {
      case 0:
        return textAreaTitlesAllUnchecked;
      case 1:
        if (checkedOptions.includes("Деление по полу")) {
          return textAreaTitlesGenderRecognitionChecked;
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
          >
            Превью
            <PageviewIcon />
          </Button>
          <Button
            type="primary"
            className="flex gap-1 justify-center p-5 items-center"
          >
            Расчёт
            <ArrowForwardIcon />
          </Button>
        </section>
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
