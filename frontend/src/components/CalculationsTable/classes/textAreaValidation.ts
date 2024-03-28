import { EpidTextArea, EpidTextAreaSplitted } from "../textAreaTypes";

class TextAreaValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TextAreaValidationException";
  }
}

class TextAreaValidationBlankLineException extends TextAreaValidationException {
  constructor() {
    super("there should be no blank lines in a text area");
    this.name = "TextAreaValidationBlankLineException";
  }
}

class TextAreaValidationNaNException extends TextAreaValidationException {
  constructor(elem: string) {
    super(`${elem} is not a number`);
    this.name = "TextAreaValidationNaNException";
  }
}

class TextAreaValidationNegativeValueException extends TextAreaValidationException {
  constructor(elem: string) {
    super(`${elem} is not a non-negative number`);
    this.name = "TextAreaValidationNegativeValueException";
  }
}

class TextAreaValidationNonIntegerException extends TextAreaValidationException {
  constructor(elem: string) {
    super(`${elem} is not an integer`);
    this.name = "TextAreaValidationNonIntegerException";
  }
}

class TextAreaValidationEmptyException extends TextAreaValidationException {
  constructor() {
    super("text area is empty");
    this.name = "TextAreaValidationEmptyException";
  }
}

class TextAreaValidationOutOfBoundsException extends TextAreaValidationException {
  constructor(elem: string) {
    super(`${elem} is out of bounds`);
    this.name = "TextAreaValidationOutOfBoundsException";
  }
}

export class TextAreaValidation {
  validate(textArea: EpidTextArea | EpidTextAreaSplitted) {
    const textAreaSplitted = Array.isArray(textArea.content)
      ? textArea.content
      : textArea.content.trimEnd().split(textArea.delimSymbol);

    if (!textAreaSplitted.length) {
      throw new TextAreaValidationEmptyException();
    }
    for (const elem of textAreaSplitted) {
      if (!elem.trim()) {
        throw new TextAreaValidationBlankLineException();
      }
      if (isNaN(+elem)) {
        throw new TextAreaValidationNaNException(elem);
      }
      if (+elem < 0) {
        throw new TextAreaValidationNegativeValueException(elem);
      }
      if (textArea.restrictions.allowOnlyIntegers && !Number.isInteger(+elem)) {
        throw new TextAreaValidationNonIntegerException(elem);
      }
      if (textArea.restrictions.upperBound && +elem > textArea.restrictions.upperBound) {
        throw new TextAreaValidationOutOfBoundsException(elem);
      }
    }
  }
}
