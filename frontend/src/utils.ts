import population from "./assets/population.json";
import { upperYearBound } from "./constants";
import {
  AgeStartException,
  AllException,
  AllMenException,
  AllWomenException,
  BoundsOrderException,
  EmptyRegionsException,
  PopulationEmptyRegionsException,
  RangeValidationException,
  RegionCodeException,
  RegionCodeNotFoundException,
  RegionNameException,
  RuralAllException,
  RuralMenException,
  RuralWomenException,
  UrbanAllException,
  UrbanMenException,
  UrbanWomenException,
} from "./exceptions";
import {
  AntDesignTree,
  ChartData,
  LineColor,
  PopulationSingleRecord,
  Region,
  Sex,
  availableYearsType,
  chartsDataMode,
} from "./types";

// given an input like: 1-5, 7, 10-14
// return set of numbers from 1 to 5, 7, 10 to 14

// works with duplicates
// if number on the left is larger than number on the right (e.g. 14-10) - exception is thrown
function parsePositiveNumberRanges(input: string) {
  input = input.trim();
  const reg = /^(\d+(-|, ))*\d+$/;
  const result = new Set<number>();

  if (input.match(reg)) {
    const rangeReg = /\d+-\d+/g;
    const rangeMatches = input.match(rangeReg);

    if (rangeMatches) {
      for (const rangeMatch of rangeMatches) {
        let [left, right] = rangeMatch.match(/\d+/g) as any;

        left = +left;
        right = +right;

        if (left > right) {
          throw new BoundsOrderException(left, right);
        }

        for (let i = left; i <= right; ++i) {
          result.add(i);
        }
      }
    }
    const singleNumberReg = /(?:^| )(\d+)(?:,|$)/g;
    const singleNumberMatches = Array.from(input.matchAll(singleNumberReg));

    for (const singleNumberMatch of singleNumberMatches) {
      const num = +singleNumberMatch[1];
      result.add(num);
    }
    return result;
  }
  throw new RangeValidationException("Invalid input format");
}

export class Regions {
  #regions: Region[] | null = null;

