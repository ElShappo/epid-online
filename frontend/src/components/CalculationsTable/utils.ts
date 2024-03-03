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
