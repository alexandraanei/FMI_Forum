import React, { Component } from "react";
import Editor, { createEditorStateWithText } from "draft-js-plugins-editor";
import axios from "axios";
import { stateToHTML } from "draft-js-export-html";
import createToolbarPlugin, { Separator } from "draft-js-static-toolbar-plugin";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from "draft-js-buttons";
import classes from "./EditPostDialog.module.scss";
import "draft-js-static-toolbar-plugin/lib/plugin.css";
import {
  Button,
  FormHelperText,
  TextField,
  Switch,
  FormControlLabel,
  Dialog,
  AppBar,
  Slide,
  Toolbar as MUIToolbar,
  Container,
  Tooltip,
} from "@material-ui/core";
import FileUpload from "@material-ui/icons/AddPhotoAlternate";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { ContentState, EditorState, convertFromHTML } from "draft-js";
import AlertStore from '../../Stores/AlertStore';

class HeadlinesPicker extends Component {
  componentDidMount() {
    setTimeout(() => {
      window.addEventListener("click", this.onWindowClick);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onWindowClick);
  }

  onWindowClick = () => this.props.onOverrideContent(undefined);

  render() {
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
    return (
      <div>
        {buttons.map((Button, i) => (
          <Button key={i} {...this.props} />
        ))}
      </div>
    );
  }
}

class HeadlinesButton extends Component {
  onClick = () => this.props.onOverrideContent(HeadlinesPicker);

  render() {
    return (
      <div className={classes.headlineButtonWrapper}>
        <button onClick={this.onClick} className={classes.headlineButton}>
          H
        </button>
      </div>
    );
  }
}

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class EditPostDialog extends Component {
  handleClose = () => {
    this.props.onClose();
  };

  state = {
    editorState: EditorState.createWithContent(ContentState.createFromBlockArray(
        convertFromHTML(this.props.thread.content).contentBlocks,
        convertFromHTML(this.props.thread.content).entityMap,
    )),
    uploadFiles: [...this.props.thread.files, ...this.props.thread.photos],
    hasDeadline: this.props.thread.deadline ? true : false,
    deadline: this.props.thread.deadline,
    privatePost: this.props.thread.private,
  };

  onChange = (editorState) => {
    this.setState({ editorState });
  };

  focus = () => {
    this.editor.focus();
  };

  onChangeHandler = (e) => {
    this.setState({ uploadFiles: [...e.target.files] });
  };

  deleteFiles = () => {
      this.setState({ uploadFiles: [] });
  }

  handleToggle = (type) => {
    if (type === "private") {
      this.setState((state) => ({ privatePost: !state.privatePost }));
    } else {
      this.setState((state) => ({
        deadline: state.hasDeadline ? null : this.yyyymmdd(new Date()),
        hasDeadline: !state.hasDeadline,
      }));
    }
  };

  yyyymmdd = (date) => {
    var mm = date.getMonth() + 1;
    var dd = date.getDate();

    return (
      date.getFullYear() +
      "-" +
      (mm > 9 ? "" : "0") +
      mm +
      "-" +
      (dd > 9 ? "" : "0") +
      dd
    );
  };

  handleOnSave = async (event) => {
    const { thread } = this.props;
    const { uploadFiles, deadline, privatePost } = this.state;
    const content = stateToHTML(this.state.editorState.getCurrentContent());
    event.preventDefault();
    this.props.onClose();

    const data = new FormData();
    if (uploadFiles) {
      for (let i = 0; i < uploadFiles.length; i++) {
        data.append("files", uploadFiles[i]);
      }
    }
    data.append("content", content);
    data.append("deadline", deadline);
    data.append("private", privatePost);


    try {
      const response = await axios.put("/api/thread/editcontent/" + thread._id, data);
      AlertStore.showSnackbar({
        message: "Postarea va fi revizuita si republicata in scurt timp.",
        type: "info",
      });

      // history.push("/forum/" + this.props.thread.forumId);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  render() {
    const { open, thread } = this.props;
    console.log(this.props.thread);
    console.log(this.state);

    return (
      <div>
        <Dialog
          fullScreen
          open={open}
          TransitionComponent={Transition}
          classes={{ paperFullScreen: classes.root }}
        >
          <AppBar className={classes.appBar}>
            <MUIToolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="close"
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Editeaza postarea
              </Typography>
              <Button autoFocus color="inherit" onClick={this.handleOnSave}>
                Salveaza postarea
              </Button>
            </MUIToolbar>
          </AppBar>
          <Container className={classes.container} fixed maxWidth="xl">
            <div className={classes.editor} onClick={this.focus}>
              <Editor
                editorState={this.state.editorState}
                onChange={this.onChange}
                plugins={plugins}
                ref={(element) => {
                  this.editor = element;
                }}
              />
              <Toolbar>
                {(externalProps) => (
                  <React.Fragment>
                    <BoldButton {...externalProps} />
                    <ItalicButton {...externalProps} />
                    <UnderlineButton {...externalProps} />
                    <CodeButton {...externalProps} />
                    <Separator {...externalProps} />
                    <HeadlinesButton {...externalProps} />
                    <UnorderedListButton {...externalProps} />
                    <OrderedListButton {...externalProps} />
                    <BlockquoteButton {...externalProps} />
                    <CodeBlockButton {...externalProps} />
                  </React.Fragment>
                )}
              </Toolbar>
              <div style={{ marginTop: 20 }}>
                <FormControlLabel
                  control={
                    <Switch
                      color="primary"
                      checked={this.state.privatePost}
                      onChange={() => this.handleToggle("private")}
                    />
                  }
                  label="Postare privata?"
                />
                <FormControlLabel
                  control={
                    <Switch
                      color="primary"
                      checked={this.state.hasDeadline}
                      onChange={() => this.handleToggle("deadline")}
                    />
                  }
                  label="Setati termen limita?"
                />
                <TextField
                  id="date"
                  style={{
                    opacity: this.state.hasDeadline ? 1 : 0,
                    marginTop: -10,
                  }}
                  label="Seteaza deadline"
                  type="date"
                  defaultValue={thread.deadline}
                  onChange={(e) => this.setState({ deadline: e.target.value })}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div style={{ marginTop: 5 }}>
                <FormHelperText id="component-helper-text">
                  Incarca fisiere...
                </FormHelperText>
                <input
                  multiple
                  onChange={this.onChangeHandler}
                  className={classes.input}
                  id="icon-button-file"
                  type="file"
                />
                <label htmlFor="icon-button-file">
                  <Button
                    variant="contained"
                    component="span"
                    className={classes.button}
                  >
                    <FileUpload />
                    &nbsp;Incarca
                  </Button>
                </label>
                <span className={classes.filename}>
                  {this.state.uploadFiles.length > 0
                    ? this.state.uploadFiles.length === 1
                      ? this.state.uploadFiles[0].name
                      : `${this.state.uploadFiles.length} files`
                    : ""}
                </span>
                {this.state.uploadFiles.length > 0 && (<Tooltip title="Sterge fisierele">
                  <IconButton
                    variant="contained"
                    color="inherit"
                    size="small"
                    // className={classes.button}
                    onClick={(e) => {
                      e.stopPropagation();
                      this.deleteFiles();
                    }}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </Tooltip>)}
              </div>
            </div>
          </Container>
        </Dialog>
      </div>
    );
  }
}
