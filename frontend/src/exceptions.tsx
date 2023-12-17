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

export class PopulationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegionException";
  }
}

export class RegionException extends Error {
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
