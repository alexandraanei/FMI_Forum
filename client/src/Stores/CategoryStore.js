import { observable, action } from 'mobx';
import axios from "axios";

export class CategoryStore {
  @observable
  categories = [];

  // @action
  handleOpenModal = () => {
    // this.openModal = true;
  };

  //@action
  handleCloseModal = () => {
    // this.openModal = false;
  };

  @action
  getCategories = async () => {
    const response = await axios.get('/api/category');
    this.categories = response.data;
    console.log(this.categories);
  };

  // @action
  // setSort = (sort: SortType, reverse: boolean) => {
  //   if (this.sort === sort && this.reverse === reverse) { return; }
  //   this.sort = sort;
  //   this.reverse = reverse;
  //   this.resetList();
  //   this.loadMore();
  // };

  // @action
  // setSearch = (text: string) => {
  //   if (this.search === text) { return; }
  //   this.search = text;
  //   this.debounceSearch();
  // };

  // debounceSearch = debounce(() => { this.resetList(); this.loadMore(); }, 250);

  

  // @action
  // handleClearSelection = () => {
  //   this.selectedMedia = [];
  //   this.canSelect = false;
  // };

  
}

  // crud req

const categoryStore = new CategoryStore();

window.CategoryStore = categoryStore;

export default categoryStore;
