import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/';
import { observer } from 'mobx-react';

import AlertStore from '../Stores/AlertStore';

const styles = {
  warn: {
    backgroundColor: '#ffb42b',
    color: '#000000'
  },
  error: {
    backgroundColor: '#eb2b2b',
  },
  success: {
    backgroundColor: '#41c00e'
  },
  info: {
    backgroundColor: '#2196f3'
  }
};

@observer
class Alert extends React.Component {
  render() {
    const { classes } = this.props;
    const {
      vertical,
      horizontal,
      isVisible,
      message,
      type,
      duration,
    } = AlertStore;

    const contentProps = {
      'aria-describedby': 'message-id',
      classes: {
        root: classes[type]
      }
    };

    return (
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isVisible}
        onClose={AlertStore.hideSnackBar}
        ContentProps={contentProps}
        autoHideDuration={duration}
        message={<span id="message-id">{message}</span>}
      />
    );
  }
}

export default withStyles(styles)(Alert);
