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
  regions: Region[]
  async constructor() {
    const response = await fetch('http://localhost:3002/regions')
    this.regions = await response.json()
  }
  getRegionByName(name: string) {
    return this.regions.find(region => region.territory === name)
  }
  getRegionByCode(code: string) {
    return this.regions.find(region => region.territory_code === code)
  }
}

class Population {
  population: PopulationSingleRecord[]
  regions: Regions

  async constructor() {
    this.population = population as PopulationSingleRecord[]
    this.regions = new Regions()
  }

  getRegionNameByCode() {

  }

  #isChildOf(possibleChildCode: string, possibleParentCode: string) {
    let reg = /\d+/g // e.g having 1.41.50 -> [1, 41, 50]

    let childLevels = possibleChildCode.match(reg) as string[] || null

    if (childLevels) {
      childLevels = childLevels.filter(value => value !== '0')
    } else {
      throw new RegionCodeException()
    }

    const parentLevels = possibleParentCode.match(reg)
  }

  getYearSlice(year: number) {
    return this.population.filter(row => row.year === year);
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