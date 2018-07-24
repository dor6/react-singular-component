import React, { Component } from 'react';
import {Tab} from 'semantic-ui-react';

import './stylesheets/semantic/semantic.css';

import NotesExample from './notesExample';
import SearchExample from'./searchbarExample';
import ListExample from './listExample';

class App extends Component {   

    render() {
        return (
          <div className="App">
              <Tab menu={{ secondary: true, pointing: true }} panes={[
                  { menuItem: 'Search Example', render: () => <SearchExample/>},
                  { menuItem: 'Notes Example', render: () => <NotesExample/> },
                  { menuItem: 'List Example', render: () => <ListExample/> }
              ]} />
          </div>
        );
    }
}

export default App;
