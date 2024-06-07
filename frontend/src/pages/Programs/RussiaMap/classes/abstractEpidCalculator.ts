export class AbstractEpidCalculator {
  getIntensiveMorbidity(a: number, n: number) {
    return (10 ** 5 * a) / n;
  }

  // can be both standardized ABSOLUTE or INTENSIVE morbidity (formula remains the same)
  getStandardizedMorbidity(a: number[], H: number[]) {
    if (a.length !== H.length) {
      return new Error("arrays should have the same length");
    }
    return a.reduce((sum, curr, index) => sum + curr * H[index], 0);
  }
}
