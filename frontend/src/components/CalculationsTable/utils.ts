import {
  calculationsPrecision,
  defaultP,
  textAreaTitlesAgeEndChecked,
  textAreaTitlesAllChecked,
  textAreaTitlesAllUnchecked,
  textAreaTitlesSexRecognitionChecked,
  upperYearBound,
} from "../../constants";
import {
  CalculatedNoSexRecognitionTableRow,
  CalculatedSexRecognitionTableRow,
  CalculatedTableRow,
  PlotlyInputData,
  Sex,
  TableRowFromTextAreas,
  TableRowFromTextAreasAgeEndChecked,
  TableRowFromTextAreasAllChecked,
  TextAreaContentMeta,
  TextAreaTitle,
  TextAreaTitleAgeEndChecked,
  TextAreaTitleAllChecked,
} from "../../types";
import { PopulationSingleYear } from "../../utils";
import quantile from "@stdlib/stats/base/dists/chisquare/quantile";

class TextAreaReaderException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TextAreaReaderException";
  }
}

class TextAreaReaderBlankLineException extends TextAreaReaderException {
  constructor() {
    super("there should be no blank lines in a text area");
    this.name = "TextAreaReaderBlankLineException";
  }
}

class TextAreaReaderNaNException extends TextAreaReaderException {
  constructor(elem: string) {
    super(`${elem} is not a number`);
    this.name = "TextAreaReaderNaNException";
  }
}

class TextAreaReaderNegativeValueException extends TextAreaReaderException {
  constructor(elem: string) {
    super(`${elem} is not a non-negative number`);
    this.name = "TextAreaReaderNegativeValueException";
  }
}

class TextAreaReaderNonIntegerException extends TextAreaReaderException {
  constructor(elem: string) {
    super(`${elem} is not an integer`);
    this.name = "TextAreaReaderNonIntegerException";
  }
}

class TextAreaReaderEmptyException extends TextAreaReaderException {
  constructor() {
    super("text area is empty");
    this.name = "TextAreaReaderEmptyException";
  }
}

class TextAreaReaderOutOfBoundsException extends TextAreaReaderException {
  constructor(elem: string) {
    super(`${elem} is out of bounds`);
    this.name = "TextAreaReaderOutOfBoundsException";
  }
}

class TextAreaReader {
  #textAreaSplitted: string[];

  #validate(allowOnlyIntegers: boolean, upperBound: number | null | undefined) {
    console.warn(this.#textAreaSplitted);
    if (!this.#textAreaSplitted.length) {
      throw new TextAreaReaderEmptyException();
    }
    for (const elem of this.#textAreaSplitted) {
      if (!elem.trim()) {
        throw new TextAreaReaderBlankLineException();
      }
      if (isNaN(+elem)) {
        throw new TextAreaReaderNaNException(elem);
      }
      if (+elem < 0) {
        throw new TextAreaReaderNegativeValueException(elem);
      }
      if (allowOnlyIntegers && !Number.isInteger(+elem)) {
        throw new TextAreaReaderNonIntegerException(elem);
      }
      if (upperBound && +elem > upperBound) {
        throw new TextAreaReaderOutOfBoundsException(elem);
      }
    }
  }

  constructor(
    textAreaContent: string,
    delimSymbol: string,
    allowOnlyIntegers: boolean,
    upperBound: number | null | undefined
  ) {
    this.#textAreaSplitted = [];
    const trimmed = textAreaContent.trimEnd();
    if (trimmed) {
      this.#textAreaSplitted = trimmed.split(delimSymbol);
    }
    this.#validate(allowOnlyIntegers, upperBound);
  }

  read() {
    return this.#textAreaSplitted;
  }
}

export class EpidCalculatorException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EpidCalculatorException";
  }
}

class EpidCalculatorDimensionsException extends EpidCalculatorException {
  constructor() {
    super("number of elements in textAreas in not the same");
    this.name = "EpidCalculatorDimensionsException";
  }
}

