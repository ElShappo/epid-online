import {
  DataType,
  TextAreaTitle,
  TextAreaTitleAgeEndChecked,
  TextAreaTitleAllChecked,
  TextAreaTitleAllUnchecked,
  TextAreaTitleSexRecognitionChecked,
} from "./types";
import type { ColumnsType } from "antd/es/table";

const availableYears = [
  2009, 2010, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022,
  2023,
] as const;

export const defaultYear = availableYears.at(-1);

export const upperYearBound = 199;

const columns: ColumnsType<DataType> = [
  {
    title: "Год",
    dataIndex: "year",
    key: "year",
    width: 75,
    fixed: "left",
    align: "center",
  },
  {
    title: "Название",
    dataIndex: "territory",
    key: "territory",
    width: 200,
    fixed: "left",
    align: "center",
    ellipsis: true,
  },
  {
    title: "Код",
    dataIndex: "territory_code",
    key: "territory_code",
    width: 75,
    fixed: "left",
    align: "center",
    ellipsis: true,
  },
  {
    title: "Мин. возраст",
    dataIndex: "age_start",
    key: "age_start",
    width: 85,
    fixed: "left",
    align: "center",
  },
  {
    title: "Макс. возраст",
    dataIndex: "age_end",
    key: "age_end",
    width: 85,
    fixed: "left",
    align: "center",
  },
  {
    title: "Все население",
    children: [
      {
        title: "Мужчины и женщины",
        dataIndex: "all",
        key: "all",
        width: 150,
        sorter: (a, b) => +a.all - +b.all,
      },
      {
        title: "Мужчины",
        dataIndex: "all_men",
        key: "all_men",
        width: 150,
        sorter: (a, b) => +a.all_men - +b.all_men,
      },
      {
        title: "Женщины",
        dataIndex: "all_women",
        key: "all_women",
        width: 150,
        sorter: (a, b) => +a.all_women - +b.all_women,
      },
      {
        title: "Пропорция",
        dataIndex: "all_proportion",
        key: "all_proportion",
        width: 150,
        sorter: (a, b) => +a.all_proportion - +b.all_proportion,
      },
    ],
  },
  {
    title: "Городское население",
    children: [
      {
        title: "Мужчины и женщины",
        dataIndex: "urban_all",
        key: "urban_all",
        width: 150,
        sorter: (a, b) => +a.urban_all - +b.urban_all,
      },
      {
        title: "Мужчины",
        dataIndex: "urban_men",
        key: "urban_men",
        width: 150,
        sorter: (a, b) => +a.urban_men - +b.urban_men,
      },
      {
        title: "Женщины",
        dataIndex: "urban_women",
        key: "urban_women",
        width: 150,
        sorter: (a, b) => +a.urban_women - +b.urban_women,
      },
      {
        title: "Пропорция",
        dataIndex: "urban_proportion",
        key: "urban_proportion",
        width: 150,
        sorter: (a, b) => +a.urban_proportion - +b.urban_proportion,
      },
    ],
  },
  {
    title: "Сельское население",
    children: [
      {
        title: "Мужчины и женщины",
        dataIndex: "rural_all",
        key: "rural_all",
        width: 150,
        sorter: (a, b) => +a.rural_all - +b.rural_all,
      },
      {
        title: "Мужчины",
        dataIndex: "rural_men",
        key: "rural_men",
        width: 150,
        sorter: (a, b) => +a.rural_men - +b.rural_men,
      },
      {
        title: "Женщины",
        dataIndex: "rural_women",
        key: "rural_women",
        width: 150,
        sorter: (a, b) => +a.rural_women - +b.rural_women,
      },
      {
        title: "Пропорция",
        dataIndex: "rural_proportion",
        key: "rural_proportion",
        width: 150,
        sorter: (a, b) => +a.rural_proportion - +b.rural_proportion,
      },
    ],
  },
];

export const textAreaAvailableTitles: TextAreaTitle[] = [
  "Начальный возраст",
  "Конечный возраст",

  "Число заболевших (Россия)",
  "Число заболевших (мужчины, Россия)",
  "Число заболевших (женщины, Россия)",

  "Число заболевших (выбран. регионы)",
  "Число заболевших (мужчины, выбран. регионы)",
  "Число заболевших (женщины, выбран. регионы)",
];

export const textAreaTitlesAllChecked: TextAreaTitleAllChecked[] = [
  "Начальный возраст",
  "Конечный возраст",

  "Число заболевших (мужчины, Россия)",
  "Число заболевших (женщины, Россия)",

  "Число заболевших (мужчины, выбран. регионы)",
  "Число заболевших (женщины, выбран. регионы)",
];

export const textAreaTitlesAllUnchecked: TextAreaTitleAllUnchecked[] = [
  "Начальный возраст",
  "Число заболевших (Россия)",
  "Число заболевших (выбран. регионы)",
];

export const textAreaTitlesAgeEndChecked: TextAreaTitleAgeEndChecked[] = [
  "Начальный возраст",
  "Конечный возраст",
  "Число заболевших (Россия)",
  "Число заболевших (выбран. регионы)",
];