  getRegionByName(name: string) {
    return this.#regions?.find((region) => region.territory === name);
  }
  getRegionByCode(code: string) {
    return this.#regions?.find((region) => region.territory_code === code);
  }
  getRegionCodes() {
    return this.#regions?.map((region) => region.territory_code);
  }
  async setRegions(year: availableYearsType) {
    const response = await fetch(`http://localhost:3002/regions?year=${year}`);
    this.#regions = await response.json();
    this.#checkCodes();
    this.#checkNames();
  }
  #checkCodes() {
    if (this.#regions) {
      const reg = /\d+/g; // e.g having 1.41.50 -> [1, 41, 50]
      for (const region of this.#regions) {
        const levels = region.territory_code.match(reg);
        if (!levels) {
          throw new RegionCodeException(
            region.territory,
            region.territory_code
          );
        }
      }
    } else {
      throw new EmptyRegionsException();
    }
  }
  #checkNames() {
    if (this.#regions) {
      for (const region of this.#regions) {
        if (!region.territory) {
          throw new RegionNameException(
            region.territory,
            region.territory_code
          );
        }
      }
    } else {
      throw new EmptyRegionsException();
    }
  }
  existsWithCode(code: string) {
    return Boolean(this.getRegionByCode(code));
  }
  isChildOf(possibleChildCode: string, possibleParentCode: string) {
    const reg = /\d+/g; // e.g having 1.41.50 -> [1, 41, 50]
    let parentLevels = possibleParentCode.match(reg) as string[];

    // parent has to have >= 1 zeros in its id
    // thus the idea is to remove the trailing zeros
    // and check if the childCode startsWith parentCode without these zeros
    parentLevels = parentLevels.filter((value) => value !== "0");

    const parentLevelsStringified = parentLevels.join(".");
    return possibleChildCode.startsWith(parentLevelsStringified);
  }
  getRegions() {
    return this.#regions;
  }
  hasChildren(rootCode: string) {
    const reg = /\d+/g; // e.g having 1.41.50 -> [1, 41, 50]
    const parentLevels = rootCode.match(reg) as string[];
    const firstZeroIndex = parentLevels.findIndex((level) => level === "0");
    if (firstZeroIndex === -1) {
      return false;
    }

    const possibleChildLevel = parentLevels.slice();
    possibleChildLevel[firstZeroIndex] = "1";

    return this.existsWithCode(possibleChildLevel.join("."));
  }
  getChildren(rootCode: string) {
    const reg = /\d+/g; // e.g having 1.41.50 -> [1, 41, 50]
    const parentLevels = rootCode.match(reg) as string[];

    const commonStart = parentLevels.filter((value) => value !== "0");
    const commonStartStringified = commonStart.join(".");

    const result = [];

    for (const region of this.#regions as Region[]) {
      if (
        region.territory_code !== rootCode &&
        region.territory_code.startsWith(commonStartStringified)
      ) {
        result.push(region);
      }
    }
    return result;
  }
  getDirectChildren(rootCode: string) {
    const reg = /\d+/g; // e.g having 1.41.50 -> [1, 41, 50]
    const parentLevels = rootCode.match(reg) as string[];
    const firstZeroIndex = parentLevels.findIndex((level) => level === "0");
    if (firstZeroIndex === -1) {
      return [];
    }

    const possibleChildLevel = parentLevels.slice();
    const result = [];

    let i = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      possibleChildLevel[firstZeroIndex] = `${i}`;
      const possibleChildCode = possibleChildLevel.join(".");
      if (this.existsWithCode(possibleChildCode)) {
        result.push(this.getRegionByCode(possibleChildCode));
      } else {
        break;
      }
      i += 1;
    }
    return result;
  }
  getLeafNodes(rootCode: string, includeRoot: boolean = true) {
    const result = this.getChildren(rootCode);
    if (includeRoot) {
      result.push(this.getRegionByCode(rootCode)!);
    }
    return result.filter((region) => !this.hasChildren(region.territory_code));
  }
  getAntDesignTreeSelectFormat(rootCode?: string) {
    rootCode ??= this.#regions![0].territory_code;
    // console.log(`Current rootCode: ${rootCode}`)
    const node: AntDesignTree = {
      title: this.getRegionByCode(rootCode)!.territory,
      value: rootCode,
      key: rootCode,
      children: [],
    };

    if (this.hasChildren(rootCode)) {
      // console.log(`${rootCode} does have children`)
      const children = this.getDirectChildren(rootCode) as Region[];

      for (const child of children) {
        node.children.push(
          this.getAntDesignTreeSelectFormat(child.territory_code)
        );
      }
    } else {
      // console.log(`${rootCode} doesn't have children`)
    }
    return node;
  }
  // getChildren(rootCode: string) {
  //   let reg = /\d+/g // e.g having 1.41.50 -> [1, 41, 50]
  //   let parentLevels = rootCode.match(reg) as string[]
  //   let commonStart: string[]
  //   let descendantsDepth: number

  //   const result: Region[] = []

  //   // parent has to have >= 1 zeros in its id
  //   // thus the idea is to remove the trailing zeros
  //   // and check if the childCode startsWith parentCode without these zeros

  //   // number of zeros represent the maximum descendants depth relative to the passed root
  //   // e.g.: rootCode is 1.7.0.0.0 then the descendants depth is 3 because there are 3 zeros
  //   // descendatsDepth is considered to be a maximum depth, because leaves are always present (nodes without children)
  //   // e.g.: region with code 1.7.0.0.1 definitely doesn't have any descendants, because the depth of the whole tree is 5

  //   // the algorithm's idea': the common start is defined by a rootCode without trailing zeros
  //   // there are n for loops, where n = descendantsDepth
  //   // in each loop we iterate over indices from (starting from 0) and construct new region codes
  //   // the for loop stops when we construct the code that doesn't exist
  //   descendantsDepth = parentLevels.filter(value => value === '0').length
  //   commonStart = parentLevels.filter(value => value !== '0')

  //   const commonStartStringified = commonStart.join('.')
  //   // for (let i = 0; i < descendantsDepth; ++i) {
  //   //   const delta = new Array(descendantsDepth).fill(0)

  //   //   while (true) {
  //   //     delta[i] += 1
  //   //   }
  //   // }
  // }
}

