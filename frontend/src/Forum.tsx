import React from 'react';
import PrimarySearchAppBar from './PrimarySearchAppBar';
import Subforums from './posts/Subforums';
import { Container } from '@material-ui/core';
import './App.css';
import Sidebar from './Sidebar';

function Forum() {
  return (
    <div className="App">
        <PrimarySearchAppBar />
        <Container className="container" fixed maxWidth='lg' >
            <Subforums />
        </Container>
    </div>
  );
}

export default Forum;