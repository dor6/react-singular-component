import React, { Component } from 'react';

import {Grid, Header, Card, Button} from 'semantic-ui-react';

import SingularComponent from '../../src';


class Note extends Component{

    toggleNote = () => {
        this.props.toggleNote(this.props.note.id);
    };

    handleAnimationBegin = (originalElement, animationElement) => {
        animationElement.getElementsByClassName('button')[0].addEventListener('click', this.toggleNote);
        animationElement.style.zIndex = this.props.note.id;
    };

    render(){
        const {props} = this;
        return <SingularComponent continuousAnimation singularKey={`note-${props.note.id}`} animationDuration={500} singularPriority={props.singularPriority} animationTrigger={props.notesCount} onAnimationBegin={this.handleAnimationBegin} >
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
    }   

    
    toggleNote = (noteId) => {
        let newNotes = this.state.notes;
        newNotes[noteId].done = !newNotes[noteId].done;
        this.setState({notes: newNotes});
    }

    render(){


        const renderNotes = (notes, priority)=> {
            return notes.map((note) => <Note key={note.id} notesCount={notes.length} note={note} singularPriority={priority} toggleNote={this.toggleNote} />)
        };

        return <Grid padded>
            <Grid.Row>
                <Grid.Column textAlign="center">
                    <Header size="huge">Jira Whom?!</Header>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <Card.Group centered style={{minHeight: '15rem'}}>
                        {renderNotes(this.state.notes.filter((note) => !note.done), 1)}
                    </Card.Group>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <Card.Group centered style={{minHeight: '15rem'}}>
                        {renderNotes(this.state.notes.filter((note) => note.done), 2)}
                    </Card.Group>
                </Grid.Column>
            </Grid.Row>
        </Grid>;
    }

    
}