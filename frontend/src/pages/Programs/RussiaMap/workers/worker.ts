import { FormattedMorbidity } from "../../../../types";
import { RussiaMapWorkerInput } from "../types/types";

import formattedMorbidity from "../../../../assets/formattedMorbidity.json";
import { plotlyMapModes } from "../../../../constants";
import { AbstractEpidCalculator } from "../classes/abstractEpidCalculator";
import { capitalizeFirstLetter, getLinearInterpolation, getRGBComponent } from "../../../../utils";
import { PopulationSingleYear } from "../../Population/classes/PopulationSingleYear";

self.onmessage = async function (e: MessageEvent<RussiaMapWorkerInput>) {
  const {
    year,
    minAge,
    maxAge,
    characteristic,
    disease,
    mapData,
    stringifiedFormOptions,
    prevStringifiedFormOptions,
    considerNullCharacteristic,
    nullRgbString,
    minRgbString,
    maxRgbString,
    minCharacteristicValue,
    maxCharacteristicValue,
  } = e.data;

  //   console.log(prevStringifiedFormOptions);
  //   console.log(stringifiedFormOptions);

  const populationSingleYear = new PopulationSingleYear(year);
  await populationSingleYear.setRegions();

  const newMapData = mapData.map((region) => {
    let R: number;
    let G: number;
    let B: number;

    let value: number;

    // this if-block is used to check whether we can memoize calculations if only color pallete has changed
    if (stringifiedFormOptions !== prevStringifiedFormOptions) {
      const ageRange = `${minAge} ; ${maxAge}`;

      const absoluteMorbidity =
        (formattedMorbidity as FormattedMorbidity)[disease]?.["2022-01-01 ; 2022-12-31"]?.[region.name!]?.[ageRange]?.[
          plotlyMapModes[0]
        ] || 0;

      // current characteristic value
      value = (formattedMorbidity as FormattedMorbidity)[disease]?.["2022-01-01 ; 2022-12-31"]?.[region.name!]?.[
        ageRange
      ]?.[String(characteristic)];

      const abstractEpidCalculator = new AbstractEpidCalculator();

      if (value === null || value === undefined) {
        switch (characteristic) {
          case "интенсивная заболеваемость на 100 тысяч": {
            const n = populationSingleYear!.n(minAge, maxAge, undefined, [region.region_code!]);
            value = abstractEpidCalculator.getIntensiveMorbidity(absoluteMorbidity, n);
            break;
          }
          case "стандартизованная абсолютная заболеваемость": {
            const h = populationSingleYear!.h(minAge, maxAge);
            value = abstractEpidCalculator.getStandardizedMorbidity([absoluteMorbidity], [h]) as number;
            break;
          }
          case "стандартизованная интенсивная на 100 тысяч заболеваемость": {
            const n = populationSingleYear!.n(minAge, maxAge, undefined, [region.region_code!]);
            const h = populationSingleYear!.h(minAge, maxAge);
            const intensiveMorbidity = abstractEpidCalculator.getIntensiveMorbidity(absoluteMorbidity, n);
            value = abstractEpidCalculator.getStandardizedMorbidity([intensiveMorbidity], [h]) as number;
            break;
          }
          case "контактное число": {
            const ageStep = 1;
            const paramStep = 0.1;

            const n = populationSingleYear!.n(minAge, maxAge, undefined, [region.region_code!]);
            const illFraction = absoluteMorbidity / n;
            const lambda = abstractEpidCalculator.getLambdaEstimation(illFraction, minAge, maxAge, ageStep, paramStep);

            const hArray = [];

            for (let i = 0; i <= 100; i += ageStep) {
              const flooredI = Math.floor(i);
              hArray.push(populationSingleYear!.h(flooredI, flooredI, undefined, [region.region_code!]));
            }

            value = abstractEpidCalculator.getContactNumber(lambda, hArray, ageStep) as number;
            break;
          }
          default: {
            value = 0;
          }
        }
      }
    } else {
      //   console.log("they are equal!");
      value = region.characteristicValue!;
    }

    if (!value && considerNullCharacteristic) {
      [R, G, B] = [
        getRGBComponent(nullRgbString, "R")!,
        getRGBComponent(nullRgbString, "G")!,
        getRGBComponent(nullRgbString, "B")!,
      ];
    } else if (value <= minCharacteristicValue || value >= maxCharacteristicValue) {
      if (value <= minCharacteristicValue) {
        [R, G, B] = [
          getRGBComponent(minRgbString, "R")!,
          getRGBComponent(minRgbString, "G")!,
          getRGBComponent(minRgbString, "B")!,
        ];
      } else {
        [R, G, B] = [
          getRGBComponent(maxRgbString, "R")!,
          getRGBComponent(maxRgbString, "G")!,
          getRGBComponent(maxRgbString, "B")!,
        ];
      }
    } else {
      const [minR, minG, minB] = [
        getRGBComponent(minRgbString, "R")!,
        getRGBComponent(minRgbString, "G")!,
        getRGBComponent(minRgbString, "B")!,
      ];

      const [maxR, maxG, maxB] = [
        getRGBComponent(maxRgbString, "R")!,
        getRGBComponent(maxRgbString, "G")!,
        getRGBComponent(maxRgbString, "B")!,
      ];

      R = getLinearInterpolation(value, minCharacteristicValue, +minR, maxCharacteristicValue, maxR);
      G = getLinearInterpolation(value, minCharacteristicValue, +minG, maxCharacteristicValue, maxG);
      B = getLinearInterpolation(value, minCharacteristicValue, +minB, maxCharacteristicValue, maxB);
    }

    const newText =
      `<b>${region.region}</b><br>${region.federal_district}<br>Общее население: ${
        region.totalPopulation ?? "нет информации"
      } ` + `<br>${capitalizeFirstLetter(characteristic)}: ${value}`;

    return { ...region, fillcolor: `rgba(${R}, ${G}, ${B}, 0.8)`, text: newText, characteristicValue: value };
  });
  postMessage(newMapData);
};