export const textAreaTitlesSexRecognitionChecked: TextAreaTitleSexRecognitionChecked[] =
  [
    "Начальный возраст",

    "Число заболевших (мужчины, Россия)",
    "Число заболевших (женщины, Россия)",

    "Число заболевших (мужчины, выбран. регионы)",
    "Число заболевших (женщины, выбран. регионы)",
  ];

export const calculatedSexRecognitionTableColumns = [
  {
    title: "Начальный возраст" as const,
    dataIndex: "startAge" as const,
    width: "10%",
  },
  {
    title: "Конечный возраст" as const,
    dataIndex: "endAge" as const,
    width: "10%",
  },

  {
    title: "Население (Россия)" as const,
    dataIndex: "populationRussia" as const,
  },
  {
    title: "Число заболевших (Россия)" as const,
    dataIndex: "morbidityRussia" as const,
  },
  {
    title: "Интенсивная заболеваемость на 100 тыс. (Россия)" as const,
    dataIndex: "intensiveMorbidityRussia" as const,
  },
  {
    title: "Нижний доверительный интервал (Россия)" as const,
    dataIndex: "lowerIntensiveMorbidityRussia" as const,
  },
  {
    title: "Верхний доверительный интервал (Россия)" as const,
    dataIndex: "upperIntensiveMorbidityRussia" as const,
  },

  {
    title: "Мужское население (Россия)" as const,
    dataIndex: "menPopulationRussia" as const,
  },
  {
    title: "Число заболевших (мужчины, Россия)" as const,
    dataIndex: "menMorbidityRussia" as const,
  },
  {
    title: "Интенсивная заболеваемость на 100 тыс. (мужчины, Россия)" as const,
    dataIndex: "menIntensiveMorbidityRussia" as const,
  },
  {
    title: "Нижний доверительный интервал (мужчины, Россия)" as const,
    dataIndex: "menLowerIntensiveMorbidityRussia" as const,
  },
  {
    title: "Верхний доверительный интервал (мужчины, Россия)" as const,
    dataIndex: "menUpperIntensiveMorbidityRussia" as const,
  },

  {
    title: "Женское население (Россия)" as const,
    dataIndex: "womenPopulationRussia" as const,
  },
  {
    title: "Число заболевших (женщины, Россия)" as const,
    dataIndex: "womenMorbidityRussia" as const,
  },
  {
    title: "Интенсивная заболеваемость на 100 тыс. (женщины, Россия)" as const,
    dataIndex: "womenIntensiveMorbidityRussia" as const,
  },
  {
    title: "Нижний доверительный интервал (женщины, Россия)" as const,
    dataIndex: "womenLowerIntensiveMorbidityRussia" as const,
  },
  {
    title: "Верхний доверительный интервал (женщины, Россия)" as const,
    dataIndex: "womenUpperIntensiveMorbidityRussia" as const,
  },

  {
    title: "Население (выбран. регионы)" as const,
    dataIndex: "populationChosenRegions" as const,
  },
  {
    title: "Число заболевших (выбран. регионы)" as const,
    dataIndex: "morbidityChosenRegions" as const,
  },
  {
    title: "Интенсивная заболеваемость на 100 тыс. (выбран. регионы)" as const,
    dataIndex: "intensiveMorbidityChosenRegions" as const,
  },
  {
    title: "Нижний доверительный интервал (выбран. регионы)" as const,
    dataIndex: "lowerIntensiveMorbidityChosenRegions" as const,
  },
  {
    title: "Верхний доверительный интервал (выбран. регионы)" as const,
    dataIndex: "upperIntensiveMorbidityChosenRegions" as const,
  },

  {
    title: "Мужское население (выбран. регионы)" as const,
    dataIndex: "menPopulationChosenRegions" as const,
  },
  {
    title: "Число заболевших (мужчины, выбран. регионы)" as const,
    dataIndex: "menMorbidityChosenRegions" as const,
  },
  {
    title:
      "Интенсивная заболеваемость на 100 тыс. (мужчины, выбран. регионы)" as const,
    dataIndex: "menIntensiveMorbidityChosenRegions" as const,
  },
  {
    title: "Нижний доверительный интервал (мужчины, выбран. регионы)" as const,
    dataIndex: "menLowerIntensiveMorbidityChosenRegions" as const,
  },
  {
    title: "Верхний доверительный интервал (мужчины, выбран. регионы)" as const,
    dataIndex: "menUpperIntensiveMorbidityChosenRegions" as const,
  },

  {
    title: "Женское население (выбран. регионы)" as const,
    dataIndex: "womenPopulationChosenRegions" as const,
  },
  {
    title: "Число заболевших (женщины, выбран. регионы)" as const,
    dataIndex: "womenMorbidityChosenRegions" as const,
  },
  {
    title:
      "Интенсивная заболеваемость на 100 тыс. (женщины, выбран. регионы)" as const,
    dataIndex: "womenIntensiveMorbidityChosenRegions" as const,
  },
  {
    title: "Нижний доверительный интервал (женщины, выбран. регионы)" as const,
    dataIndex: "womenLowerIntensiveMorbidityChosenRegions" as const,
  },
  {
    title: "Верхний доверительный интервал (женщины, выбран. регионы)" as const,
    dataIndex: "womenUpperIntensiveMorbidityChosenRegions" as const,
  },
];

export { availableYears, columns };
