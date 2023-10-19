export const districts = [
  'Центральный федеральный округ',
  'Северо-Западный федеральный',
  'Южный федеральный округ',
  'Северо-Кавказский федеральный округ',
  'Приволжский федеральный округ',
  'Уральский федеральный округ',
  'Сибирский федеральный округ',
  'Дальневосточный федеральный округ '
] as const;
  
export type District = typeof districts[number];

export type SubjectTreeNode = {
  title: string;
  value: string;
  key: string;
  children: SubjectTree;
};

export type SubjectTree = SubjectTreeNode[];

export interface DataType {
  key: any;
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