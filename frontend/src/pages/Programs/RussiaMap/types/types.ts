import { RussiaMapData, availableYearsType } from "../../../../types";

export type RussiaMapWorkerInput = {
  year: availableYearsType;
  minAge: number;
  maxAge: number;
  characteristic: string;
  disease: string;
  mapData: RussiaMapData[];
  stringifiedFormOptions: string;
  prevStringifiedFormOptions: string;
  considerNullCharacteristic: boolean;
  nullRgbString: string;
  minRgbString: string;
  maxRgbString: string;
  minCharacteristicValue: number;
  maxCharacteristicValue: number;
};

export type RussiaMapWorkerOutput = RussiaMapData[];
