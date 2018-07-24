import React, { Component } from 'react';

import {Grid, Header, Segment, Button, Container} from 'semantic-ui-react';

import SingularComponent, {EasingFunctions} from 'react-singular-component';


class ListItem extends Component{

    constructor(props){
        super(props);
   
        this.removeItem = this.removeItem.bind(this);
    }

    removeItem(){
        const {itemId, removeItem} = this.props;
        removeItem(itemId);
    }

    render(){
        const {itemId, index} = this.props;

        return <SingularComponent 
            animationTrigger={index}
            easing={EasingFunctions.easeOutCubic}
            singularKey={`ListItem-${itemId}`} 
            singularPriority={1}>
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
    constructor(props){
        super(props);

        this.state = { items: [] };

        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    addItem(){
        this.setState({items: [getNextItemId(), ...this.state.items]});
    }

    removeItem(itemId){
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