import React, { Component } from 'react';
import {Tab} from 'semantic-ui-react';

import SingularComponent, {EasingFunctions} from 'react-singular-component';
import './stylesheets/semantic/semantic.css';

import NotesExample from './notesExample';
import SearchExample from'./searchbarExample';

class App extends Component {   

    render() {
        return (
          <div className="App">
              <Tab menu={{ secondary: true, pointing: true }} panes={[
                  { menuItem: 'Search Example', render: () => <SearchExample/>},
                  { menuItem: 'Notes Example', render: () => <NotesExample/> }
              ]} />
          </div>
        );
    }
}

export default App;
