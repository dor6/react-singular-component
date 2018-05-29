import React, { Component } from 'react';
import {Menu, Input, Ref, Grid, Header, Card, Button} from 'semantic-ui-react';

import SingularComponent, {EasingFunctions} from 'react-singular-component';
import './stylesheets/semantic/semantic.css';


class SingularSearch extends Component{

    constructor(props){
        super(props);
    }

    handleRef(element){
        element.getElementsByTagName('input')[0].focus();
    }

    render(){
        const {singularPriority, style, value, onChange} = this.props;

        return <SingularComponent 
            easing={EasingFunctions.easeOutCubic}
            customTransitionElement={<div style={{background: "red", padding: "15px"}}>cool</div>} 
            singularKey="SingleInput" 
            singularPriority={singularPriority}
            onAnimationComplete={() => {console.log("done!")}}>
            <Ref innerRef={this.handleRef}>
                <Input icon="search" value={value} style={style} onChange={onChange} />
            </Ref>
        </SingularComponent>;
    }
}

class Note extends Component{

    constructor(props){
        super(props);

        this.toggleNote = this.toggleNote.bind(this);
    }

    toggleNote(){
        this.props.toggleNote(this.props.note.id);
    }

    render(){
        const {props} = this;
        return <SingularComponent singularKey={`note-${props.note.id}`} singularPriority={props.singularPriority}>
            <Card>
                <Card.Content>
                    <Card.Header>{props.note.header}</Card.Header>
                </Card.Content>
                <Card.Content extra>
                    <Button basic fluid onClick={this.toggleNote}>{!props.note.done ? 'done' : 'undone' }</Button>
                </Card.Content>
            </Card>
        </SingularComponent>;
    }

}

class App extends Component {

    constructor(props){
        super(props);

        let notes = [];

        for(let i = 0; i < 6; ++i){
            notes.push({
                id: i,
                header: `Note ${i}`,
                done: false
            });
        }


        this.state = {
            value: '',
            notes
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.toggleNote = this.toggleNote.bind(this);


        setInterval(() => {
            this.toggleNote(Math.floor(Math.random() * this.state.notes.length))
        }, 500);
    }


    onInputChange(e, {value}){
        this.setState({value});
    }


    toggleNote(noteId){
        let newNotes = this.state.notes;
        newNotes[noteId].done = !newNotes[noteId].done;
        this.setState({notes: newNotes});
    }

    render() {

        const renderNotes = (notes)=>{
            return notes.map((note) => <Note key={note.id} note={note} singularPriority={1} toggleNote={this.toggleNote} />)
        };

        return (
          <div className="App">
              <Menu fluid attached borderless inverted color="purple" style={{height: '47px'}}>
                  <Menu.Item>
                      <SingularSearch singularPriority={1} value={this.state.value} onChange={this.onInputChange}/>
                  </Menu.Item>
              </Menu>

              <Grid padded>
                  <Grid.Row>
                      <Grid.Column textAlign="center">
                          <Header size="huge">Search</Header>
                      </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                      <Grid.Column textAlign="center">
                          {
                              this.state.value.length === 0 ?
                                  <SingularSearch singularPriority={2} style={{width: '600px'}} value={this.state.value} onChange={this.onInputChange}/> : ''
                          }
                      </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                      <Grid.Column>
                          <Card.Group centered style={{height: '15rem'}}>
                              {renderNotes(this.state.notes.filter((note) => !note.done))}
                          </Card.Group>
                      </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                      <Grid.Column>
                          <Card.Group centered style={{height: '15rem'}}>
                              {renderNotes(this.state.notes.filter((note) => note.done))}
                          </Card.Group>
                      </Grid.Column>
                  </Grid.Row>
              </Grid>
          </div>
        );
    }
}

export default App;
