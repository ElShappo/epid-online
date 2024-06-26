import { calculationsPrecision, defaultP, upperYearBound } from "../../../constants";
import { Sex } from "../../../types";
import quantile from "@stdlib/stats/base/dists/chisquare/quantile";
import {
  EpidTextArea,
  EpidTextAreaSplitted,
  InputMode,
  TableRowFromTextAreas,
  TextAreaDataIndex,
} from "../types/textAreaTypes";
import { TextAreasReader } from "./textAreasReader";
import {
  CalculatedNoSexRecognitionTableRow,
  CalculatedSexRecognitionTableColumnDataIndex,
  CalculatedSexRecognitionTableRow,
  CalculatedTableColumnType,
  CalculatedTableRow,
} from "../types/calculatedTableTypes";
import { capitalize, mapRegionCodes, mapSex } from "../utils/utils";
import { PopulationSingleYear } from "../../../pages/Programs/Population/classes/PopulationSingleYear";

export class EpidCalculatorException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EpidCalculatorException";
  }
}

class EpidCalculatorMorbidityException extends EpidCalculatorException {
  constructor() {
    super("could not get morbidity");
    this.name = "EpidCalculatorMorbidityException";
  }
}

export class EpidCalculator {
  #textAreas: Map<TextAreaDataIndex, EpidTextAreaSplitted>;
  #tableRowsFromTextAreas: TableRowFromTextAreas[]; // another way of representing data from text areas

  #inputMode: InputMode;
  #regionCodes: string[];
  #population: PopulationSingleYear;

  #calculatedTableRows: CalculatedTableRow[] = [];
  #lambdaParam: number | null | undefined;
  #cParam: number | null | undefined;

  constructor(
    textAreas: Map<TextAreaDataIndex, EpidTextArea>,
    inputMode: InputMode,
    population: PopulationSingleYear,
    regionCodes: string[]
  ) {
    const textAreasReader = new TextAreasReader(textAreas, inputMode);

    this.#textAreas = textAreasReader.read();
    this.#inputMode = inputMode;
    this.#population = population;
    this.#regionCodes = regionCodes;

    this.#tableRowsFromTextAreas = [];

    for (let i = 0; i < this.#textAreas.get("ageStart")!.content.length; ++i) {
      const obj = {} as TableRowFromTextAreas;
      for (const key of this.#textAreas.keys()) {
        obj[key] = this.#textAreas.get(key)!.content[i];
      }
      this.#tableRowsFromTextAreas.push(obj);
    }
  }

  // usage example:
  // keyType = "population" sex = "male", regionCodes is not passed => returns "menPopulationRussia"
  // keyType = "population" sex = "male", regionCodes is passed => returns "menPopulationChosenRegions"
  static getCalculatedTableRowKey(keyType: CalculatedTableColumnType, sex?: Sex, regionCodes?: string[]) {
    const mappedRegionCodes = mapRegionCodes(regionCodes);
    const mappedSex = mapSex(sex);
    let res = keyType + capitalize(mappedRegionCodes);
    if (sex === "male" || sex === "female") {
      res = mappedSex + capitalize(res);
    }
    return res as CalculatedSexRecognitionTableColumnDataIndex;
  }

