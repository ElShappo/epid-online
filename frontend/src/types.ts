import { availableYears, calculatedSexRecognitionTableColumns, calculatedTableColumnTypes } from "./constants";

export interface DataType {
  key: React.Key;
  age: number | string;

  all: number | string;
  all_men: number | string;
  all_women: number | string;
  all_proportion: number | string;

  urban_all: number | string;
  urban_men: number | string;
  urban_women: number | string;
  urban_proportion: number | string;

  rural_all: number | string;
  rural_men: number | string;
  rural_women: number | string;
  rural_proportion: number | string;
}

export type ChartDataset = {
  data: number[];
  label?: string; // a legend actually
  borderColor?: string;
  backgroundColor?: string;
};

export type ChartData = {
  labels: string[] | number[];
  datasets: ChartDataset[];
};

export type DataIndex = keyof DataType;

export type Region = {
  territory: string;
  territory_code: string;
};

export type AntDesignTree = {
  title: string;
  value: string;
  key: string;
  children: AntDesignTree[];
};

export type PopulationSingleRecord = {
  year: number;
  territory: string;
  territory_code: string;
  age_start: number;
  age_end: number;
  all: number;
  all_men: number;
  all_women: number;
  all_proportion?: number;
  urban_all: number;
  urban_men: number;
  urban_women: number;
  urban_proportion?: number;
  rural_all: number;
  rural_men: number;
  rural_women: number;
  rural_proportion?: number;
};

export type availableYearsType = (typeof availableYears)[number];

export type chartsDataMode = "peoplePerAge" | "ruralToUrban" | "womenToMen";

export type LineColor = {
  backgroundColor: string;
  borderColor: string;
};

export type Sex = "male" | "female";

export type CalculatedSexRecognitionTableColumnTitle = (typeof calculatedSexRecognitionTableColumns)[number]["title"];
export type CalculatedSexRecognitionTableColumnDataIndex =
  (typeof calculatedSexRecognitionTableColumns)[number]["dataIndex"];

export type CalculatedSexRecognitionTableRow = {
  [index in CalculatedSexRecognitionTableColumnDataIndex]: number;
};

export type CalculatedNoSexRecognitionTableRow = Omit<
  CalculatedSexRecognitionTableRow,
  | "menPopulationRussia"
  | "menMorbidityRussia"
  | "menIntensiveMorbidityRussia"
  | "menLowerIntensiveMorbidityRussia"
  | "menUpperIntensiveMorbidityRussia"
  | "womenPopulationRussia"
  | "womenMorbidityRussia"
  | "womenIntensiveMorbidityRussia"
  | "womenLowerIntensiveMorbidityRussia"
  | "womenUpperIntensiveMorbidityRussia"
  | "menPopulationChosenRegions"
  | "menMorbidityChosenRegions"
  | "menIntensiveMorbidityChosenRegions"
  | "menLowerIntensiveMorbidityChosenRegions"
  | "menUpperIntensiveMorbidityChosenRegions"
  | "womenPopulationChosenRegions"
  | "womenMorbidityChosenRegions"
  | "womenIntensiveMorbidityChosenRegions"
  | "womenLowerIntensiveMorbidityChosenRegions"
  | "womenUpperIntensiveMorbidityChosenRegions"
>;

export type CalculatedTableRow = CalculatedSexRecognitionTableRow | CalculatedNoSexRecognitionTableRow;

export function isCalculatedSexRecognitionTableRow(row: CalculatedTableRow): row is CalculatedSexRecognitionTableRow {
  return (row as CalculatedSexRecognitionTableRow).menMorbidityRussia !== undefined;
}

export type PlotlyInputData = {
  x: string[];
  y: number[];
  name: string;
  error_y: {
    type: "data" | "constant" | "percent";
    array: number[];
    arrayminus: number[];
    visible: boolean;
    color: string;
  };
  type: "bar";
};

export type CalculatedTableColumnType = (typeof calculatedTableColumnTypes)[number];

export type CalculationCategoriesType = {
  Russia: number;
  menRussia: number;
  womenRussia: number;

  ChosenRegions: number;
  menChosenRegions: number;
  womenChosenRegions: number;
};
