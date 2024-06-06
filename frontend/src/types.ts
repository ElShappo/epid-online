import { PlotData } from "plotly.js";
import { availableYears } from "./constants";

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

export type RegionPlotly = {
  region: string;
  federal_district: string;
  population?: number;
  x: number[];
  y: number[];
};

export type ProgramDetails = {
  name: string;
  url: string;
  description?: string;
  icon?: string;
};

export type RussiaMapData = {
  [Key in keyof Partial<PlotData>]?: Partial<PlotData>[Key];
} & { region: string; federal_district: string; population?: number };

export type FormattedMorbidity = {
  [key1: string]: {
    [key2: string]: {
      [key3: string]: {
        [key4: string]: {
          [key5: string]: number;
        };
      };
    };
  };
};
