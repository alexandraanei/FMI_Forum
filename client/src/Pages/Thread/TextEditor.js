/* eslint-disable react/no-multi-comp */
import React, { Component } from "react";
import Editor, { createEditorStateWithText } from "draft-js-plugins-editor";
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
import classes from "./TextEditor.module.scss";
import "draft-js-static-toolbar-plugin/lib/plugin.css";
import {
  Button,
  FormHelperText,
  TextField,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import FileUpload from "@material-ui/icons/AddPhotoAlternate";

class HeadlinesPicker extends Component {
  componentDidMount() {
    setTimeout(() => {
      window.addEventListener("click", this.onWindowClick);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onWindowClick);
  }

  onWindowClick = () =>
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    this.props.onOverrideContent(undefined);

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
  onClick = () =>
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    this.props.onOverrideContent(HeadlinesPicker);

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
const text = "Adauga o descriere...";

export default class TextEditor extends Component {
  state = {
    editorState: createEditorStateWithText(text),
    uploadFiles: [],
    hasDeadline: false,
    deadline: null,
    privatePost: false,
  };

  // componentDidMount() {
  //   this.setState({ deadline: this.yyyymmdd(new Date()) });
  // }

  onChange = (editorState) => {
    this.setState({ editorState });
    this.props.onChangeContent(
      stateToHTML(editorState.getCurrentContent()),
      this.state.uploadFiles,
      this.state.deadline,
      this.state.privatePost,
    );
    console.log(this.state.deadline);
  };

  focus = () => {
    this.editor.focus();
  };

  onChangeHandler = (e) => {
    this.setState({ uploadFiles: e.target.files });
  };

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
    var mm = date.getMonth() + 1; // getMonth() is zero-based
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

  render() {
    return (
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
          {
            // may be use React.Fragment instead of div to improve perfomance after React 16
            (externalProps) => (
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
            )
          }
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
            style={{ opacity: this.state.hasDeadline ? 1 : 0, marginTop: -10 }}
            label="Seteaza deadline"
            type="date"
            defaultValue={this.yyyymmdd(new Date())}
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
        </div>
      </div>
    );
  }
}
