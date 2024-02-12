import { makeAutoObservable } from 'mobx'

class Authorization {
  isAuthorized = false;
  constructor() {
    makeAutoObservable(this)
  }
  authorize() {
    this.isAuthorized = true;
  }
  unauthorize() {
    this.isAuthorized = false;
  }
  get() {
    return this.isAuthorized;
  }
}

const authorization = new Authorization();

export default authorization;
