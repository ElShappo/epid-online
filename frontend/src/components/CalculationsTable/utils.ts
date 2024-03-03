import {
  TextAreaTitle,
  textAreaTitlesAgeEndChecked,
  textAreaTitlesAllChecked,
  textAreaTitlesAllUnchecked,
  textAreaTitlesGenderRecognitionChecked,
  upperYearBound,
} from "../../constants";
import { PopulationSingleRecord, TextAreaContentMeta } from "../../types";

class TextAreaReaderException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TextAreaReaderException";
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

class TextAreaReaderOutOfBoundsException extends TextAreaReaderException {
  constructor(elem: string) {
    super(`${elem} is out of bounds`);
    this.name = "TextAreaReaderOutOfBoundsException";
  }
}

class TextAreaReader {
  #textAreaSplitted: string[];

  #validate(allowOnlyIntegers: boolean, upperBound: number | null | undefined) {
    for (const elem of this.#textAreaSplitted) {
      if (isNaN(+elem)) {
        throw new TextAreaReaderNaNException(elem);
      }
      if (+elem < 0) {
        throw new TextAreaReaderNegativeValueException(elem);
      }
      if (allowOnlyIntegers && !Number.isInteger(elem)) {
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
    this.#textAreaSplitted = textAreaContent.split(delimSymbol);
    this.#validate(allowOnlyIntegers, upperBound);
  }

  read() {
    return this.#textAreaSplitted;
  }
}

class EpidCalculatorException extends Error {
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

class EpidCalculatorInternalLogicException extends EpidCalculatorException {
  constructor() {
    super("something really bad happened");
    this.name = "EpidCalculatorInternalLogicException";
  }
}

export class EpidCalculator {
  #textAreas: Map<TextAreaTitle, string[]>;
  #population: PopulationSingleRecord[];

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
    const titlesGenderRecognitionChecked = new Set(
      textAreaTitlesGenderRecognitionChecked
    );

    if (
      !shallowCompareSets(currTitles, titlesAllChecked) &&
      !shallowCompareSets(currTitles, titlesAllUnchecked) &&
      !shallowCompareSets(currTitles, titlesAgeEndChecked) &&
      !shallowCompareSets(currTitles, titlesGenderRecognitionChecked)
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
        if (startAges[i] <= startAges[i - 1]) {
          throw new EpidCalculatorAgeException();
        }
      }
    } else {
      for (let i = 0; i < startAges.length; ++i) {
        if (startAges[i] > endAges[i]) {
          throw new EpidCalculatorAgeException();
        }
      }
    }
  }

  constructor(
    textAreas: Map<TextAreaTitle, TextAreaContentMeta>,
    population: PopulationSingleRecord[]
  ) {
    this.#textAreas = new Map();
    this.#population = population;

    for (const [title, contentMeta] of textAreas.entries()) {
      const textAreaReader = new TextAreaReader(
        contentMeta.content,
        contentMeta.delimSymbol,
        contentMeta.allowOnlyIntegers,
        contentMeta.upperBound
      );
      this.#textAreas.set(title, textAreaReader.read());
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
  }

  getStandardizedIntensiveMorbidity() {}
}
