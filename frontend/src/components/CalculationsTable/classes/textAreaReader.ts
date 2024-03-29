import { EpidTextAreaSplitted, EpidTextArea } from "../types/textAreaTypes";
import { TextAreaValidation } from "./textAreaValidation";

export class TextAreaReader {
  #textAreaSplitted: EpidTextAreaSplitted;

  constructor(textArea: EpidTextArea) {
    const trimmed = textArea.content.trimEnd();
    const splitted = trimmed.split(textArea.delimSymbol);
    const textAreaSplitted = { ...textArea, content: splitted } as EpidTextAreaSplitted;

    const textAreaValidation = new TextAreaValidation();
    textAreaValidation.validate(textAreaSplitted);
    this.#textAreaSplitted = textAreaSplitted;
  }
  read() {
    return this.#textAreaSplitted;
  }
}
