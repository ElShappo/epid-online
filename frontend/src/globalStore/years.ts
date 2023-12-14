import { makeAutoObservable } from 'mobx'

class Years {
  years: number[] = [];
  constructor() {
    makeAutoObservable(this)
  }
  add(year: number) {
    this.years.push(year);
  }
  remove(year: number) {
    this.years = this.years.filter(year_ => year_ !== year);
  }
  replace(years: number[]) {
    this.years = years;
  }
  get() {
    return this.years;
  }
}

const years = new Years();
export default years;
