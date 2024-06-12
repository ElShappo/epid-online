import { RegionCodeException, EmptyRegionsException, RegionNameException } from "../../../../exceptions";
import { Region, availableYearsType, AntDesignTree } from "../../../../types";

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
          throw new RegionCodeException(region.territory, region.territory_code);
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
          throw new RegionNameException(region.territory, region.territory_code);
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
      if (region.territory_code !== rootCode && region.territory_code.startsWith(commonStartStringified)) {
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
        node.children.push(this.getAntDesignTreeSelectFormat(child.territory_code));
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
