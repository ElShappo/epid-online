import { PopulationSingleYear } from "../../utils";

class TextAreaContentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TextAreaContentException";
  }
}

class TextAreaContentNaNException extends TextAreaContentException {
  constructor(elem: string) {
    super(`${elem} is not a number`);
    this.name = "TextAreaContentNaNException";
  }
}

class TextAreaContentNegativeValueException extends TextAreaContentException {
  constructor(elem: string) {
    super(`${elem} is not a non-negative number`);
    this.name = "TextAreaContentNegativeValueException";
  }
}

class TextAreaContentNonIntegerException extends TextAreaContentException {
  constructor(elem: string) {
    super(`${elem} is not an integer`);
    this.name = "TextAreaContentNonIntegerException";
  }
}

class TextAreaContentOutOfBoundsException extends TextAreaContentException {
  constructor(elem: string) {
    super(`${elem} is out of bounds`);
    this.name = "TextAreaContentOutOfBoundsException";
  }
}

export class TextAreaContentHandler {
  #textAreaSplitted: string[];

  validate(allowOnlyIntegers: boolean, upperBound: number | null | undefined) {
    for (const elem of this.#textAreaSplitted) {
      if (isNaN(+elem)) {
        throw new TextAreaContentNaNException(elem);
      }
      if (+elem < 0) {
        throw new TextAreaContentNegativeValueException(elem);
      }
      if (allowOnlyIntegers && !Number.isInteger(elem)) {
        throw new TextAreaContentNonIntegerException(elem);
      }
      if (upperBound && +elem > upperBound) {
        throw new TextAreaContentOutOfBoundsException(elem);
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
    this.validate(allowOnlyIntegers, upperBound);
  }

  read() {
    return this.#textAreaSplitted;
  }
}

// function discretizeAgesFrom80(populationSingleYear: PopulationSingleYear) {
//   const population = populationSingleYear.getPopulation();

//   const _80UpYearOlds = population.find(
//     (record) => record.age_start === 80 && record.age_end === 199
//   );
//   const _85UpYearOlds = population.find(
//     (record) => record.age_start === 85 && record.age_end === 199
//   );

//   if (!_80UpYearOlds || !_85UpYearOlds) {
//     throw new Error("could not discretize unexisting age groups");
//   }

//   const _80To85OldsPerYearAll = Math.floor(
//     (_80UpYearOlds?.all - _85UpYearOlds.all) / 5
//   );
//   const _80To85OldsPerYearAllMen = Math.floor(
//     (_80UpYearOlds?.all_men - _85UpYearOlds.all_men) / 5
//   );
//   const _80To85OldsPerYearAllWomen = Math.floor(
//     (_80UpYearOlds?.all_women - _85UpYearOlds.all_women) / 5
//   );

//   const _80To85OldsPerYearUrbanAll = Math.floor(
//     (_80UpYearOlds?.urban_all - _85UpYearOlds.urban_all) / 5
//   );
//   const _80To85OldsPerYearUrbanMen = Math.floor(
//     (_80UpYearOlds?.urban_men - _85UpYearOlds.urban_men) / 5
//   );
//   const _80To85OldsPerYearUrbanWomen = Math.floor(
//     (_80UpYearOlds?.urban_women - _85UpYearOlds.urban_women) / 5
//   );

//   const _80To85OldsPerYearRuralAll = Math.floor(
//     (_80UpYearOlds?.rural_all - _85UpYearOlds.rural_all) / 5
//   );
//   const _80To85OldsPerYearRuralMen = Math.floor(
//     (_80UpYearOlds?.rural_men - _85UpYearOlds.rural_men) / 5
//   );
//   const _80To85OldsPerYearRuralWomen = Math.floor(
//     (_80UpYearOlds?.rural_women - _85UpYearOlds.rural_women) / 5
//   );
// }

// // get number of people of chosen age group and sex
// function n(
//   populationSingleYear: PopulationSingleYear,
//   k1: number,
//   k2?: number,
//   m?: Sex
// ) {
//   let result = 0;
//   if (!k2) {
//     k2 = k1;
//   }
//   const population = populationSingleYear.getPopulation();
//   // const _80_85 = population.find(record => record.age_start === 80 && record.age_end === 199).
//   switch (m) {
//     case "male":
//       if (k1 > 85 && k2 > 85) {
//       }
//       for (let i = k1; i <= k2; ++i) {
//         result += population.filter(
//           (record) => record.age_start === record.age_end
//         );
//       }
//   }
// }
