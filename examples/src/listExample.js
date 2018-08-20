import React, { Component } from 'react';

import {Grid, Header, Segment, Button, Container} from 'semantic-ui-react';

import SingularComponent from '../../src';


class ListItem extends Component{

    handleAnimationBegin = (originalElement, animationElement) => {
        animationElement.getElementsByClassName('button')[0].addEventListener('click', this.removeItem);
    }

    removeItem = () => {
        const {itemId, removeItem} = this.props;
        removeItem(itemId);
    }

    render(){
        const {itemId, index} = this.props;

        return <SingularComponent 
            animationTrigger={index}
            singularKey={`ListItem-${itemId}`} 
            singularPriority={1} onAnimationBegin={this.handleAnimationBegin}>
            <Segment clearing textAlign='left'>
                {itemId}
                <Button basic circular floated='right' icon='delete' onClick={this.removeItem}/>
            </Segment>
        </SingularComponent>;
    }
}


let itemsCounter = 0;

const getNextItemId = () => itemsCounter++;

export default class ListExample extends React.Component{

    state = { items: [] };

    addItem = () => {
        this.setState({items: [getNextItemId(), ...this.state.items]});
    }

    removeItem = (itemId) => {
        let nextItems = this.state.items;
        nextItems.splice(nextItems.indexOf(itemId), 1);
        this.setState({items: nextItems});
    }

    render(){
        return <Container>
            <Grid padded>
                <Grid.Row>
                    <Grid.Column>
                        <Header size="huge">Coolest List Ever!!! <Button floated='right' onClick={this.addItem}>Add Item</Button></Header>
                        
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {this.state.items.map((itemId, index) => <ListItem key={itemId} itemId={itemId} index={index} removeItem={this.removeItem} />)}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>;
    }

    
}