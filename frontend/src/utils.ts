import { ColorPickerProps } from "antd";
import { BoundsOrderException, RangeValidationException } from "./exceptions";

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

export function getRemainingHeightString(height: number) {
  return `calc(100vh - ${height}px)`;
}

// get a 'y' coord corresponding to 'x' coord assuming a line passes through (x1, y1) and (x2, y2)
export function getLinearInterpolation(x: number, x1: number, y1: number, x2: number, y2: number) {
  return ((x - x1) * (y2 - y1)) / (x2 - x1) + y1;
}

export function getRGBComponent(color: ColorPickerProps["value"], component: "R" | "G" | "B") {
  const matches = (color as string).match(/\d+/g) || [];

  switch (component) {
    case "R":
      return +matches[0]!;
    case "G":
      return +matches[1]!;
    case "B":
      return +matches[2]!;
    default:
      throw new Error("invalid function usage");
  }
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export { RangeValidationException, BoundsOrderException, parsePositiveNumberRanges };
