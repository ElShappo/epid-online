import { makeAutoObservable } from 'mobx'
import { availableYearsType } from '../types';
import { defaultYear } from '../constants';

class Year {
  year: availableYearsType;
  constructor() {
    makeAutoObservable(this)
    this.year = defaultYear!
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
