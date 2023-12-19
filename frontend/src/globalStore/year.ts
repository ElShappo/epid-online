import { makeAutoObservable } from 'mobx'
import { availableYearsType } from '../types';

class Year {
  year: availableYearsType;
  constructor() {
    makeAutoObservable(this)
    this.year = 2023
  }
  set(year: availableYearsType) {
    this.year = year
  }
  get() {
    return this.year;
  }
}

const year = new Year();
export default year;
