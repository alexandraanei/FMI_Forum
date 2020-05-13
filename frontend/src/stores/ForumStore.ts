import { observable, action } from 'mobx';

export class ForumsStore {
  @observable
  sidebar: boolean = false;

  @action
  setSidebar(value: boolean) {
    this.sidebar = value;
  }

}

declare global {
  interface Window {
    ForumsStore: ForumsStore,
  }
}

const forumsStore = new ForumsStore();
window.ForumsStore = forumsStore;

export default forumsStore;