class EpidCalculatorAgeException extends EpidCalculatorException {
  constructor() {
    super("something is wrong with the age");
    this.name = "EpidCalculatorAgeException";
  }
}

class EpidCalculatorTitlesException extends EpidCalculatorException {
  constructor() {
    super("unsupported set of titles has been passed");
    this.name = "EpidCalculatorTitlesException";
  }
}

class EpidCalculatorMorbidityException extends EpidCalculatorException {
  constructor() {
    super("could not get morbidity");
    this.name = "EpidCalculatorMorbidityException";
  }
}

class EpidCalculatorReaderException extends EpidCalculatorException {
  constructor(message: string) {
    super(message);
    this.name = "EpidCalculatorReaderException";
  }
}

export class EpidCalculator {
  #textAreas: Map<TextAreaTitle, string[]>;
  #regionCodes: string[];
  #population: PopulationSingleYear;
  #tableRowsFromTextAreas: TableRowFromTextAreas[]; // another way of representing data from text areas
  #hasSexRecognition: boolean;
  #calculatedTableRows: CalculatedTableRow[] = [];

  // check that titles are in the correct configuration
  // (i.e they are in one of 4 available states which are determined by the checked options in the checkbox)
  #checkTitles() {
    function shallowCompareSets(set1: Set<any>, set2: Set<any>) {
      if (
        set1.size !== set2.size ||
        ![...set1].every((elem) => set2.has(elem))
      ) {
        return false;
      }
      return true;
    }
    const currTitles = new Set(this.#textAreas.keys());

    const titlesAllChecked = new Set(textAreaTitlesAllChecked);
    const titlesAllUnchecked = new Set(textAreaTitlesAllUnchecked);
    const titlesAgeEndChecked = new Set(textAreaTitlesAgeEndChecked);
    const titlesSexRecognitionChecked = new Set(
      textAreaTitlesSexRecognitionChecked
    );

    if (
      !shallowCompareSets(currTitles, titlesAllChecked) &&
      !shallowCompareSets(currTitles, titlesAllUnchecked) &&
      !shallowCompareSets(currTitles, titlesAgeEndChecked) &&
      !shallowCompareSets(currTitles, titlesSexRecognitionChecked)
    ) {
      throw new EpidCalculatorTitlesException();
    }
  }

  // check that each textArea has the same amount of numbers
  #checkSameLength() {
    const lengths = new Set(
      Array.from(this.#textAreas.values()).map((content) => content.length)
    );
    if (lengths.size != 1) {
      throw new EpidCalculatorDimensionsException();
    }
  }

  // if only ageStart is present, make sure that these ages are listed in a strictly increasing order
  // otherwise (i.e. when ageEnd is also present), make sure that every endAge >= startAge
  #checkAges() {
    const startAges = this.#textAreas.get("Начальный возраст")!; // #checkTitles should be called beforehand
    const endAges = this.#textAreas.get("Конечный возраст");

