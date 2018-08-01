import React, { Component } from 'react';

import {Menu, Input, Ref, Grid, Header} from 'semantic-ui-react';

import SingularComponent, {EasingFunctions} from '../../src';


class SingularSearch extends Component{

    handleRef = (element) => {
        element.getElementsByTagName('input')[0].focus();
    }

    handleAnimationBegin = (originalElement, animationElement) => {
        let input = animationElement.getElementsByTagName('input')[0];
        input.selectionEnd = input.selectionStart = input.value.length;
        input.focus();
        input.addEventListener('input', (e) => this.props.onChange(e, { value: e.target.value }));
    }

    handleAnimationComplete = (originalElement) => {
        this.handleRef(originalElement);
    }


    render(){
        const {singularPriority, style, value, onChange} = this.props;

        return <SingularComponent 
            useStyleAnimation
            easing={EasingFunctions.easeOutCubic}
            singularKey="SingleInput" 
            singularPriority={singularPriority}
            onAnimationBegin={this.handleAnimationBegin}
            onAnimationComplete={this.handleAnimationComplete}
            animationDuration={1000}
            >
            <Ref innerRef={this.handleRef}>
                <Input icon="search" focus value={value} style={style} onChange={onChange} />
            </Ref>
        </SingularComponent>;
    }
}

const HEADERS = [
    'Search',
    'Nooooooo Dont Leave Meh!',
    'IM All Alone...'
];

export default class SearchbarExample extends React.Component{

    state = {  value: '' , header: HEADERS[0]};

    setHeaderTimeout = () => {
        if(!this.headerTimeout){
            this.headerTimeout = setTimeout(() => {
                this.clearHeaderTimeout();
                this.setState({header: HEADERS[2]});
            }, 3000);
        }
    };

    clearHeaderTimeout = () => {
        if(this.headerTimeout){
            clearTimeout(this.headerTimeout);
            this.headerTimeout = undefined;
        }
    };

    onInputChange = (e, {value}) => {
        if(value === ''){
            this.setState({header: HEADERS[0], value});
            this.clearHeaderTimeout();
        }
        else if(this.state.value === ''){
            this.setState({header: HEADERS[1], value});
        }
        else{
            this.setState({value}); 
        }
    }

    componentDidUpdate(){
        if(this.state.header === HEADERS[1]){
            this.setHeaderTimeout();
        }
    }


    componentWillUnmount(){
        this.clearHeaderTimeout();
    }

    render(){
        return <React.Fragment>
            <Menu fluid attached borderless inverted color="purple" style={{height: '47px'}}>
                  <Menu.Item>
                      <SingularSearch singularPriority={1} 
                      value={this.state.value} 
                      onChange={this.onInputChange} />
                  </Menu.Item>
              </Menu>

              <Grid padded>
                  <Grid.Row>
                      <Grid.Column textAlign="center">
                          <Header size="huge">{this.state.header}</Header>
                      </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                      <Grid.Column textAlign="center">
                          {
                              this.state.value.length === 0 ?
                                  <SingularSearch singularPriority={2} style={{maxWidth: '600px', width: '100%'}} value={this.state.value} onChange={this.onInputChange}/> : ''
                          }
                      </Grid.Column>
                  </Grid.Row>
              </Grid>
        </React.Fragment>;
    }

    
}