import { makeAutoObservable } from "mobx";

class HeaderHeight {
  headerHeight: number;
  constructor() {
    makeAutoObservable(this);
    this.headerHeight = 0;
  }
  set(headerHeight: number) {
    this.headerHeight = headerHeight;
  }
  get() {
    return this.headerHeight;
  }
}

const headerHeight = new HeaderHeight();
export default headerHeight;