    if (!endAges) {
      for (let i = 1; i < startAges.length; ++i) {
        if (+startAges[i] <= +startAges[i - 1]) {
          throw new EpidCalculatorAgeException();
        }
      }
    } else {
      for (let i = 0; i < startAges.length; ++i) {
        if (+startAges[i] > +endAges[i]) {
          throw new EpidCalculatorAgeException();
        }
      }
    }
  }

  // epidCalculator depends on the data received from the text areas
  // however: "Конечный возраст", "Число заболевших (Россия)", "Число заболевших (выбран. регионы)" cols might not be present

  // "Конечный возраст" is not present when ageEnd was not checked by user
  // "Число заболевших (Россия)", "Число заболевших (выбран. регионы)" are absent when there is a sex recognition set by user

  // Still, we might need these cols in the future (for example, to show them later in the table or to plot them)
  // that's why we have to manually add these cols if they haven't existed previously
  #addLackingColumns() {
    if (!this.#textAreas.has("Конечный возраст")) {
      const startAges = this.#textAreas.get("Начальный возраст")!; // #checkTitles should be called beforehand
      const endAges: string[] = [];
      for (let i = 1; i < startAges.length; ++i) {
        endAges.push(String(+startAges[i] - 1));
      }
      endAges.push(String(upperYearBound));
      this.#textAreas.set("Конечный возраст", endAges);
    }

    if (!this.#textAreas.has("Число заболевших (Россия)")) {
      const menPopulationRussia = this.#textAreas.get(
        "Число заболевших (мужчины, Россия)"
      )!;
      const womenPopulationRussia = this.#textAreas.get(
        "Число заболевших (женщины, Россия)"
      )!;

      const populationRussia: string[] = [];
      for (let i = 0; i < menPopulationRussia.length; ++i) {
        populationRussia.push(
          String(+menPopulationRussia[i] + +womenPopulationRussia[i])
        );
      }
      this.#textAreas.set("Число заболевших (Россия)", populationRussia);
    }

    if (!this.#textAreas.has("Число заболевших (выбран. регионы)")) {
      const menPopulationChosenRegions = this.#textAreas.get(
        "Число заболевших (мужчины, выбран. регионы)"
      )!;
      const womenPopulationChosenRegions = this.#textAreas.get(
        "Число заболевших (женщины, выбран. регионы)"
      )!;

      const populationChosenRegions: string[] = [];
      for (let i = 0; i < menPopulationChosenRegions.length; ++i) {
        populationChosenRegions.push(
          String(
            +menPopulationChosenRegions[i] + +womenPopulationChosenRegions[i]
          )
        );
      }
      this.#textAreas.set(
        "Число заболевших (выбран. регионы)",
        populationChosenRegions
      );
    }
  }

  constructor(
    textAreas: Map<TextAreaTitle, TextAreaContentMeta>,
    population: PopulationSingleYear,
    regionCodes: string[]
  ) {
    this.#textAreas = new Map();
    this.#population = population;
    this.#regionCodes = regionCodes;

    try {
      for (const [title, contentMeta] of textAreas.entries()) {
        const textAreaReader = new TextAreaReader(
          contentMeta.content,
          contentMeta.delimSymbol,
          contentMeta.allowOnlyIntegers,
          contentMeta.upperBound
        );
        this.#textAreas.set(title, textAreaReader.read());
      }
    } catch (error) {
      throw new EpidCalculatorReaderException(
        (error as TextAreaReaderException).message
      );
    }

    this.#checkTitles();
    this.#checkSameLength();
    this.#checkAges();

    this.#addLackingColumns();

    if (this.#textAreas.has("Число заболевших (женщины, Россия)")) {
      this.#hasSexRecognition = true;
    } else {
      this.#hasSexRecognition = false;
    }

    this.#tableRowsFromTextAreas = [];

    for (let i = 0; i < this.#textAreas.get("Конечный возраст")!.length; ++i) {
      const obj = {} as TableRowFromTextAreas;

      if (this.#hasSexRecognition) {
        for (const key of this.#textAreas.keys() as IterableIterator<TextAreaTitleAllChecked>) {
          (obj as TableRowFromTextAreasAllChecked)[key] =
            this.#textAreas.get(key)![i];
        }
      } else {
        for (const key of this.#textAreas.keys() as IterableIterator<TextAreaTitleAgeEndChecked>) {
          (obj as TableRowFromTextAreasAgeEndChecked)[key] =
            this.#textAreas.get(key)![i];
        }
      }
      this.#tableRowsFromTextAreas.push(obj);
    }
    // console.log(this.#tableRowsFromTextAreas);
  }

  calculateTable() {
    if (this.#calculatedTableRows.length) {
      return this.#calculatedTableRows;
    }
    const res = [] as CalculatedTableRow[];

    for (const row of this.#tableRowsFromTextAreas) {
      const obj = {} as CalculatedTableRow;
      const k1 = (obj["startAge"] = +row["Начальный возраст"]);
      const k2 = (obj["endAge"] = +row["Конечный возраст"]);

      // console.log(k1, k2);

      obj["populationRussia"] = this.#population.n(k1, k2);

      obj["morbidityRussia"] = this.getMorbidity(k1, k2);
      obj["intensiveMorbidityRussia"] = this.getIntensiveMorbidity(k1, k2);

      const intensiveMorbidityRussiaCI =
        this.getIntensiveMorbidityConfidenceInterval(k1, k2);

      obj["lowerIntensiveMorbidityRussia"] = intensiveMorbidityRussiaCI[0];
      obj["upperIntensiveMorbidityRussia"] = intensiveMorbidityRussiaCI[1];

      obj["populationChosenRegions"] = this.#population.n(
        k1,
        k2,
        undefined,
        this.#regionCodes
      );
      obj["morbidityChosenRegions"] = this.getMorbidity(
        k1,
        k2,
        undefined,
        this.#regionCodes
      );
      obj["intensiveMorbidityChosenRegions"] = this.getIntensiveMorbidity(
        k1,
        k2,
        undefined,
        this.#regionCodes
      );

      const intensiveMorbidityChosenRegionsCI =
        this.getIntensiveMorbidityConfidenceInterval(
          k1,
          k2,
          undefined,
          this.#regionCodes
        );

      obj["lowerIntensiveMorbidityChosenRegions"] =
        intensiveMorbidityChosenRegionsCI[0];
      obj["upperIntensiveMorbidityChosenRegions"] =
        intensiveMorbidityChosenRegionsCI[1];

      if (this.#hasSexRecognition) {
        (obj as CalculatedSexRecognitionTableRow)["menPopulationRussia"] =
          this.#population.n(k1, k2, "male");
        (obj as CalculatedSexRecognitionTableRow)["menMorbidityRussia"] =
          this.getMorbidity(k1, k2, "male");
        (obj as CalculatedSexRecognitionTableRow)[
          "menIntensiveMorbidityRussia"
        ] = this.getIntensiveMorbidity(k1, k2, "male");

        const menIntensiveMorbidityRussiaCI =
          this.getIntensiveMorbidityConfidenceInterval(k1, k2, "male");

        (obj as CalculatedSexRecognitionTableRow)[
          "menLowerIntensiveMorbidityRussia"
        ] = menIntensiveMorbidityRussiaCI[0];
        (obj as CalculatedSexRecognitionTableRow)[
          "menUpperIntensiveMorbidityRussia"
        ] = menIntensiveMorbidityRussiaCI[1];

        (obj as CalculatedSexRecognitionTableRow)["womenPopulationRussia"] =
          this.#population.n(k1, k2, "female");
        (obj as CalculatedSexRecognitionTableRow)["womenMorbidityRussia"] =
          this.getMorbidity(k1, k2, "female");
        (obj as CalculatedSexRecognitionTableRow)[
          "womenIntensiveMorbidityRussia"
        ] = this.getIntensiveMorbidity(k1, k2, "female");

        const womenIntensiveMorbidityRussiaCI =
          this.getIntensiveMorbidityConfidenceInterval(k1, k2, "female");

        (obj as CalculatedSexRecognitionTableRow)[
          "womenLowerIntensiveMorbidityRussia"
        ] = womenIntensiveMorbidityRussiaCI[0];
        (obj as CalculatedSexRecognitionTableRow)[
          "womenUpperIntensiveMorbidityRussia"
        ] = womenIntensiveMorbidityRussiaCI[1];

        (obj as CalculatedSexRecognitionTableRow)[
          "menPopulationChosenRegions"
        ] = this.#population.n(k1, k2, "male", this.#regionCodes);
        (obj as CalculatedSexRecognitionTableRow)["menMorbidityChosenRegions"] =
          this.getMorbidity(k1, k2, "male", this.#regionCodes);
        (obj as CalculatedSexRecognitionTableRow)[
          "menIntensiveMorbidityChosenRegions"
        ] = this.getIntensiveMorbidity(k1, k2, "male", this.#regionCodes);

        const menIntensiveMorbidityChosenRegionsCI =
          this.getIntensiveMorbidityConfidenceInterval(
            k1,
            k2,
            "male",
            this.#regionCodes
          );

        (obj as CalculatedSexRecognitionTableRow)[
          "menLowerIntensiveMorbidityChosenRegions"
        ] = menIntensiveMorbidityChosenRegionsCI[0];
        (obj as CalculatedSexRecognitionTableRow)[
          "menUpperIntensiveMorbidityChosenRegions"
        ] = menIntensiveMorbidityChosenRegionsCI[1];

        (obj as CalculatedSexRecognitionTableRow)[
          "womenPopulationChosenRegions"
        ] = this.#population.n(k1, k2, "female", this.#regionCodes);
        (obj as CalculatedSexRecognitionTableRow)[
          "womenMorbidityChosenRegions"
        ] = this.getMorbidity(k1, k2, "female", this.#regionCodes);
        (obj as CalculatedSexRecognitionTableRow)[
          "womenIntensiveMorbidityChosenRegions"
        ] = this.getIntensiveMorbidity(k1, k2, "female", this.#regionCodes);

        const womenIntensiveMorbidityChosenRegionsCI =
          this.getIntensiveMorbidityConfidenceInterval(
            k1,
            k2,
            "female",
            this.#regionCodes
          );

        (obj as CalculatedSexRecognitionTableRow)[
          "womenLowerIntensiveMorbidityChosenRegions"
        ] = womenIntensiveMorbidityChosenRegionsCI[0];
        (obj as CalculatedSexRecognitionTableRow)[
          "womenUpperIntensiveMorbidityChosenRegions"
        ] = womenIntensiveMorbidityChosenRegionsCI[1];
      }
      res.push(obj);
    }
    this.#calculatedTableRows = res;
    return res;
  }

  getRussiaMorbidity() {
    const morbiditiesRussia = this.#textAreas.get("Число заболевших (Россия)")!;
    return morbiditiesRussia.reduce((sum, curr) => sum + Number(curr), 0);
  }

  getRussiaIntensiveMorbidity() {
    const a = this.getRussiaMorbidity();
    return (10 ** 5 * a) / this.#population.n(0, upperYearBound);
  }

  getChosenRegionsMorbidity() {
    const morbiditiesChosenRegions = this.#textAreas.get(
      "Число заболевших (выбран. регионы)"
    )!;
    return morbiditiesChosenRegions.reduce(
      (sum, curr) => sum + Number(curr),
      0
    );
  }

  getChosenRegionsIntensiveMorbidity() {
    const a = this.getChosenRegionsMorbidity();
    return (
      (10 ** 5 * a) /
      this.#population.n(0, upperYearBound, undefined, this.#regionCodes)
    );
  }

  getChosenRegionsStandardizedMorbidity() {
    let res = 0;
    if (this.#hasSexRecognition) {
      for (const row of this
        .#calculatedTableRows as CalculatedSexRecognitionTableRow[]) {
        const k1 = row["startAge"];
        const k2 = row["endAge"];

        res +=
          row["menMorbidityChosenRegions"] * this.#population.h(k1, k2, "male");

        res +=
          row["womenMorbidityChosenRegions"] *
          this.#population.h(k1, k2, "female");
      }
    } else {
      for (const row of this
        .#calculatedTableRows as CalculatedNoSexRecognitionTableRow[]) {
        const k1 = row["startAge"];
        const k2 = row["endAge"];

        res += row["morbidityChosenRegions"] * this.#population.h(k1, k2);
      }
    }
    return res;
  }

  getChosenRegionsStandardizedIntensiveMorbidity() {
    let res = 0;
    if (this.#hasSexRecognition) {
      for (const row of this
        .#calculatedTableRows as CalculatedSexRecognitionTableRow[]) {
        const k1 = row["startAge"];
        const k2 = row["endAge"];

        res +=
          row["menIntensiveMorbidityChosenRegions"] *
          this.#population.h(k1, k2, "male");

        res +=
          row["womenIntensiveMorbidityChosenRegions"] *
          this.#population.h(k1, k2, "female");
      }
    } else {
      for (const row of this
        .#calculatedTableRows as CalculatedNoSexRecognitionTableRow[]) {
        const k1 = row["startAge"];
        const k2 = row["endAge"];

        res +=
          row["intensiveMorbidityChosenRegions"] * this.#population.h(k1, k2);
      }
    }
    return res;
  }

  getMorbidity(
    k1: number,
    k2: number,
    m?: Sex,
    regionCodes?: string[] // if regionCodes are not passed, assume that we take whole Russia
  ) {
    const res = this.#tableRowsFromTextAreas.find(
      (row) =>
        +row["Начальный возраст"] === k1 && +row["Конечный возраст"] === k2
    );
    if (!res) {
      throw new EpidCalculatorMorbidityException();
    }
    let a: number;
    switch (m) {
      case "male":
        if (regionCodes) {
          a = +(res as TableRowFromTextAreasAllChecked)[
            "Число заболевших (мужчины, выбран. регионы)"
          ]!;
        } else {
          a = +(res as TableRowFromTextAreasAllChecked)[
            "Число заболевших (мужчины, Россия)"
          ]!;
        }
        break;
      case "female":
        if (regionCodes) {
          a = +(res as TableRowFromTextAreasAllChecked)[
            "Число заболевших (женщины, выбран. регионы)"
          ]!;
        } else {
          a = +(res as TableRowFromTextAreasAllChecked)[
            "Число заболевших (женщины, Россия)"
          ]!;
        }
        break;
      default:
        if (regionCodes) {
          a = +(res as TableRowFromTextAreasAgeEndChecked)[
            "Число заболевших (выбран. регионы)"
          ]!;
        } else {
          a = +(res as TableRowFromTextAreasAgeEndChecked)[
            "Число заболевших (Россия)"
          ]!;
        }
      // console.log(res);
      // console.log(a);
    }
    return a;
  }

  getIntensiveMorbidity(
    k1: number,
    k2: number,
    m?: Sex,
    regionCodes?: string[] // if regionCodes are not passed, assume that we take whole Russia
  ) {
    const a = this.getMorbidity(k1, k2, m, regionCodes);
    const n = this.#population.n(k1, k2, m, regionCodes); // total population in the chosen group
    return +((10 ** 5 * a) / n).toFixed(calculationsPrecision);
  }

  // assume morbidity has Poisson distribution
  #getMorbidityConfidenceInterval(morbidity: number, p = defaultP) {
    const lowerBound = 0.5 * quantile(p / 2, 2 * morbidity);
    const upperBound = 0.5 * quantile(1 - p / 2, 2 * (morbidity + 1));
    return [lowerBound, upperBound];
  }

  getIntensiveMorbidityConfidenceInterval(
    k1: number,
    k2: number,
    m?: Sex,
    regionCodes?: string[], // if regionCodes are not passed, assume that we take whole Russia
    p = defaultP
  ) {
    const a = this.getMorbidity(k1, k2, m, regionCodes);
    const [lowerMorbidity, upperMorbidity] =
      this.#getMorbidityConfidenceInterval(a, p);
    const n = this.#population.n(k1, k2, m, regionCodes); // total population in the chosen group
    return [
      +((10 ** 5 * lowerMorbidity) / n).toFixed(calculationsPrecision),
      +((10 ** 5 * upperMorbidity) / n).toFixed(calculationsPrecision),
    ];
  }

  #leastSquares1D(
    x: number[],
    y: number[],
    foo: (x: number, param: number) => number,
    step = 0.01
  ): number {
    if (x.length !== y.length) {
      throw new Error("x and y should be of the same length");
    }
    let lowestDelta = Infinity;
    let res = 0;
    for (let param = step; param < 1; param += step) {
      const yModel = x.map((curr) => foo(curr, param));
      const delta = y
        .map((curr, index) => (curr - yModel[index]) ** 2)
        .reduce((sum, curr) => sum + curr, 0);
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

  #morbidityFunction(age: number, lambda: number) {
    const population = this.#population.n(age);
    return Math.round(lambda * Math.exp(-lambda * age) * population);
  }

  // morbidity data (which is typed by user) may only be available for a range of ages (not for each single age)
  // however, there might be a necessity to get such data for each single year
  // idea: having age range [t1, t2] and intensive morbidity "i"
  // assume that "i_single_year(t)" equals to "i" for each "t" from [t1, t2]
  getLambdaEstimationRussia() {
    const x = []; // x-coords
    const y = []; // y-coords

    const findRow = ((age: number) => {
      return this.#calculatedTableRows.find(
        (row) => row.startAge <= age && row.endAge >= age
      );
    }).bind(this);

    for (let i = 0; i <= upperYearBound; ++i) {
      x.push(i);
      const row = findRow(i);

      // in theory (if everything I've previously written is correct) this thing can never throw an error
      // but still it is better to check
      if (!row) {
        throw new Error("smth bad happened...");
      }
      const population = this.#population.n(i);
      y.push(Math.round((row.intensiveMorbidityRussia / 10 ** 5) * population));
    }

    console.log(x);
    console.log(y);

    return this.#leastSquares1D(x, y, this.#morbidityFunction.bind(this));
  }

  getCEstimationRussia() {
    const lambda = this.getLambdaEstimationRussia();

    const findRow = ((age: number) => {
      return this.#calculatedTableRows.find(
        (row) => row.startAge <= age && row.endAge >= age
      );
    }).bind(this);

    const cValues = [];

    for (let i = 0; i <= upperYearBound; ++i) {
      const row = findRow(i);

      // in theory (if everything I've previously written is correct) this thing can never throw an error
      // but still it is better to check
      if (!row) {
        throw new Error("smth bad happened...");
      }
      const population = this.#population.n(i);

      const cValue =
        ((row.intensiveMorbidityRussia / 10 ** 5) * population) /
        this.#morbidityFunction(i, lambda);
      cValues.push(cValue);
    }
    console.log(cValues);

    return (
      cValues
        .filter((cValue) => !isNaN(cValue) && isFinite(cValue))
        .reduce((sum, curr) => sum + curr) / cValues.length
    );
  }
}

