export interface DataType {
    key: React.Key;
    age: number | string;
  
    malesFemalesAll: number | string;
    malesAll: number | string;
    femalesAll: number | string;
    proportionAll: number | string;
  
    malesFemalesCity: number | string;
    malesCity: number | string;
    femalesCity: number | string;
    proportionCity: number | string;
  
    malesFemalesRural: number | string;
    malesRural: number | string;
    femalesRural: number | string;
    proportionRural: number | string;
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
  territory: string
  territory_code: string
}

export type PopulationSingleRecord = {
  year: number
  territory: string
  territory_code: string
  age_start: number
  age_end: number
  all: number
  all_men: number
  all_women: number
  urban_all: number,
  urban_men: number,
  urban_women: number,
  rural_all: number,
  rural_men: number,
  rural_women: number
}