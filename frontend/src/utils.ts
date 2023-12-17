import population from './assets/population.json'
import { BoundsOrderException, RangeValidationException, RegionCodeException } from './exceptions';
import { PopulationSingleRecord, Region } from './types';

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
        const singleNumberMatches = Array.from(
        input.matchAll(singleNumberReg)
        );

        for (const singleNumberMatch of singleNumberMatches) {
        const num = +singleNumberMatch[1];
        result.add(num);
        }
      return result;
    }
    throw new RangeValidationException("Invalid input format");
}

class Regions {
  #regions: Region[] | null = null

  getRegionByName(name: string) {
    return this.#regions?.find(region => region.territory === name)
  }
  getRegionByCode(code: string) {
    return this.#regions?.find(region => region.territory_code === code)
  }
  async setRegions() {
    const response = await fetch('http://localhost:3002/regions')
    this.#regions = await response.json()
  }
  existsWithCode(code: string) {
    return Boolean(this.getRegionByCode(code))
  }
  isChildOf(possibleChildCode: string, possibleParentCode: string) {
    let reg = /\d+/g // e.g having 1.41.50 -> [1, 41, 50]
    let parentLevels = possibleParentCode.match(reg) as string[]

    if (parentLevels) {
      // parent has to have >= 1 zeros in its id
      // thus the idea is to remove the trailing zeros
      // and check if the childCode startsWith parentCode without these zeros
      parentLevels = parentLevels.filter(value => value !== '0')
    } else {
      const name = this.getRegionByCode(possibleParentCode)!.territory
      const code = this.getRegionByCode(possibleParentCode)!.territory_code
      throw new RegionCodeException(name, code)
    }
    const parentLevelsStringified = parentLevels.join('.')
    return possibleChildCode.startsWith(parentLevelsStringified)
  }
  getRegions() {
    return this.#regions
  }
  getChildren(rootCode: string) {
    let reg = /\d+/g // e.g having 1.41.50 -> [1, 41, 50]
    let parentLevels = rootCode.match(reg) as string[]
    let commonStart: string[]
    let descendantsDepth: number

    const result: Region[] = []

    if (parentLevels) {
      // parent has to have >= 1 zeros in its id
      // thus the idea is to remove the trailing zeros
      // and check if the childCode startsWith parentCode without these zeros

      // number of zeros represent the maximum descendants depth relative to the passed root
      // e.g.: rootCode is 1.7.0.0.0 then the descendants depth is 3 because there are 3 zeros
      // descendatsDepth is considered to be a maximum depth, because leaves are always present (nodes without children)
      // e.g.: region with code 1.7.0.0.1 definitely doesn't have any descendants, because the depth of the whole tree is 5

      // the algorithm's idea': the common start is defined by a rootCode without trailing zeros
      // there are n for loops, where n = descendantsDepth
      // in each loop we iterate over indices from (starting from 0) and construct new region codes
      // the for loop stops when we construct the code that doesn't exist
      descendantsDepth = parentLevels.filter(value => value === '0').length
      commonStart = parentLevels.filter(value => value !== '0')

      const commonStartStringified = commonStart.join('.')
      // for (let i = 0; i < descendantsDepth; ++i) {
      //   const delta = new Array(descendantsDepth).fill(0)

      //   while (true) {
      //     delta[i] += 1
      //   }
      // }
    } else {
      const name = this.getRegionByCode(rootCode)!.territory
      const code = this.getRegionByCode(rootCode)!.territory_code
      throw new RegionCodeException(name, code)
    }
  }
}

class Population {
  #population: PopulationSingleRecord[]
  #regions: Regions

  constructor() {
    this.#population = population as PopulationSingleRecord[]
    this.#regions = new Regions();

    (async () => {
      // @ts-ignore: this.#regions is really assigned before being used
      await this.#regions.setRegions()
    })()
  }

  getYearSlice(year: number) {
    return this.#population.filter(row => row.year === year);
  }


  // get the population data for root and all of its' subregions
  // the root can be defined by its code or region name
  getPopulationOfSubregionsByRootCode(rootCode: string) {
    return this.population.filter(row => {
      if (row.territory_code)
    })
  }
}


export {RangeValidationException, BoundsOrderException, parsePositiveNumberRanges, Population}