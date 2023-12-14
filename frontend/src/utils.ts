class RangeValidationException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'RangeValidationError';
    }
}

class BoundsOrderException extends RangeValidationException {
    left: number;
    right: number;

    constructor(left: number, right: number) {
        super(`Wrong bounds order: ${left} > ${right}`);

        this.name = 'BoundsOrderException';
        this.left = left;
        this.right = right;
    }
}

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
export {RangeValidationException, BoundsOrderException, parsePositiveNumberRanges}