export function extractDataForPlotting(
  calculatedTableRows: CalculatedTableRow[],
  hasSexRecognition: boolean
) {
  const res: PlotlyInputData[] = [];
  const ages = calculatedTableRows.map(
    (row) => `${row.startAge}-${row.endAge}`
  );

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
    intensiveMorbidityKeys = [
      "intensiveMorbidityRussia",
      "intensiveMorbidityChosenRegions",
    ];

    lowerIntensiveMorbidityKeys = [
      "lowerIntensiveMorbidityRussia",
      "lowerIntensiveMorbidityChosenRegions",
    ];
    upperIntensiveMorbidityKeys = [
      "upperIntensiveMorbidityRussia",
      "upperIntensiveMorbidityChosenRegions",
    ];
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
      intensiveMorbidities.push(
        row[intensiveMorbidityKey as keyof CalculatedTableRow]
      );
      lowerIntensiveMorbidities.push(
        row[lowerIntensiveMorbidityKey as keyof CalculatedTableRow]
      );
      upperIntensiveMorbidities.push(
        row[upperIntensiveMorbidityKey as keyof CalculatedTableRow]
      );
    }
    res.push({
      name: intensiveMorbidityKey,
      x: ages,
      y: intensiveMorbidities,
      error_y: {
        type: "data",
        array: upperIntensiveMorbidities.map(
          (upper, index) => upper - intensiveMorbidities[index]
        ),
        arrayminus: intensiveMorbidities.map(
          (curr, index) => curr - lowerIntensiveMorbidities[index]
        ),
        visible: true,
        color: "black",
      },
      type: "bar",
    });
  }
  return res;
}
