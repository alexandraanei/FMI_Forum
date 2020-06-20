/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin';
import {
  ItalicButton, BoldButton, UnderlineButton, CodeButton, HeadlineOneButton, HeadlineTwoButton,
  HeadlineThreeButton, UnorderedListButton, OrderedListButton, BlockquoteButton, CodeBlockButton,
} from 'draft-js-buttons';
import classes from './TextEditor.module.scss';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';

class HeadlinesPicker extends Component {
  componentDidMount() {
    setTimeout(() => { window.addEventListener('click', this.onWindowClick); });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick);
  }

  onWindowClick = () =>
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    this.props.onOverrideContent(undefined);

  render() {
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
    return (
      <div>
        {buttons.map((Button, i) => <Button key={i} {...this.props} />)}
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
const text = 'Add a description of the thread...';

export default class TextEditor extends Component {

  state = {
    editorState: createEditorStateWithText(text),
  };

  onChange = (editorState) => {
    this.setState({ editorState });
    this.props.onChangeContent(stateToHTML(editorState.getCurrentContent()));

  };

  focus = () => {
    this.editor.focus();
  };

  render() {
      
      
    return (
        <div className={classes.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element) => { this.editor = element; }}
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
        </div>
    );
  }
}