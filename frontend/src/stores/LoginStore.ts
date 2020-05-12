import { observable, action } from 'mobx';

export class LoginStore {
  @observable
  loggedIn: boolean = false;

  @observable
  userName: string = '';

  @action
  saveToLocal() {
    localStorage.setItem("loggedIn", JSON.stringify(this.loggedIn));
    localStorage.setItem("userName", JSON.stringify(this.userName));
  }

  @action
  loginUser(e: any) {
    e.preventDefault();      
    this.loggedIn = true;
    this.userName = e.target.userName ///de testat
    this.saveToLocal();
  }
}

declare global {
  interface Window {
    LoginStore: LoginStore,
  }
}

const loginStore = new LoginStore();
window.LoginStore = loginStore;

export default loginStore;