  calculateTable() {
    if (this.#calculatedTableRows.length) {
      return this.#calculatedTableRows;
    }
    const res = [] as CalculatedTableRow[];

    for (const row of this.#tableRowsFromTextAreas) {
      const obj = {} as CalculatedTableRow;
      const k1 = (obj["startAge"] = +row["ageStart"]);
      const k2 = (obj["endAge"] = +row["ageEnd"]);

      obj["populationRussia"] = this.#population.n(k1, k2);

      obj["morbidityRussia"] = this.#getMorbidity(k1, k2);
      obj["intensiveMorbidityRussia"] = this.#getIntensiveMorbidity(k1, k2);

      const intensiveMorbidityRussiaCI = this.#getIntensiveMorbidityConfidenceInterval(k1, k2);

      obj["lowerIntensiveMorbidityRussia"] = intensiveMorbidityRussiaCI[0];
      obj["upperIntensiveMorbidityRussia"] = intensiveMorbidityRussiaCI[1];

      obj["populationChosenRegions"] = this.#population.n(k1, k2, undefined, this.#regionCodes);
      obj["morbidityChosenRegions"] = this.#getMorbidity(k1, k2, undefined, this.#regionCodes);
      obj["intensiveMorbidityChosenRegions"] = this.#getIntensiveMorbidity(k1, k2, undefined, this.#regionCodes);

      const intensiveMorbidityChosenRegionsCI = this.#getIntensiveMorbidityConfidenceInterval(
        k1,
        k2,
        undefined,
        this.#regionCodes
      );

      obj["lowerIntensiveMorbidityChosenRegions"] = intensiveMorbidityChosenRegionsCI[0];
      obj["upperIntensiveMorbidityChosenRegions"] = intensiveMorbidityChosenRegionsCI[1];

      if (this.#inputMode.sexRecognition) {
        (obj as CalculatedSexRecognitionTableRow)["menPopulationRussia"] = this.#population.n(k1, k2, "male");
        (obj as CalculatedSexRecognitionTableRow)["menMorbidityRussia"] = this.#getMorbidity(k1, k2, "male");
        (obj as CalculatedSexRecognitionTableRow)["menIntensiveMorbidityRussia"] = this.#getIntensiveMorbidity(
          k1,
          k2,
          "male"
        );

        const menIntensiveMorbidityRussiaCI = this.#getIntensiveMorbidityConfidenceInterval(k1, k2, "male");

        (obj as CalculatedSexRecognitionTableRow)["menLowerIntensiveMorbidityRussia"] =
          menIntensiveMorbidityRussiaCI[0];
        (obj as CalculatedSexRecognitionTableRow)["menUpperIntensiveMorbidityRussia"] =
          menIntensiveMorbidityRussiaCI[1];

        (obj as CalculatedSexRecognitionTableRow)["womenPopulationRussia"] = this.#population.n(k1, k2, "female");
        (obj as CalculatedSexRecognitionTableRow)["womenMorbidityRussia"] = this.#getMorbidity(k1, k2, "female");
        (obj as CalculatedSexRecognitionTableRow)["womenIntensiveMorbidityRussia"] = this.#getIntensiveMorbidity(
          k1,
          k2,
          "female"
        );

        const womenIntensiveMorbidityRussiaCI = this.#getIntensiveMorbidityConfidenceInterval(k1, k2, "female");

        (obj as CalculatedSexRecognitionTableRow)["womenLowerIntensiveMorbidityRussia"] =
          womenIntensiveMorbidityRussiaCI[0];
        (obj as CalculatedSexRecognitionTableRow)["womenUpperIntensiveMorbidityRussia"] =
          womenIntensiveMorbidityRussiaCI[1];