export class PopulationSingleYear {
  #population: PopulationSingleRecord[];
  #regions: Regions | undefined;
  #year: availableYearsType;

  #checkAgeStart() {
    for (const row of this.#population) {
      if (typeof row.age_start !== "number" || row.age_start < 0) {
        throw new AgeStartException(row);
      }
    }
  }
  #checkAgeEnd() {
    for (const row of this.#population) {
      if (typeof row.age_end !== "number" || row.age_end < 0) {
        throw new AgeStartException(row);
      }
    }
  }
  #checkAll() {
    for (const row of this.#population) {
      if (typeof row.all !== "number" || row.all < 0) {
        throw new AllException(row);
      }
    }
  }
  #checkAllMen() {
    for (const row of this.#population) {
      if (typeof row.all_men !== "number" || row.all_men < 0) {
        throw new AllMenException(row);
      }
    }
  }
  #checkAllWomen() {
    for (const row of this.#population) {
      if (typeof row.all_women !== "number" || row.all_women < 0) {
        throw new AllWomenException(row);
      }
    }
  }
  #checkUrbanAll() {
    for (const row of this.#population) {
      if (typeof row.urban_all !== "number" || row.urban_all < 0) {
        throw new UrbanAllException(row);
      }
    }
  }
  #checkUrbanMen() {
    for (const row of this.#population) {
      if (typeof row.urban_men !== "number" || row.urban_men < 0) {
        throw new UrbanMenException(row);
      }
    }
  }
  #checkUrbanWomen() {
    for (const row of this.#population) {
      if (typeof row.urban_women !== "number" || row.urban_women < 0) {
        throw new UrbanWomenException(row);
      }
    }
  }
  #checkRuralAll() {
    for (const row of this.#population) {
      if (typeof row.rural_all !== "number" || row.rural_all < 0) {
        throw new RuralAllException(row);
      }
    }
  }
  #checkRuralMen() {
    for (const row of this.#population) {
      if (typeof row.rural_men !== "number" || row.rural_men < 0) {
        throw new RuralMenException(row);
      }
    }
  }
  #checkRuralWomen() {
    for (const row of this.#population) {
      if (typeof row.rural_women !== "number" || row.rural_women < 0) {
        throw new RuralWomenException(row);
      }
    }
  }

  constructor(year: availableYearsType) {
    this.#year = year;
    this.#population = (population as PopulationSingleRecord[]).filter(
      (row) => row.year === this.#year
    );

    this.#checkAgeStart();
    this.#checkAgeEnd();

    this.#checkAll();
    this.#checkAllMen();
    this.#checkAllWomen();

    this.#checkUrbanAll();
    this.#checkUrbanMen();
    this.#checkUrbanWomen();

    this.#checkRuralAll();
    this.#checkRuralMen();
    this.#checkRuralWomen();
  }

  // don't forget to call this method after ctor is called!
  async setRegions() {
    this.#regions = new Regions();
    await this.#regions.setRegions(this.#year);
  }
  getYear() {
    return this.#year;
  }

  getRegions() {
    return this.#regions;
  }

  getPopulation() {
    return this.#population;
  }

  // there is no year-by-year population info for 80+ year olds
  // there are only single chunks of data for 80+ and 85+ that are available
  // (i.e. there is no year-by-year division in both of these chunks)

  // but epid-related calculations might require such year-by-year info
  // in that case we interpolate the data: to get a number of people year-by-year between 80 and 85 years,
  // we subtrack number of 80 year olds from a number of 85 year olds and divide the result by 5

  // to get number of 85+ year olds year-by-year,
  // we assume that for each subsequent year the half of the population dies (geometric progression)
  getByAge(
    regionCode: string,
    age: number
  ): PopulationSingleRecord | undefined {
    const population = this.getRegionPopulation(regionCode);
    if (!population.length) {
      throw new RegionCodeNotFoundException("", regionCode);
    }
    const _80UpYearOlds = population.find(
      (record) => record.age_start === 80 && record.age_end === upperYearBound
    );
    const _85UpYearOlds = population.find(
      (record) => record.age_start === 85 && record.age_end === upperYearBound
    );

    if (this.#regions) {
      const regionName = this.#regions.getRegionByCode(regionCode)!.territory;

      if (age < 80) {
        return this.getPopulation().find(
          (record) =>
            record.age_start === record.age_end && record.age_start === age
        );
      } else if (age >= 80 && age < 85) {
        if (!_80UpYearOlds || !_85UpYearOlds) {
          throw new Error("could not discretize unexisting age groups");
        }

        const _80To85OldsPerYearAll = Math.floor(
          (_80UpYearOlds.all - _85UpYearOlds.all) / 5
        );
        const _80To85OldsPerYearAllMen = Math.floor(
          (_80UpYearOlds.all_men - _85UpYearOlds.all_men) / 5
        );
        const _80To85OldsPerYearAllWomen = Math.floor(
          (_80UpYearOlds.all_women - _85UpYearOlds.all_women) / 5
        );

        const _80To85OldsPerYearUrbanAll = Math.floor(
          (_80UpYearOlds.urban_all - _85UpYearOlds.urban_all) / 5
        );
        const _80To85OldsPerYearUrbanMen = Math.floor(
          (_80UpYearOlds.urban_men - _85UpYearOlds.urban_men) / 5
        );
        const _80To85OldsPerYearUrbanWomen = Math.floor(
          (_80UpYearOlds.urban_women - _85UpYearOlds.urban_women) / 5
        );

        const _80To85OldsPerYearRuralAll = Math.floor(
          (_80UpYearOlds.rural_all - _85UpYearOlds.rural_all) / 5
        );
        const _80To85OldsPerYearRuralMen = Math.floor(
          (_80UpYearOlds.rural_men - _85UpYearOlds.rural_men) / 5
        );
        const _80To85OldsPerYearRuralWomen = Math.floor(
          (_80UpYearOlds.rural_women - _85UpYearOlds.rural_women) / 5
        );

        return {
          year: this.#year,
          territory: regionName,
          territory_code: regionCode,

          age_start: age,
          age_end: age,

          all: _80To85OldsPerYearAll,
          all_men: _80To85OldsPerYearAllMen,
          all_women: _80To85OldsPerYearAllWomen,

          urban_all: _80To85OldsPerYearUrbanAll,
          urban_men: _80To85OldsPerYearUrbanMen,
          urban_women: _80To85OldsPerYearUrbanWomen,

          rural_all: _80To85OldsPerYearRuralAll,
          rural_men: _80To85OldsPerYearRuralMen,
          rural_women: _80To85OldsPerYearRuralWomen,
        };
      } else {
        if (!_80UpYearOlds || !_85UpYearOlds) {
          throw new Error("could not discretize unexisting age groups");
        }
        const numberOfDivisions = age - 85;

        const res = {
          year: this.#year,
          territory: regionName,
          territory_code: regionCode,

          age_start: age,
          age_end: age,

          all: _85UpYearOlds.all,
          all_men: _85UpYearOlds.all_men,
          all_women: _85UpYearOlds.all_women,

          urban_all: _85UpYearOlds.urban_all,
          urban_men: _85UpYearOlds.urban_men,
          urban_women: _85UpYearOlds.urban_women,

          rural_all: _85UpYearOlds.rural_all,
          rural_men: _85UpYearOlds.rural_men,
          rural_women: _85UpYearOlds.rural_women,
        };

        for (let i = 0; i < numberOfDivisions; ++i) {
          const all_delta =
            res.all_men -
            Math.floor(res.all_men / 2) +
            res.all_women -
            Math.floor(res.all_women / 2);

          res.all_men = Math.floor(res.all_men / 2);
          res.all_women = Math.floor(res.all_women / 2);
          res.all -= all_delta;

          const urban_delta =
            res.urban_men -
            Math.floor(res.urban_men / 2) +
            res.urban_women -
            Math.floor(res.urban_women / 2);

          res.urban_men = Math.floor(res.urban_men / 2);
          res.urban_women = Math.floor(res.urban_women / 2);
          res.urban_all -= urban_delta;

          const rural_delta =
            res.rural_men -
            Math.floor(res.rural_men / 2) +
            res.rural_women -
            Math.floor(res.rural_women / 2);

          res.rural_men = Math.floor(res.rural_men / 2);
          res.rural_women = Math.floor(res.rural_women / 2);
          res.rural_all -= rural_delta;
        }
        return res;
      }
    } else {
      throw new PopulationEmptyRegionsException();
    }
  }

  // get total number of people of chosen age group and sex in the chosen regions
  n(k1: number, k2?: number, m?: Sex, regionCodes?: string[]) {
    regionCodes ??= this.#regions!.getRegionCodes()!;
    let res = 0;
    if (!k2) {
      k2 = k1;
    }
    for (const regionCode of regionCodes) {
      for (let age = k1; age <= k2; ++age) {
        const curr = this.getByAge(regionCode, age);
        if (!curr) {
          throw new Error("getByAge returned nothing");
        }
        switch (m) {
          case "male":
            res += curr.all_men;
            break;
          case "female":
            res += curr.all_women;
            break;
          default:
            res += curr.all;
        }
      }
    }
    return res;
  }

  // get fraction of people of chosen age group and sex in the chosen regions
  h(k1: number, k2?: number, m?: Sex, regionCodes?: string[]) {
    regionCodes ??= this.#regions!.getRegionCodes()!;
    const totalPopulation = regionCodes
      .map((regionCode) => this.getTotalRegionPopulation(regionCode))
      .reduce((curr, sum) => sum + curr);

    return this.n(k1, k2, m, regionCodes) / totalPopulation;
  }

  getRegionPopulation(regionCode: string) {
    return this.#population
      .filter((row) => {
        return row.year === this.#year && row.territory_code === regionCode;
      })
      .sort((a, b) => a.age_start - b.age_start);
  }

  getTotalRegionPopulation(regionCode: string) {
    const regionPopulation = this.getRegionPopulation(regionCode);
    const recordWithTotalPopulation = regionPopulation.find(
      (record) => record.age_start === 0 && record.age_end === upperYearBound
    );

    if (recordWithTotalPopulation) {
      return recordWithTotalPopulation.all;
    } else {
      let res = 0;
      for (let age = 0; age <= 79; ++age) {
        const curr = regionPopulation.find(
          (record) =>
            record.age_start === record.age_end && record.age_start === age
        )?.all;
        if (!curr) {
          throw new Error(`could not get population info about age = ${age}`);
        }
        res += curr;
      }
      const _80UpYearOlds = regionPopulation.find(
        (record) => record.age_start === 80 && record.age_end === upperYearBound
      )?.all;
      if (!_80UpYearOlds) {
        throw new Error(`80-${upperYearBound} group does not exist`);
      }
      res += _80UpYearOlds;
      return res;
    }
  }

  getAgeRanges() {
    if (this.#regions) {
      const firstRegionPopulation = this.getRegionPopulation(
        this.#regions.getRegions()![0].territory_code
      );
      return firstRegionPopulation.map((row) => {
        return {
          age_start: row.age_start,
          age_end: row.age_end,
        };
      });
    } else {
      throw new PopulationEmptyRegionsException();
    }
  }

  // get only those age ranges, where age_start equals age_end
  filterAgeRanges() {
    const rawAgeRanges = this.getAgeRanges();
    return rawAgeRanges.filter(
      (ageRange) => ageRange.age_start === ageRange.age_end
    );
  }

  getDataForCharts(rootCodes: string[], chartsMode: chartsDataMode): ChartData {
    if (this.#regions) {
      const colors: LineColor[] = [
        {
          backgroundColor: "#8390c7",
          borderColor: "#8390c7",
        },
        {
          backgroundColor: "#bf4b4b",
          borderColor: "#bf4b4b",
        },
        {
          backgroundColor: "#37a166",
          borderColor: "#37a166",
        },
        {
          backgroundColor: "#396d70",
          borderColor: "#396d70",
        },
      ];

      const pickColor = function (index: number) {
        return colors[index % colors.length];
      };

      const result = {
        labels: [],
        datasets: [],
      } as ChartData;

      let count = 0;
      for (const rootCode of rootCodes) {
        const region = this.getRegionPopulation(rootCode).filter(
          (row) => row.age_start === row.age_end
        );
        result.labels = region.map((row) => row.age_start);
        const color = pickColor(count);

        switch (chartsMode) {
          case "peoplePerAge": {
            const peopleCount = region.map((row) => row.all);
            result.datasets.push({
              data: peopleCount,
              label: this.#regions.getRegionByCode(rootCode)?.territory,
              borderColor: color.borderColor,
              backgroundColor: color.backgroundColor,
            });
            break;
          }
          case "ruralToUrban": {
            const ruralToUrban = region.map(
              (row) => row.rural_all / row.urban_all
            );
            result.datasets.push({
              data: ruralToUrban,
              label: this.#regions.getRegionByCode(rootCode)?.territory,
              borderColor: color.borderColor,
              backgroundColor: color.backgroundColor,
            });
            break;
          }
          case "womenToMen": {
            const womenToMen = region.map((row) => row.all_women / row.all_men);
            result.datasets.push({
              data: womenToMen,
              label: this.#regions.getRegionByCode(rootCode)?.territory,
              borderColor: color.borderColor,
              backgroundColor: color.backgroundColor,
            });
            break;
          }
        }
        count += 1;
      }
      return result;
    } else {
      throw new PopulationEmptyRegionsException();
    }
  }

  prettierFilteredAgeRanges() {
    return this.filterAgeRanges().map((ageRange) => ageRange.age_start);
  }

  // get the population data for root and all of its' subregions
  // the root can be defined by its code or region name
  getMergedRegions(rootCodes: string[]) {
    // get regions structure for chosen year
    if (this.#regions) {
      if (rootCodes.length === 1) {
        return this.getRegionPopulation(rootCodes[0]).map((row) => {
          return {
            ...row,
            all_proportion:
              (row.all_women / row.all_men).toFixed(2) || (0 as number),
            urban_proportion:
              (row.urban_women / row.urban_men).toFixed(2) || (0 as number),
            rural_proportion:
              (row.rural_women / row.rural_men).toFixed(2) || (0 as number),
          };
        });
      }
      const rootNames = rootCodes.map(
        (rootCode) => this.#regions!.getRegionByCode(rootCode)!.territory
      );

      // for each root we get corresponding leaves (nodes without children)
      // the final array that holds every leaf might inlcude duplicates
      // which are removed using new Set()
      const leafCodes = Array.from(
        new Set(
          rootCodes
            .map((rootCode) =>
              this.#regions!.getLeafNodes(rootCode).map(
                (leaf) => leaf.territory_code
              )
            )
            .flat()
        )
      );

      // for each node we get the population
      // each node describes population for each age range
      // thus the final variable is [][] (array of arrays)
      const populationPerLeafNode = leafCodes.map((leafCode) =>
        this.getRegionPopulation(leafCode)
      );

      return populationPerLeafNode.reduce((sum, curr) => {
        const res: PopulationSingleRecord[] = [];
        for (let i = 0; i < sum.length; ++i) {
          res.push({
            year: this.#year,
            territory: rootNames.join(", "),
            territory_code: rootCodes.join(", "),
            age_start: sum[i].age_start,
            age_end: sum[i].age_end,

            all: sum[i].all + curr[i].all,
            all_men: sum[i].all_men + curr[i].all_men,
            all_women: sum[i].all_women + curr[i].all_women,
            all_proportion: ((
              (sum[i].all_women + curr[i].all_women) /
              (sum[i].all_men + curr[i].all_men)
            ).toFixed(2) || 0) as number,

            urban_all: sum[i].urban_all + curr[i].urban_all,
            urban_men: sum[i].urban_men + curr[i].urban_men,
            urban_women: sum[i].urban_women + curr[i].urban_women,
            urban_proportion: ((
              (sum[i].urban_women + curr[i].urban_women) /
              (sum[i].urban_men + curr[i].urban_men)
            ).toFixed(2) || 0) as number,

            rural_all: sum[i].rural_all + curr[i].rural_all,
            rural_men: sum[i].rural_men + curr[i].rural_men,
            rural_women: sum[i].rural_women + curr[i].rural_women,
            rural_proportion: ((
              (sum[i].rural_women + curr[i].rural_women) /
              (sum[i].rural_men + curr[i].rural_men)
            ).toFixed(2) || 0) as number,
          });
        }
        return res;
      });
    } else {
      throw new PopulationEmptyRegionsException();
    }
  }
}

export {
  RangeValidationException,
  BoundsOrderException,
  parsePositiveNumberRanges,
};
