import { PopulationSingleYear } from "../../../pages/Programs/Population/classes/PopulationSingleYear";
import { EpidCalculator } from "../classes/epidCalculator";
import { ModelEstimationTableColumns } from "../ModelEstimationTable";
import { WorkerInput, WorkerOutput } from "../types/textAreaTypes";
import { capitalize, mapRegionCodes, mapSex } from "../utils/utils";

self.onmessage = async function (e: MessageEvent<WorkerInput>) {
  console.log("worker is being run");
  console.log(e.data);

  const { textAreas, inputMode, sexes, year, selectedRegions } = e.data;
  const populationPerRegions = new PopulationSingleYear(year);
  await populationPerRegions.setRegions();

  const epidCalculator = new EpidCalculator(textAreas, inputMode, populationPerRegions, selectedRegions);

  const calculatedTableRows = epidCalculator.calculateTable();
  const resChosenRegionsStandardizedMorbidity = epidCalculator.getChosenRegionsStandardizedMorbidity();
  const resChosenRegionsStandardizedIntensiveMorbidity =
    epidCalculator.getChosenRegionsStandardizedIntensiveMorbidity();

  const modelEstimationTableRows: ModelEstimationTableColumns[] = [];

  let i = 0;
  for (const sex of sexes) {
    for (const regionCodes of [selectedRegions, undefined]) {
      const type = "data" + capitalize(mapSex(sex)) + capitalize(mapRegionCodes(regionCodes));

      const totalMorbidity = epidCalculator.getTotalMorbidity(sex, regionCodes);
      const totalIntensiveMorbidity = epidCalculator.getTotalIntensiveMorbidity(sex, regionCodes);

      const lambdaEstimation = epidCalculator.getLambdaEstimation(sex, regionCodes);
      const cEstimation = epidCalculator.getCEstimation(sex, regionCodes);
      const contactNumberEstimation = epidCalculator.getContactNumberEstimation(sex, regionCodes);
      const absoluteErrorEstimation = epidCalculator.getAbsoluteErrorEstimation(sex, regionCodes);

      const obj: ModelEstimationTableColumns = {
        key: String(i),
        type,
        totalMorbidity,
        totalIntensiveMorbidity,
        lambda: lambdaEstimation,
        c: cEstimation,
        contactNumber: contactNumberEstimation,
        absoluteError: absoluteErrorEstimation,
      };
      modelEstimationTableRows.push(obj);
      ++i;
    }
  }

  const workerOutput: WorkerOutput = {
    calculatedTableRows,
    resChosenRegionsStandardizedMorbidity,
    resChosenRegionsStandardizedIntensiveMorbidity,
    modelEstimationTableRows,
  };
  postMessage(workerOutput);
};
