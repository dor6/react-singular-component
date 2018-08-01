import React, { Component } from 'react';

import {Grid, Header, Button, Container} from 'semantic-ui-react';

import SingularComponent, {EasingFunctions} from '../../src';


class ColorExampleItem extends Component{

    render(){
        const {singularPriority, color} = this.props;

        const style = { 
            color: color, 
            borderColor: color, 
            border: '2px solid', 
            borderRadius: '1rem', 
            textAlign: 'center', 
            width: '6rem', 
            height: '6rem', 
            lineHeight: '6rem',
            display: 'inline-block'
        };

        return <SingularComponent
            animationDuration={1000}
            customAnimationHandlers={['color', 'borderColor']}
            easing={EasingFunctions.easeOutCubic}
            singularKey={'ColorExampleItem'} 
            singularPriority={singularPriority}>
            <div style={style}>
                Im Cool
            </div>
        </SingularComponent>;
    }
}


export default class ColorExample extends React.Component{


    state = { inverted: false };

    toggleInverted = () => {
        this.setState({inverted: !this.state.inverted});
    }

    render(){
        return <Container>
            <Grid padded>
                <Grid.Row>
                    <Grid.Column>
                        <Header size="huge">YAY! COLORS!!!! <Button floated='right' onClick={this.toggleInverted}>Do Somthing Cool</Button></Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column textAlign='center'>
                        <ColorExampleItem singularPriority={1} color='black' />
                    </Grid.Column>
                    <Grid.Column textAlign='center' color='black'>
                        { this.state.inverted ? <ColorExampleItem singularPriority={2} color='white' /> : null }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>;
    }

    
}