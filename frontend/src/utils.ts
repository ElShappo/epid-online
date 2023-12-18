import population from './assets/population.json'
import { availableYears } from './constants';
import { BoundsOrderException, EmptyRegionsException, RangeValidationException, RegionCodeException, RegionNameException } from './exceptions';
import { AntDesignTree, PopulationSingleRecord, Region, availableYearsType } from './types';

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
  async setRegions(year: availableYearsType) {
    const response = await fetch(`http://localhost:3002/regions?year=${year}`)
    this.#regions = await response.json()
    this.#checkCodes()
    this.#checkNames()
  }
  #checkCodes() {
    if (this.#regions) {
      const reg = /\d+/g // e.g having 1.41.50 -> [1, 41, 50]
      for (const region of this.#regions) {
        const levels = region.territory_code.match(reg)
        if (!levels) {
          throw new RegionCodeException(region.territory, region.territory_code)
        }
      }
    } else {
      throw new EmptyRegionsException()
    }
  }
  #checkNames() {
    if (this.#regions) {
      for (const region of this.#regions) {
        if (!region.territory) {
          throw new RegionNameException(region.territory, region.territory_code)
        }
      }
    } else {
      throw new EmptyRegionsException()
    }
  }
  existsWithCode(code: string) {
    return Boolean(this.getRegionByCode(code))
  }
  isChildOf(possibleChildCode: string, possibleParentCode: string) {
    const reg = /\d+/g // e.g having 1.41.50 -> [1, 41, 50]
    let parentLevels = possibleParentCode.match(reg) as string[]

    // parent has to have >= 1 zeros in its id
    // thus the idea is to remove the trailing zeros
    // and check if the childCode startsWith parentCode without these zeros
    parentLevels = parentLevels.filter(value => value !== '0')

    const parentLevelsStringified = parentLevels.join('.')
    return possibleChildCode.startsWith(parentLevelsStringified)
  }
  getRegions() {
    return this.#regions
  }
  hasChildren(rootCode: string) {
    const reg = /\d+/g // e.g having 1.41.50 -> [1, 41, 50]
    const parentLevels = rootCode.match(reg) as string[]
    const firstZeroIndex = parentLevels.findIndex(level => level === '0')
    if (firstZeroIndex === -1) {
      return false
    }

    const possibleChildLevel = parentLevels.slice()
    possibleChildLevel[firstZeroIndex] = '1'

    return this.existsWithCode(possibleChildLevel.join('.'))
  }
  getChildren(rootCode: string) {
    const reg = /\d+/g // e.g having 1.41.50 -> [1, 41, 50]
    const parentLevels = rootCode.match(reg) as string[]

    const commonStart = parentLevels.filter(value => value !== '0')
    const commonStartStringified = commonStart.join('.')

    const result = []

    for (const region of this.#regions as Region[]) {
      if (region.territory_code !== rootCode && region.territory_code.startsWith(commonStartStringified)) {
        result.push(region)
      }
    }
    return result
  }
  getDirectChildren(rootCode: string) {
    const reg = /\d+/g // e.g having 1.41.50 -> [1, 41, 50]
    const parentLevels = rootCode.match(reg) as string[]
    const firstZeroIndex = parentLevels.findIndex(level => level === '0')
    if (firstZeroIndex === -1) {
      return []
    }

    const possibleChildLevel = parentLevels.slice()
    const result = []

    let i = 1
    // eslint-disable-next-line no-constant-condition
    while (true) {
      possibleChildLevel[firstZeroIndex] = `${i}`
      const possibleChildCode = possibleChildLevel.join('.')
      if (this.existsWithCode(possibleChildCode)) {
        result.push(this.getRegionByCode(possibleChildCode))
      } else {
        break
      }
      i += 1
    }
    return result
  }
  getLeafNodes(rootCode: string) {
    const result = this.getChildren(rootCode)
    return result.filter(region => !this.hasChildren(region.territory_code))
  }
  getAntDesignTreeSelectFormat(rootCode: string) {
    const node: AntDesignTree = {
      title: this.getRegionByCode(rootCode)!.territory,
      value: rootCode,
      key: rootCode,
      children: []
    } 

    if (this.hasChildren(rootCode)) {
      const children = this.getDirectChildren(rootCode) as Region[]

      for (const child of children) {
        node.children.push(this.getAntDesignTreeSelectFormat(child.territory_code) )
      }
    }
    return node

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

class Population {
  #population: PopulationSingleRecord[]
  #regions: Regions[] = [] // for each year the regions structure may be different

  constructor() {
    this.#population = population as PopulationSingleRecord[]

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _year of availableYears) {
      this.#regions.push(new Regions() )
    }

    (async () => {
      for (let i = 0; i < this.#regions.length; ++i) {
        await this.#regions[i].setRegions(availableYears[i])
      }
    })()
  }

  getRegionPopulation(year: availableYearsType, regionCode: string) {
    return this.#population.filter(row => {
      return row.year === year && row.territory_code === regionCode
    }).sort((a, b) => a.age_start - b.age_start)
  }

  // getAgeRanges(year: availableYearsType) {
  //   const currentPopulation = this.getYearSlice(year)
  //   currentPopulation.
  // }

  getYearSlice(year: availableYearsType) {
    return this.#population.filter(row => row.year === year);
  }

  // get the population data for root and all of its' subregions
  // the root can be defined by its code or region name
  getMergedRegions(year: availableYearsType, rootCodes: string[]) {
    // get regions structure for chosen year
    const currentRegions = this.#regions[availableYears.indexOf(year)]
    const rootNames = rootCodes.map(rootCode => currentRegions.getRegionByCode(rootCode)!.territory)

    // for each root we get corresponding leaves (nodes without children)
    // the final array that holds every leaf might inlcude duplicates
    // which are removed using new Set()
    const leafCodes = Array.from(new Set(
      rootCodes.map(rootCode => currentRegions.getLeafNodes(rootCode).map(leaf => leaf.territory_code)).flat()
    ))

    // for each node we get the population
    // each node describes population for each age range
    // thus the final variable is [][] (array of arrays)
    const populationPerLeafNode = leafCodes.map(leafCode => this.getRegionPopulation(year, leafCode))

    return populationPerLeafNode.reduce((sum, curr) => {
      const res: PopulationSingleRecord[] = []
      for (let i = 0; i < sum.length; ++i) {
        res.push(
          {
           year,
           territory: rootNames.join(', '),
           territory_code: rootCodes.join(', '),
           age_start: sum[i].age_start,
           age_end: sum[i].age_end,
           all: sum[i].all + curr[i].all,
           all_men: sum[i].all_men + curr[i].all_men,
           all_women: sum[i].all_women + curr[i].all_women,
           urban_all: sum[i].urban_all + curr[i].urban_all,
           urban_men: sum[i].urban_men + curr[i].urban_men,
           urban_women: sum[i].urban_women + curr[i].urban_women,
           rural_all: sum[i].rural_all + curr[i].rural_all,
           rural_men: sum[i].rural_men + curr[i].rural_men,
           rural_women: sum[i].rural_women + curr[i].rural_women
         }
        )
      }
      return res
    })

    // get population data that corresponds to chosen year
    // and filter this data so it contains only the regions we want to sum
    // const currentPopulation = this.getYearSlice(year).filter(populationRow => {
    //   return leafNodes.map(row => row.territory_code).includes(populationRow.territory_code) 
    // })

    // const result: PopulationSingleRecord[] = []



    // return this.population.filter(row => {
    //   if (row.territory_code)
    // })
  }
}


export {RangeValidationException, BoundsOrderException, parsePositiveNumberRanges, Population}