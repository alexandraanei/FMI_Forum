import { observable, action } from 'mobx';

export class SubforumsStore {
  @observable
  active: boolean = true;

  @observable
  activeSubforum: string = '';

  @action
  setSubforum(newSubforum: string) {
    this.active = true;
    this.activeSubforum = newSubforum;
  }

  @action
  resetSubforum(){
    this.active = false;
    this.activeSubforum = '';
  }

}

declare global {
  interface Window {
    SubforumsStore: SubforumsStore,
  }
}

const subforumsStore = new SubforumsStore();
window.SubforumsStore = subforumsStore;

export default subforumsStore;
