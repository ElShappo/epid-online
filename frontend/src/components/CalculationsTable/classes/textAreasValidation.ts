import { EpidTextArea, EpidTextAreaSplitted, InputMode, TextAreaDataIndex } from "../types/textAreaTypes";
import { TextAreaValidation } from "./textAreaValidation";

export class TextAreasValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TextAreasValidationException";
  }
}

class TextAreasValidationDimensionsException extends TextAreasValidationException {
  constructor() {
    super("number of elements in textAreas in not the same");
    this.name = "TextAreasValidationDimensionsException";
  }
}

class TextAreasValidationAgeException extends TextAreasValidationException {
  constructor() {
    super("something is wrong with the age");
    this.name = "TextAreasValidationAgeException";
  }
}

export class TextAreasValidation {
  #textAreaValidation: TextAreaValidation;

  constructor() {
    this.#textAreaValidation = new TextAreaValidation();
  }
  // check that each textArea has the same amount of numbers
  #validateSameLength(textAreas: Map<TextAreaDataIndex, EpidTextArea | EpidTextAreaSplitted>) {
    const lengthsSet = new Set();
    for (const textArea of textAreas.values()) {
      lengthsSet.add(textArea.content.length);
    }
    if (lengthsSet.size != 1) {
      throw new TextAreasValidationDimensionsException();
    }
  }

  // if only ageStart is present, make sure that these ages are listed in a strictly increasing order
  // otherwise (i.e. when ageEnd is also present), make sure that every endAge >= startAge
  #validateAges(textAreas: Map<TextAreaDataIndex, EpidTextArea | EpidTextAreaSplitted>, inputMode: InputMode) {
    const startAges = textAreas.get("ageStart")!;

    if (inputMode.ageEnd) {
      const endAges = textAreas.get("ageEnd")!;
      for (let i = 0; i < startAges.content.length; ++i) {
        if (+startAges.content[i] > +endAges.content[i]) {
          throw new TextAreasValidationAgeException();
        }
      }
    } else {
      for (let i = 1; i < startAges.content.length; ++i) {
        if (+startAges.content[i] <= +startAges.content[i - 1]) {
          throw new TextAreasValidationAgeException();
        }
      }
    }
  }

  validate(
    textAreas: Map<TextAreaDataIndex, EpidTextArea | EpidTextAreaSplitted>,
    inputMode: InputMode,
    validateIndividuals = true
  ) {
    for (const textArea of textAreas.values()) {
      if (Array.isArray(textArea.content) && validateIndividuals === false) {
        break;
      }
      this.#textAreaValidation.validate(textArea);
    }
    this.#validateSameLength(textAreas);
    this.#validateAges(textAreas, inputMode);
  }
}
