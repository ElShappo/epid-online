const defaultAgeStep = 1;
const defaultParamStep = 0.1;

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

  // least squares implementation for approximating a constant function (whose value is always equal to 'yTheory')
  // with a function called 'expression' that takes one argument 'x' and a parameter 'param'
  // i.e. our goal is to find the optimal parameter 'param' of 'expression'
  // xArgs - range of x values
  #LST(
    yTheory: number,
    xArgs: number[],
    expression: (x: number, param: number) => number,
    paramStep: number = defaultParamStep
  ) {
    let error = Infinity;
    let currError = 0;

    let optimalParam: number = paramStep;

    for (let i = paramStep; i < 1; i += paramStep) {
      for (const x of xArgs) {
        currError += Math.abs(expression(x, i) - yTheory);
      }
      if (currError < error) {
        optimalParam = i;
        error = currError;
      }
    }
    return optimalParam;
  }

  // the fraction inside of region of those who are ill
  // 't' is age for which we are evaluating the function
  #getIllFraction(t: number, lambda: number) {
    return lambda * Math.exp(-lambda * t);
  }

  getLambdaEstimation(
    illFraction: number,
    minAge: number,
    maxAge: number,
    ageStep: number = defaultAgeStep,
    paramStep: number = defaultParamStep
  ) {
    const xArgs = [];

    // filling xArgs array
    for (let i = minAge; i <= maxAge; i += ageStep) {
      xArgs.push(i);
    }
    return this.#LST(illFraction, xArgs, this.#getIllFraction, paramStep);
  }

  // 'lambda * exp(-lambda * t)' is a model that should approximate the theoretical 'illFraction' in the best way possible
  // we can evaluate this model for every 'x' in 'xArgs'
  // (whereas 'xArgs' is defined as a range of integral numbers between 'minAge' and 'maxAge')
  // we can then obtain 'c_' = avg(model) / illFraction => illFraction = avg(model) * 1 / c_
  // in other words: c = 1 / c_ = illFraction / avg(model)
  getCEstimation(
    minAge: number,
    maxAge: number,
    illFraction: number,
    lambda: number,
    ageStep: number = defaultAgeStep
  ) {
    const xArgs = [];

    // filling xArgs array
    for (let i = minAge; i <= maxAge; i += ageStep) {
      xArgs.push(i);
    }

    const modelAverage =
      xArgs.map((x) => this.#getIllFraction(x, lambda)).reduce((sum, curr) => sum + curr, 0) / xArgs.length;
    const c = illFraction / modelAverage;
    return c;
  }

  getContactNumber(lambda: number, h: number[], ageStep: number = defaultAgeStep) {
    if (h.length !== 101) {
      return new Error("invalid length of h");
    }
    let res = 0;
    for (let i = 0; i <= 100; i += ageStep) {
      res += (this.#getIllFraction(i, lambda) * h[i]) / lambda;
    }
    return 1 / res;
  }
}
