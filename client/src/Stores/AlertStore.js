import { action, observable } from "mobx";

class AlertStore {
  @observable isVisible = false;
  @observable vertical = "top";
  @observable horizontal = "center";
  @observable type = "info";
  @observable duration = 3000;
  @observable message = "";

  @action
  showSnackbar = ({
    message,
    vertical = "top",
    horizontal = "center",
    type = "info",
    duration,
  }) => {
    this.isVisible = true;
    this.vertical = vertical;
    this.horizontal = horizontal;
    this.type = type;
    this.message = message;
    this.duration = duration === undefined ? 3000 : duration;
  };

  @action
  hideSnackBar = () => {
    this.isVisible = false;
  };

  @action
  showError = (error) => {
    if (!error) {
      return;
    }
    this.showSnackbar({
      message: error,
      type: "error",
    });
  };
}

const InitiatedAlertStore = new AlertStore();

window.AlertStore = InitiatedAlertStore;

export default InitiatedAlertStore;
