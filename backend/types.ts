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