import { calculatedSexRecognitionTableColumns, calculatedTableColumnTypes } from "../../../constants";

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

export type CalculatedTableColumnType = (typeof calculatedTableColumnTypes)[number];
