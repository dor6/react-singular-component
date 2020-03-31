import React, { useCallback, useState } from 'react';

import {Grid, Header, Segment, Button, Container} from 'semantic-ui-react';

import SingularComponent from '../../src';

function ListItem({removeItem, index, itemId}){
    const removeThisItem = useCallback(() => {
        removeItem(itemId);
    }, [removeItem, itemId]);

    const handleAnimationBegin = useCallback((originalElement, animationElement) => {
        animationElement.getElementsByClassName('button')[0].addEventListener('click', removeThisItem);
    }, [removeThisItem]);
    
    return (
        <SingularComponent 
            animationTrigger={index}
            singularKey={`ListItem-${itemId}`} 
            singularPriority={1} onAnimationBegin={handleAnimationBegin}>
            <Segment clearing textAlign='left'>
                {itemId}
                <Button basic circular floated='right' icon='delete' onClick={removeThisItem}/>
            </Segment>
        </SingularComponent>
    );
}

let itemsCounter = 0;

const getNextItemId = () => itemsCounter++;

export default function ListExample(){

    const [items, setItems] = useState([]);

    const addItem = () => {
        setItems([getNextItemId(), ...items]);
    };

    const removeItem = (itemId) => {
        items.splice(items.indexOf(itemId), 1);
        setItems([...items]);
    }

    
    return (
        <Container>
            <Grid padded>
                <Grid.Row>
                    <Grid.Column>
                        <Header size="huge">Coolest List Ever!!! <Button floated='right' onClick={addItem}>Add Item</Button></Header>
                        
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {items.map((itemId, index) => <ListItem key={itemId} itemId={itemId} index={index} removeItem={removeItem} />)}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};