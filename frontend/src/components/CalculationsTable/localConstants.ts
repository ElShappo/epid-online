import { upperYearBound } from "../../constants";

export const delimSymbols = ["\n"] as const;
export const inputOptions = ["sexRecognition", "ageEnd"] as const;

export const textAreaVariations = [
  {
    dataIndex: "ageStart" as const,
    title: "Начальный возраст" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: upperYearBound },
  },
  {
    dataIndex: "ageEnd" as const,
    title: "Конечный возраст" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: upperYearBound },
  },
  {
    dataIndex: "morbidityRussia" as const,
    title: "Число заболевших (Россия)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
  {
    dataIndex: "menMorbidityRussia" as const,
    title: "Число заболевших (мужчины, Россия)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
  {
    dataIndex: "womenMorbidityRussia" as const,
    title: "Число заболевших (женщины, Россия)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
  {
    dataIndex: "morbidityChosenRegions" as const,
    title: "Число заболевших (выбран. регионы)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
  {
    dataIndex: "menMorbidityChosenRegions" as const,
    title: "Число заболевших (мужчины, выбран. регионы)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
  {
    dataIndex: "womenMorbidityChosenRegions" as const,
    title: "Число заболевших (женщины, выбран. регионы)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
];

export const textAreaSexRecognitionAgeEnd = [
  {
    dataIndex: "ageStart" as const,
    title: "Начальный возраст" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: upperYearBound },
  },
  {
    dataIndex: "ageEnd" as const,
    title: "Конечный возраст" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: upperYearBound },
  },
  {
    dataIndex: "menMorbidityRussia" as const,
    title: "Число заболевших (мужчины, Россия)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
  {
    dataIndex: "womenMorbidityRussia" as const,
    title: "Число заболевших (женщины, Россия)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
  {
    dataIndex: "menMorbidityChosenRegions" as const,
    title: "Число заболевших (мужчины, выбран. регионы)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
  {
    dataIndex: "womenMorbidityChosenRegions" as const,
    title: "Число заболевших (женщины, выбран. регионы)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
];

export const textAreaSexRecognition = [
  {
    dataIndex: "ageStart" as const,
    title: "Начальный возраст" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: upperYearBound },
  },
  {
    dataIndex: "menMorbidityRussia" as const,
    title: "Число заболевших (мужчины, Россия)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
  {
    dataIndex: "womenMorbidityRussia" as const,
    title: "Число заболевших (женщины, Россия)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
  {
    dataIndex: "menMorbidityChosenRegions" as const,
    title: "Число заболевших (мужчины, выбран. регионы)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
  {
    dataIndex: "womenMorbidityChosenRegions" as const,
    title: "Число заболевших (женщины, выбран. регионы)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
];

export const textAreaAgeEnd = [
  {
    dataIndex: "ageStart" as const,
    title: "Начальный возраст" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: upperYearBound },
  },
  {
    dataIndex: "ageEnd" as const,
    title: "Конечный возраст" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: upperYearBound },
  },
  {
    dataIndex: "morbidityRussia" as const,
    title: "Число заболевших (Россия)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
  {
    dataIndex: "morbidityChosenRegions" as const,
    title: "Число заболевших (выбран. регионы)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
];

export const textAreaNone = [
  {
    dataIndex: "ageStart" as const,
    title: "Начальный возраст" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: upperYearBound },
  },
  {
    dataIndex: "morbidityRussia" as const,
    title: "Число заболевших (Россия)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
  {
    dataIndex: "morbidityChosenRegions" as const,
    title: "Число заболевших (выбран. регионы)" as const,
    restrictions: { allowOnlyIntegers: true, upperBound: undefined },
  },
];
