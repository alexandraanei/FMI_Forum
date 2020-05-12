import React, { Component } from 'react';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails,
    List, ListItem, ListItemText, Divider } from '@material-ui/core/';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './Subforums.css';
// import postService from './services/postService';

type State = {
  clicked: boolean,
  path: string,
}

// const subforums: {
//   type: string[],
// }[] = [{
//   type: 'alphabetically',
//   label: 'Name'
// }, 
// }];

type Props = {
  
}

export default class Subforums extends Component<Props, State> {
  state: State = {
    clicked: false,
    path: '',
  };
//todo: mapare;

  render() {
    return (
      <div className="root">
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="anunturi-content"
            id="anunturi-header"
          >
            <Typography className="heading">ANUNTURI</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
          <List component="nav" className="listRoot" >
              <ListItem button>
                <ListItemText primary="Importante" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Diverse" />
              </ListItem>
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="mate-content"
            id="mate-header"
          >
            <Typography className="heading">MATEMATICA</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List component="nav" className="listRoot" >
            <ListItem button>
                <ListItemText primary="Anul I" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Anul II" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Anul III" />
              </ListItem>
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="info-content"
            id="info-header"
          >
            <Typography className="heading">INFORMATICA</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List component="nav" className="listRoot" >
              <ListItem button>
                <ListItemText primary="Anul I" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Anul II" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Anul III" />
              </ListItem>
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="cti-content"
            id="cti-header"
          >
            <Typography className="heading">CTI</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List component="nav" className="listRoot" >
              <ListItem button>
                <ListItemText primary="Anul I" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Anul II" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Anul III" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Anul IV" />
              </ListItem>
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}