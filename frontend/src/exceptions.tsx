import { PopulationSingleRecord } from "./types";

export class RangeValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RangeValidationError";
  }
}

export class BoundsOrderException extends RangeValidationException {
  left: number;
  right: number;

  constructor(left: number, right: number) {
    super(`Wrong bounds order: ${left} > ${right}`);

    this.name = "BoundsOrderException";
    this.left = left;
    this.right = right;
  }
}

export class PopulationSingleYearException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PopulationException";
  }
}

export class PopulationEmptyRegionsException extends PopulationSingleYearException {
  constructor() {
    super(
      "Regions are empty: please check that the setRegions() method is called beforehand"
    );
  }
}

export class SingleRecordException extends PopulationSingleYearException {
  constructor(
    populationSingleRecord: PopulationSingleRecord,
    description?: string
  ) {
    let message =
      "Error occurred within " + JSON.stringify(populationSingleRecord);
    if (description) {
      message += `: ${description}`;
    }
    super(message);
  }
}

export class YearException extends SingleRecordException {
  constructor(populationSingleRecord: PopulationSingleRecord) {
    super(populationSingleRecord, "invalid year");
  }
}
export class AgeStartException extends SingleRecordException {
  constructor(populationSingleRecord: PopulationSingleRecord) {
    super(populationSingleRecord, "invalid age start");
  }
}
export class AgeEndException extends SingleRecordException {
  constructor(populationSingleRecord: PopulationSingleRecord) {
    super(populationSingleRecord, "invalid age end");
  }
}
export class AllException extends SingleRecordException {
  constructor(populationSingleRecord: PopulationSingleRecord) {
    super(populationSingleRecord, "invalid all");
  }
}
export class AllMenException extends SingleRecordException {
  constructor(populationSingleRecord: PopulationSingleRecord) {
    super(populationSingleRecord, "invalid all men");
  }
}
export class AllWomenException extends SingleRecordException {
  constructor(populationSingleRecord: PopulationSingleRecord) {
    super(populationSingleRecord, "invalid all women");
  }
}
export class UrbanAllException extends SingleRecordException {
  constructor(populationSingleRecord: PopulationSingleRecord) {
    super(populationSingleRecord, "invalid urban all");
  }
}
export class UrbanMenException extends SingleRecordException {
  constructor(populationSingleRecord: PopulationSingleRecord) {
    super(populationSingleRecord, "invalid urban men");
  }
}
export class UrbanWomenException extends SingleRecordException {
  constructor(populationSingleRecord: PopulationSingleRecord) {
    super(populationSingleRecord, "invalid urban women");
  }
}
export class RuralAllException extends SingleRecordException {
  constructor(populationSingleRecord: PopulationSingleRecord) {
    super(populationSingleRecord, "invalid rural all");
  }
}
export class RuralMenException extends SingleRecordException {
  constructor(populationSingleRecord: PopulationSingleRecord) {
    super(populationSingleRecord, "invalid rural men");
  }
}
export class RuralWomenException extends SingleRecordException {
  constructor(populationSingleRecord: PopulationSingleRecord) {
    super(populationSingleRecord, "invalid rural women");
  }
}

export class RegionsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegionsException";
  }
}

export class EmptyRegionsException extends RegionsException {
  constructor() {
    super(
      "Regions are empty: please check that the setRegions() method is called beforehand"
    );
  }
}

export class RegionException extends RegionsException {
  regionName: string;
  regionCode: string;

  constructor(regionName: string, regionCode: string, description?: string) {
    let message = `Error occurred within region ${regionName} with code ${regionCode}`;
    if (description) {
      message += `: ${description}`;
    }
    super(message);
    this.name = "RegionException";
    this.regionName = regionName;
    this.regionCode = regionCode;
  }
}

export class RegionCodeException extends RegionException {
  constructor(regionName: string, regionCode: string) {
    super(regionName, regionCode, "region code error");
  }
}

export class RegionNameException extends RegionException {
  constructor(regionName: string, regionCode: string) {
    super(regionName, regionCode, "region name error");
  }
}
