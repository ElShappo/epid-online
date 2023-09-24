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

export type DataIndex = keyof DataType;