import { CalculatedTableRow } from "../types/calculatedTableTypes";

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

export function extractDataForPlotting(calculatedTableRows: CalculatedTableRow[], hasSexRecognition: boolean) {
  const res: PlotlyInputData[] = [];
  const ages = calculatedTableRows.map((row) => `${row.startAge}-${row.endAge}`);

  let intensiveMorbidityKeys = [];
  let lowerIntensiveMorbidityKeys = [];
  let upperIntensiveMorbidityKeys = [];

  if (hasSexRecognition) {
    intensiveMorbidityKeys = [
      "menIntensiveMorbidityRussia",
      "womenIntensiveMorbidityRussia",
      "menIntensiveMorbidityChosenRegions",
      "womenIntensiveMorbidityChosenRegions",
    ];
    lowerIntensiveMorbidityKeys = [
      "menLowerIntensiveMorbidityRussia",
      "womenLowerIntensiveMorbidityRussia",
      "menLowerIntensiveMorbidityChosenRegions",
      "womenLowerIntensiveMorbidityChosenRegions",
    ];
    upperIntensiveMorbidityKeys = [
      "menUpperIntensiveMorbidityRussia",
      "womenUpperIntensiveMorbidityRussia",
      "menUpperIntensiveMorbidityChosenRegions",
      "womenUpperIntensiveMorbidityChosenRegions",
    ];
  } else {
    intensiveMorbidityKeys = ["intensiveMorbidityRussia", "intensiveMorbidityChosenRegions"];

    lowerIntensiveMorbidityKeys = ["lowerIntensiveMorbidityRussia", "lowerIntensiveMorbidityChosenRegions"];
    upperIntensiveMorbidityKeys = ["upperIntensiveMorbidityRussia", "upperIntensiveMorbidityChosenRegions"];
  }
  // for (const key of intensiveMorbidityKeys) {
  for (let i = 0; i < intensiveMorbidityKeys.length; ++i) {
    const intensiveMorbidityKey = intensiveMorbidityKeys[i];
    const lowerIntensiveMorbidityKey = lowerIntensiveMorbidityKeys[i];
    const upperIntensiveMorbidityKey = upperIntensiveMorbidityKeys[i];

    const intensiveMorbidities: number[] = [];
    const lowerIntensiveMorbidities: number[] = [];
    const upperIntensiveMorbidities: number[] = [];

    for (const row of calculatedTableRows) {
      intensiveMorbidities.push(row[intensiveMorbidityKey as keyof CalculatedTableRow]);
      lowerIntensiveMorbidities.push(row[lowerIntensiveMorbidityKey as keyof CalculatedTableRow]);
      upperIntensiveMorbidities.push(row[upperIntensiveMorbidityKey as keyof CalculatedTableRow]);
    }
    res.push({
      name: intensiveMorbidityKey,
      x: ages,
      y: intensiveMorbidities,
      error_y: {
        type: "data",
        array: upperIntensiveMorbidities.map((upper, index) => upper - intensiveMorbidities[index]),
        arrayminus: intensiveMorbidities.map((curr, index) => curr - lowerIntensiveMorbidities[index]),
        visible: true,
        color: "black",
      },
      type: "bar",
    });
  }
  return res;
}
