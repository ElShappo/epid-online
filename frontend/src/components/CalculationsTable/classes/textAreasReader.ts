import { upperYearBound } from "../../../constants";
import { textAreaVariations } from "../textAreaConstants";
import { TextAreaDataIndex, EpidTextAreaSplitted, EpidTextArea, InputMode } from "../textAreaTypes";
import { TextAreaReader } from "./textAreaReader";
import { TextAreasValidation } from "./textAreasValidation";

export class TextAreasReader {
  #textAreasSplitted: Map<TextAreaDataIndex, EpidTextAreaSplitted>;

  constructor(textAreas: Map<TextAreaDataIndex, EpidTextArea>, inputMode: InputMode) {
    const textAreasSplitted = new Map<TextAreaDataIndex, EpidTextAreaSplitted>();

    for (const [dataIndex, textArea] of textAreas.entries()) {
      const textAreaReader = new TextAreaReader(textArea);
      textAreasSplitted.set(dataIndex, textAreaReader.read());
    }

    const textAreasValidation = new TextAreasValidation();
    textAreasValidation.validate(textAreasSplitted, inputMode, false);

    this.#addAgeEnd(textAreasSplitted, inputMode);
    this.#addMorbidityRussia(textAreasSplitted, inputMode);
    this.#addMorbidityChosenRegions(textAreasSplitted, inputMode);

    this.#textAreasSplitted = textAreasSplitted;
  }

  #addAgeEnd(textAreasSplitted: Map<TextAreaDataIndex, EpidTextAreaSplitted>, inputMode: InputMode) {
    if (!inputMode.ageEnd) {
      const startAges = textAreasSplitted.get("ageStart")!;
      const endAges: string[] = [];

      for (let i = 1; i < startAges.content.length; ++i) {
        endAges.push(String(+startAges.content[i] - 1));
      }
      endAges.push(String(upperYearBound));

      textAreasSplitted.set("ageEnd", {
        ...textAreaVariations.find((textArea) => textArea.dataIndex === "ageEnd")!,
        delimSymbol: "\n", // delimSymbol can be any because this textArea doesn't actually exist
        content: endAges,
      });
    }
  }

  #addMorbidityRussia(textAreasSplitted: Map<TextAreaDataIndex, EpidTextAreaSplitted>, inputMode: InputMode) {
    if (inputMode.sexRecognition) {
      const menPopulationRussia = textAreasSplitted.get("menMorbidityRussia")!;
      const womenPopulationRussia = textAreasSplitted.get("womenMorbidityRussia")!;

      const populationRussia: string[] = [];
      for (let i = 0; i < menPopulationRussia.content.length; ++i) {
        populationRussia.push(String(+menPopulationRussia.content[i] + +womenPopulationRussia.content[i]));
      }
      textAreasSplitted.set("morbidityRussia", {
        ...textAreaVariations.find((textArea) => textArea.dataIndex === "morbidityRussia")!,
        delimSymbol: "\n", // delimSymbol can be any because this textArea doesn't actually exist
        content: populationRussia,
      });
    }
  }

  #addMorbidityChosenRegions(textAreasSplitted: Map<TextAreaDataIndex, EpidTextAreaSplitted>, inputMode: InputMode) {
    if (inputMode.sexRecognition) {
      const menPopulationChosenRegions = textAreasSplitted.get("menMorbidityChosenRegions")!;
      const womenPopulationChosenRegions = textAreasSplitted.get("womenMorbidityChosenRegions")!;

      const populationChosenRegions: string[] = [];
      for (let i = 0; i < menPopulationChosenRegions.content.length; ++i) {
        populationChosenRegions.push(
          String(+menPopulationChosenRegions.content[i] + +womenPopulationChosenRegions.content[i])
        );
      }
      textAreasSplitted.set("morbidityChosenRegions", {
        ...textAreaVariations.find((textArea) => textArea.dataIndex === "morbidityChosenRegions")!,
        delimSymbol: "\n", // delimSymbol can be any because this textArea doesn't actually exist
        content: populationChosenRegions,
      });
    }
  }

  read() {
    return this.#textAreasSplitted;
  }
}