        (obj as CalculatedSexRecognitionTableRow)["menPopulationChosenRegions"] = this.#population.n(
          k1,
          k2,
          "male",
          this.#regionCodes
        );
        (obj as CalculatedSexRecognitionTableRow)["menMorbidityChosenRegions"] = this.#getMorbidity(
          k1,
          k2,
          "male",
          this.#regionCodes
        );
        (obj as CalculatedSexRecognitionTableRow)["menIntensiveMorbidityChosenRegions"] = this.#getIntensiveMorbidity(
          k1,
          k2,
          "male",
          this.#regionCodes
        );

        const menIntensiveMorbidityChosenRegionsCI = this.#getIntensiveMorbidityConfidenceInterval(
          k1,
          k2,
          "male",
          this.#regionCodes
        );

        (obj as CalculatedSexRecognitionTableRow)["menLowerIntensiveMorbidityChosenRegions"] =
          menIntensiveMorbidityChosenRegionsCI[0];
        (obj as CalculatedSexRecognitionTableRow)["menUpperIntensiveMorbidityChosenRegions"] =
          menIntensiveMorbidityChosenRegionsCI[1];

        (obj as CalculatedSexRecognitionTableRow)["womenPopulationChosenRegions"] = this.#population.n(
          k1,
          k2,
          "female",
          this.#regionCodes
        );
        (obj as CalculatedSexRecognitionTableRow)["womenMorbidityChosenRegions"] = this.#getMorbidity(
          k1,
          k2,
          "female",
          this.#regionCodes
        );
        (obj as CalculatedSexRecognitionTableRow)["womenIntensiveMorbidityChosenRegions"] = this.#getIntensiveMorbidity(
          k1,
          k2,
          "female",
          this.#regionCodes
        );

        const womenIntensiveMorbidityChosenRegionsCI = this.#getIntensiveMorbidityConfidenceInterval(
          k1,
          k2,
          "female",
          this.#regionCodes
        );

        (obj as CalculatedSexRecognitionTableRow)["womenLowerIntensiveMorbidityChosenRegions"] =
          womenIntensiveMorbidityChosenRegionsCI[0];
        (obj as CalculatedSexRecognitionTableRow)["womenUpperIntensiveMorbidityChosenRegions"] =
          womenIntensiveMorbidityChosenRegionsCI[1];
      }
      res.push(obj);
    }
    this.#calculatedTableRows = res;
    return res;
  }

  getTotalMorbidity(sex?: Sex, regionCodes?: string[]) {
    const key = EpidCalculator.getCalculatedTableRowKey("morbidity", sex, regionCodes) as TextAreaDataIndex;

    const morbidities = this.#textAreas.get(key)!.content;
    return morbidities.reduce((sum, curr) => sum + Number(curr), 0);
  }

  getTotalIntensiveMorbidity(sex?: Sex, regionCodes?: string[]) {
    const a = this.getTotalMorbidity(sex, regionCodes);
    return (10 ** 5 * a) / this.#population.n(0, upperYearBound, sex, regionCodes);
  }

  getChosenRegionsStandardizedMorbidity() {
    let res = 0;
    if (this.#inputMode.sexRecognition) {
      for (const row of this.#calculatedTableRows as CalculatedSexRecognitionTableRow[]) {
        const k1 = row["startAge"];
        const k2 = row["endAge"];

        res += row["menMorbidityChosenRegions"] * this.#population.h(k1, k2, "male");
        res += row["womenMorbidityChosenRegions"] * this.#population.h(k1, k2, "female");
      }
    } else {
      for (const row of this.#calculatedTableRows as CalculatedNoSexRecognitionTableRow[]) {
        const k1 = row["startAge"];
        const k2 = row["endAge"];
        res += row["morbidityChosenRegions"] * this.#population.h(k1, k2, undefined);
      }
    }
    return res;
  }

  getChosenRegionsStandardizedIntensiveMorbidity() {
    let res = 0;
    if (this.#inputMode.sexRecognition) {
      for (const row of this.#calculatedTableRows as CalculatedSexRecognitionTableRow[]) {
        const k1 = row["startAge"];
        const k2 = row["endAge"];

        res += row["menIntensiveMorbidityChosenRegions"] * this.#population.h(k1, k2, "male");
        res += row["womenIntensiveMorbidityChosenRegions"] * this.#population.h(k1, k2, "female");
      }
    } else {
      for (const row of this.#calculatedTableRows as CalculatedNoSexRecognitionTableRow[]) {
        const k1 = row["startAge"];
        const k2 = row["endAge"];
        res += row["intensiveMorbidityChosenRegions"] * this.#population.h(k1, k2);
      }
    }
    return res;
  }

  #getMorbidity(
    k1: number,
    k2: number,
    m?: Sex,
    regionCodes?: string[] // if regionCodes are not passed, assume that we take whole Russia
  ) {
    const res = this.#tableRowsFromTextAreas.find((row) => +row["ageStart"] === k1 && +row["ageEnd"] === k2);
    if (!res) {
      throw new EpidCalculatorMorbidityException();
    }
    const key = EpidCalculator.getCalculatedTableRowKey("morbidity", m, regionCodes) as TextAreaDataIndex;
    return +res[key];
  }

  #getIntensiveMorbidity(
    k1: number,
    k2: number,
    m?: Sex,
    regionCodes?: string[] // if regionCodes are not passed, assume that we take whole Russia
  ) {
    const a = this.#getMorbidity(k1, k2, m, regionCodes);
    const n = this.#population.n(k1, k2, m, regionCodes); // total population in the chosen group
    return +((10 ** 5 * a) / n).toFixed(calculationsPrecision);
  }

  // assume morbidity has Poisson distribution
  #getMorbidityConfidenceInterval(morbidity: number, p = defaultP) {
    const lowerBound = 0.5 * quantile(p / 2, 2 * morbidity);
    const upperBound = 0.5 * quantile(1 - p / 2, 2 * (morbidity + 1));
    return [lowerBound, upperBound];
  }

  #getIntensiveMorbidityConfidenceInterval(
    k1: number,
    k2: number,
    m?: Sex,
    regionCodes?: string[], // if regionCodes are not passed, assume that we take whole Russia
    p = defaultP
  ) {
    const a = this.#getMorbidity(k1, k2, m, regionCodes);
    const [lowerMorbidity, upperMorbidity] = this.#getMorbidityConfidenceInterval(a, p);
    const n = this.#population.n(k1, k2, m, regionCodes); // total population in the chosen group
    return [
      +((10 ** 5 * lowerMorbidity) / n).toFixed(calculationsPrecision),
      +((10 ** 5 * upperMorbidity) / n).toFixed(calculationsPrecision),
    ];
  }

  #findRowWithAgeWithin(age: number) {
    return this.#calculatedTableRows.find((row) => row.startAge <= age && row.endAge >= age);
  }

  #relativeMorbidityFunction(age: number, lambda: number) {
    return lambda * Math.exp(-lambda * age);
  }

  #morbidityFunction(age: number, lambda: number) {
    const population = this.#population.n(age);
    return Math.round(this.#relativeMorbidityFunction(age, lambda) * population);
  }

  #leastSquares1D(x: number[], y: number[], foo: (x: number, param: number) => number, step = 0.01): number {
    if (x.length !== y.length) {
      throw new Error("x and y should be of the same length");
    }
    let lowestDelta = Infinity;
    let res = 0;
    for (let param = step; param < 1; param += step) {
      const yModel = x.map((curr) => foo(curr, param));
      const delta = y.map((curr, index) => (curr - yModel[index]) ** 2).reduce((sum, curr) => sum + curr, 0);
      // console.log(`lambda = ${param}, delta = ${delta}`);
      if (delta < lowestDelta) {
        console.log("ymodel =");
        console.log(yModel);
        lowestDelta = delta;
        res = param;
      }
    }
    return res;
  }

  // morbidity data (which is typed by user) may only be available for a range of ages (not for each single age)
  // however, there might be a necessity to get such data for each single year
  // idea: having age range [t1, t2] and intensive morbidity "i"
  // assume that "i_single_year(t)" equals to "i" for each "t" from [t1, t2]
  getLambdaEstimation(sex?: Sex, regionCodes?: string[]) {
    if (this.#lambdaParam) {
      return this.#lambdaParam;
    }
    const x = []; // x-coords
    const y = []; // y-coords

    for (let i = 0; i <= upperYearBound; ++i) {
      const row = this.#findRowWithAgeWithin(i);
      // in theory (if everything I've previously written is correct) this thing can only throw error
      // when a user has chosen to explicitly specify the end ages (thus some ages might be skipped)
      if (!row) {
        continue;
        // throw new Error("smth bad happened...");
      }
      x.push(i);

      const population = this.#population.n(i, i, sex, regionCodes);
      const key = EpidCalculator.getCalculatedTableRowKey("intensiveMorbidity", sex, regionCodes);
      const intensiveMorbidity = (row as CalculatedSexRecognitionTableRow)[key];
      console.warn(`key = ${key}, intensiveMorb = ${intensiveMorbidity}`);

      if (intensiveMorbidity === null || intensiveMorbidity === undefined) {
        throw new Error("wrong getLambdaEstimation usage");
      }

      const absoluteMorbidity = Math.round(intensiveMorbidity / 10 ** 5) * population;
      y.push(absoluteMorbidity);
    }

    console.log(x);
    console.log(y);

    this.#lambdaParam = this.#leastSquares1D(x, y, this.#morbidityFunction.bind(this));
    return this.#lambdaParam;
  }

  getCEstimation(sex?: Sex, regionCodes?: string[]) {
    const lambda = this.getLambdaEstimation(sex, regionCodes);

    const cValues = [];

    for (let i = 0; i <= upperYearBound; ++i) {
      const row = this.#findRowWithAgeWithin(i);

      // in theory (if everything I've previously written is correct) this thing can only throw error
      // when a user has chosen to explicitly specify the end ages (thus some ages might be skipped)
      if (!row) {
        continue;
        // throw new Error("smth bad happened...");
      }
      const population = this.#population.n(i, i, sex, regionCodes);
      const key = EpidCalculator.getCalculatedTableRowKey("intensiveMorbidity", sex, regionCodes);
      const intensiveMorbidity = (row as CalculatedSexRecognitionTableRow)[key];

      if (intensiveMorbidity === null || intensiveMorbidity === undefined) {
        throw new Error("wrong getLambdaEstimation usage");
      }

      const cValue = ((intensiveMorbidity / 10 ** 5) * population) / this.#morbidityFunction(i, lambda);
      cValues.push(cValue);
    }
    console.log(cValues);

    this.#cParam =
      cValues.filter((cValue) => !isNaN(cValue) && isFinite(cValue)).reduce((sum, curr) => sum + curr) / cValues.length;
    return this.#cParam;
  }

  getContactNumberEstimation(sex?: Sex, regionCodes?: string[]) {
    const lambda = this.getLambdaEstimation(sex, regionCodes);
    const step = 1;
    let res = 0.1;
    for (let i = 0; i < upperYearBound; i += step) {
      const flooredI = Math.floor(i);
      const row = this.#findRowWithAgeWithin(flooredI);
      if (!row) {
        continue;
      }
      const h = this.#population.h(flooredI, flooredI, sex, regionCodes);
      // res += this.#relativeMorbidityFunction(i, lambda) * h * step;
      res += Math.exp(-lambda * i) * h * step;
    }
    return 1 / res;
  }

  getAbsoluteErrorEstimation(sex?: Sex, regionCodes?: string[]) {
    const lambda = this.getLambdaEstimation(sex, regionCodes);
    const c = this.getCEstimation(sex, regionCodes);
    let error = 0;

    for (let i = 0; i <= upperYearBound; ++i) {
      const row = this.#findRowWithAgeWithin(i);
      // in theory (if everything I've previously written is correct) this thing can only throw error
      // when a user has chosen to explicitly specify the end ages (thus some ages might be skipped)
      if (!row) {
        continue;
        // throw new Error("smth bad happened...");
      }
      const population = this.#population.n(i, i, sex, regionCodes);
      const key = EpidCalculator.getCalculatedTableRowKey("intensiveMorbidity", sex, regionCodes);
      const intensiveMorbidity = (row as CalculatedSexRecognitionTableRow)[key];
      if (intensiveMorbidity === null || intensiveMorbidity === undefined) {
        throw new Error("wrong getLambdaEstimation usage");
      }

      error +=
        (Math.round(intensiveMorbidity / 10 ** 5) * population -
          this.#relativeMorbidityFunction(i, lambda) * population * c) **
        2;
    }
    return error;
  }
}
