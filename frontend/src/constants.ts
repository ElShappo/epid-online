import { DataType } from "./types";
import type { ColumnsType } from "antd/es/table";

const availableYears = [2009, 2010, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023] as const;

export const defaultYear = availableYears.at(-1);

export const RussiaRegionCode = "1.0.0";
export const upperYearBound = 199;
export const defaultP = 0.05; // default significance level
export const calculationsPrecision = 2;

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

export const calculatedNoSexRecognitionTableColumns = [
  {
    title: "Начальный возраст" as const,
    dataIndex: "startAge" as const,
    width: 120,
    fixed: "left",
    align: "center",
  },
  {
    title: "Конечный возраст" as const,
    dataIndex: "endAge" as const,
    width: 120,
    fixed: "left",
    align: "center",
  },

  {
    title: "Население (Россия)" as const,
    dataIndex: "populationRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Число заболевших (Россия)" as const,
    dataIndex: "morbidityRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Интенсивная заболеваемость на 100 тыс. (Россия)" as const,
    dataIndex: "intensiveMorbidityRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Нижний доверительный интервал (Россия)" as const,
    dataIndex: "lowerIntensiveMorbidityRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Верхний доверительный интервал (Россия)" as const,
    dataIndex: "upperIntensiveMorbidityRussia" as const,
    width: 150,
    align: "center",
  },

  {
    title: "Население (выбран. регионы)" as const,
    dataIndex: "populationChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Число заболевших (выбран. регионы)" as const,
    dataIndex: "morbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Интенсивная заболеваемость на 100 тыс. (выбран. регионы)" as const,
    dataIndex: "intensiveMorbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Нижний доверительный интервал (выбран. регионы)" as const,
    dataIndex: "lowerIntensiveMorbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Верхний доверительный интервал (выбран. регионы)" as const,
    dataIndex: "upperIntensiveMorbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },
];

export const calculatedSexRecognitionTableColumns = [
  {
    title: "Начальный возраст" as const,
    dataIndex: "startAge" as const,
    fixed: "left",
    width: 120,
    align: "center",
  },
  {
    title: "Конечный возраст" as const,
    dataIndex: "endAge" as const,
    width: 120,
    fixed: "left",
    align: "center",
  },

  {
    title: "Население (Россия)" as const,
    dataIndex: "populationRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Число заболевших (Россия)" as const,
    dataIndex: "morbidityRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Интенсивная заболеваемость на 100 тыс. (Россия)" as const,
    dataIndex: "intensiveMorbidityRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Нижний доверительный интервал (Россия)" as const,
    dataIndex: "lowerIntensiveMorbidityRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Верхний доверительный интервал (Россия)" as const,
    dataIndex: "upperIntensiveMorbidityRussia" as const,
    width: 150,
    align: "center",
  },

  {
    title: "Мужское население (Россия)" as const,
    dataIndex: "menPopulationRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Число заболевших (мужчины, Россия)" as const,
    dataIndex: "menMorbidityRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Интенсивная заболеваемость на 100 тыс. (мужчины, Россия)" as const,
    dataIndex: "menIntensiveMorbidityRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Нижний доверительный интервал (мужчины, Россия)" as const,
    dataIndex: "menLowerIntensiveMorbidityRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Верхний доверительный интервал (мужчины, Россия)" as const,
    dataIndex: "menUpperIntensiveMorbidityRussia" as const,
    width: 150,
    align: "center",
  },

  {
    title: "Женское население (Россия)" as const,
    dataIndex: "womenPopulationRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Число заболевших (женщины, Россия)" as const,
    dataIndex: "womenMorbidityRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Интенсивная заболеваемость на 100 тыс. (женщины, Россия)" as const,
    dataIndex: "womenIntensiveMorbidityRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Нижний доверительный интервал (женщины, Россия)" as const,
    dataIndex: "womenLowerIntensiveMorbidityRussia" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Верхний доверительный интервал (женщины, Россия)" as const,
    dataIndex: "womenUpperIntensiveMorbidityRussia" as const,
    width: 150,
    align: "center",
  },

  {
    title: "Население (выбран. регионы)" as const,
    dataIndex: "populationChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Число заболевших (выбран. регионы)" as const,
    dataIndex: "morbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Интенсивная заболеваемость на 100 тыс. (выбран. регионы)" as const,
    dataIndex: "intensiveMorbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Нижний доверительный интервал (выбран. регионы)" as const,
    dataIndex: "lowerIntensiveMorbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Верхний доверительный интервал (выбран. регионы)" as const,
    dataIndex: "upperIntensiveMorbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },

  {
    title: "Мужское население (выбран. регионы)" as const,
    dataIndex: "menPopulationChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Число заболевших (мужчины, выбран. регионы)" as const,
    dataIndex: "menMorbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Интенсивная заболеваемость на 100 тыс. (мужчины, выбран. регионы)" as const,
    dataIndex: "menIntensiveMorbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Нижний доверительный интервал (мужчины, выбран. регионы)" as const,
    dataIndex: "menLowerIntensiveMorbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Верхний доверительный интервал (мужчины, выбран. регионы)" as const,
    dataIndex: "menUpperIntensiveMorbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },

  {
    title: "Женское население (выбран. регионы)" as const,
    dataIndex: "womenPopulationChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Число заболевших (женщины, выбран. регионы)" as const,
    dataIndex: "womenMorbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Интенсивная заболеваемость на 100 тыс. (женщины, выбран. регионы)" as const,
    dataIndex: "womenIntensiveMorbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Нижний доверительный интервал (женщины, выбран. регионы)" as const,
    dataIndex: "womenLowerIntensiveMorbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },
  {
    title: "Верхний доверительный интервал (женщины, выбран. регионы)" as const,
    dataIndex: "womenUpperIntensiveMorbidityChosenRegions" as const,
    width: 150,
    align: "center",
  },
];

export const calculatedTableColumnTypes = [
  "population",
  "morbidity",
  "intensiveMorbidity",
  "lowerIntensiveMorbidity",
  "upperIntensiveMorbidity",
] as const;

export const plotlyMapModes = [
  "абсолютная заболеваемость",
  "интенсивная заболеваемость на 100 тысяч",
  "стандартизованная абсолютная заболеваемость",
  "стандартизованная интенсивная на 100 тысяч заболеваемость",
  "контактное число",
] as const;

export type MapMode = (typeof plotlyMapModes)[number];

export const fallbackImg = "./fallback.png";
export const noResults = "Ничего не нашлось :(";
export const loadingMessage = "Идёт загрузка...";
export const loadingRegionsMessage = "Идёт загрузка регионов...";

export const defaultMinColorValue = "rgb(255, 255, 255)";
export const defaultMaxColorValue = "rgb(0, 0, 0)";
export const defaultNullColorValue = "rgb(29, 190, 51)";

export { availableYears, columns };
