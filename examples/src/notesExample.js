import React, { Component } from 'react';

import {Grid, Header, Card, Button} from 'semantic-ui-react';

import SingularComponent from '../../src';


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
        return <SingularComponent singularKey={`note-${props.note.id}`} singularPriority={props.singularPriority} animationTrigger={props.notesCount}>
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

export default class NotesExample extends React.Component{
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


        this.state = { notes };

        this.toggleNote = this.toggleNote.bind(this);
    }   

    
    toggleNote(noteId){
        let newNotes = this.state.notes;
        newNotes[noteId].done = !newNotes[noteId].done;
        this.setState({notes: newNotes});
    }

    render(){


        const renderNotes = (notes)=> {
            return notes.map((note) => <Note key={note.id} notesCount={notes.length} note={note} singularPriority={1} toggleNote={this.toggleNote} />)
        };

        return <Grid padded>
            <Grid.Row>
                <Grid.Column textAlign="center">
                    <Header size="huge">Jira Whom?!</Header>
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
        </Grid>;
    }

    
}