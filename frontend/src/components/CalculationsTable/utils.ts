import {
  textAreaTitlesAgeEndChecked,
  textAreaTitlesAllChecked,
  textAreaTitlesAllUnchecked,
  textAreaTitlesSexRecognitionChecked,
  upperYearBound,
} from "../../constants";
import {
  CalculatedSexRecognitionTableRow,
  CalculatedTableRow,
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

    if (!this.#textAreas.has("Конечный возраст")) {
      const startAges = this.#textAreas.get("Начальный возраст")!; // #checkTitles should be called beforehand
      const endAges: string[] = [];
      for (let i = 1; i < startAges.length; ++i) {
        endAges.push(String(+startAges[i] - 1));
      }
      endAges.push(String(upperYearBound));
      this.#textAreas.set("Конечный возраст", endAges);
    }

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
    console.log(this.#tableRowsFromTextAreas);
  }

  calculate() {
    const res = [] as CalculatedTableRow[];

    for (const row of this.#tableRowsFromTextAreas) {
      const obj = {} as CalculatedTableRow;
      const k1 = (obj["startAge"] = +row["Начальный возраст"]);
      const k2 = (obj["endAge"] = +row["Конечный возраст"]);

      // console.log(k1, k2);

      obj["populationRussia"] = this.#population.n(k1, k2);

      obj["morbidityRussia"] = this.getMorbidity(k1, k2);
      obj["intensiveMorbidityRussia"] = this.getIntensiveMorbidity(k1, k2);
      obj["lowerIntensiveMorbidityRussia"] = this.getLowerIntensiveMorbidity();
      obj["upperIntensiveMorbidityRussia"] = this.getUpperIntensiveMorbidity();

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
      obj["lowerIntensiveMorbidityChosenRegions"] =
        this.getLowerIntensiveMorbidity();
      obj["upperIntensiveMorbidityChosenRegions"] =
        this.getUpperIntensiveMorbidity();

      if (this.#hasSexRecognition) {
        (obj as CalculatedSexRecognitionTableRow)["menPopulationRussia"] =
          this.#population.n(k1, k2, "male");
        (obj as CalculatedSexRecognitionTableRow)["menMorbidityRussia"] =
          this.getMorbidity(k1, k2, "male");
        (obj as CalculatedSexRecognitionTableRow)[
          "menIntensiveMorbidityRussia"
        ] = this.getIntensiveMorbidity(k1, k2, "male");
        (obj as CalculatedSexRecognitionTableRow)[
          "menLowerIntensiveMorbidityRussia"
        ] = this.getLowerIntensiveMorbidity();
        (obj as CalculatedSexRecognitionTableRow)[
          "menUpperIntensiveMorbidityRussia"
        ] = this.getUpperIntensiveMorbidity();

        (obj as CalculatedSexRecognitionTableRow)["womenPopulationRussia"] =
          this.#population.n(k1, k2, "female");
        (obj as CalculatedSexRecognitionTableRow)["womenMorbidityRussia"] =
          this.getMorbidity(k1, k2, "female");
        (obj as CalculatedSexRecognitionTableRow)[
          "womenIntensiveMorbidityRussia"
        ] = this.getIntensiveMorbidity(k1, k2, "female");
        (obj as CalculatedSexRecognitionTableRow)[
          "womenLowerIntensiveMorbidityRussia"
        ] = this.getLowerIntensiveMorbidity();
        (obj as CalculatedSexRecognitionTableRow)[
          "womenUpperIntensiveMorbidityRussia"
        ] = this.getUpperIntensiveMorbidity();

        (obj as CalculatedSexRecognitionTableRow)[
          "menPopulationChosenRegions"
        ] = this.#population.n(k1, k2, "male", this.#regionCodes);
        (obj as CalculatedSexRecognitionTableRow)["menMorbidityChosenRegions"] =
          this.getMorbidity(k1, k2, "male", this.#regionCodes);
        (obj as CalculatedSexRecognitionTableRow)[
          "menIntensiveMorbidityChosenRegions"
        ] = this.getIntensiveMorbidity(k1, k2, "male", this.#regionCodes);
        (obj as CalculatedSexRecognitionTableRow)[
          "menLowerIntensiveMorbidityChosenRegions"
        ] = this.getLowerIntensiveMorbidity();
        (obj as CalculatedSexRecognitionTableRow)[
          "menUpperIntensiveMorbidityChosenRegions"
        ] = this.getUpperIntensiveMorbidity();

        (obj as CalculatedSexRecognitionTableRow)[
          "womenPopulationChosenRegions"
        ] = this.#population.n(k1, k2, "female", this.#regionCodes);
        (obj as CalculatedSexRecognitionTableRow)[
          "womenMorbidityChosenRegions"
        ] = this.getMorbidity(k1, k2, "female", this.#regionCodes);
        (obj as CalculatedSexRecognitionTableRow)[
          "womenIntensiveMorbidityChosenRegions"
        ] = this.getIntensiveMorbidity(k1, k2, "female", this.#regionCodes);
        (obj as CalculatedSexRecognitionTableRow)[
          "womenLowerIntensiveMorbidityChosenRegions"
        ] = this.getLowerIntensiveMorbidity();
        (obj as CalculatedSexRecognitionTableRow)[
          "womenUpperIntensiveMorbidityChosenRegions"
        ] = this.getUpperIntensiveMorbidity();
      }
      res.push(obj);
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
    switch (m) {
      case "male":
        if (regionCodes) {
          return +(res as TableRowFromTextAreasAllChecked)[
            "Число заболевших (мужчины, выбран. регионы)"
          ]!;
        } else {
          return +(res as TableRowFromTextAreasAllChecked)[
            "Число заболевших (мужчины, Россия)"
          ]!;
        }
      case "female":
        if (regionCodes) {
          return +(res as TableRowFromTextAreasAllChecked)[
            "Число заболевших (женщины, выбран. регионы)"
          ]!;
        } else {
          return +(res as TableRowFromTextAreasAllChecked)[
            "Число заболевших (женщины, Россия)"
          ]!;
        }
      default:
        if (regionCodes) {
          return +(res as TableRowFromTextAreasAgeEndChecked)[
            "Число заболевших (выбран. регионы)"
          ]!;
        } else {
          return +(res as TableRowFromTextAreasAgeEndChecked)[
            "Число заболевших (Россия)"
          ]!;
        }
    }
  }

  getIntensiveMorbidity(
    k1: number,
    k2: number,
    m?: Sex,
    regionCodes?: string[] // if regionCodes are not passed, assume that we take whole Russia
  ) {
    const a = this.getMorbidity(k1, k2, m, regionCodes);
    const n = this.#population.n(k1, k2, m, regionCodes); // total population in the chosen group
    return +((10 ** 5 * a) / n).toFixed(2);
  }

  getLowerIntensiveMorbidity() {
    return 0;
  }

  getUpperIntensiveMorbidity() {
    return 0;
  }

  getStandardizedIntensiveMorbidity() {
    return 0;
  }
}
