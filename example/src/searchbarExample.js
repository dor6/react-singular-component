import React, { Component } from 'react';

import {Menu, Input, Ref, Grid, Header} from 'semantic-ui-react';

import SingularComponent, {EasingFunctions} from 'react-singular-component';


class SingularSearch extends Component{

    handleRef(element){
        element.getElementsByTagName('input')[0].focus();
    }

    render(){
        const {singularPriority, style, value, onChange} = this.props;

        return <SingularComponent 
            useStyleAnimation
            easing={EasingFunctions.easeOutCubic}
            singularKey="SingleInput" 
            singularPriority={singularPriority}>
            <Ref innerRef={this.handleRef}>
                <Input icon="search" value={value} style={style} onChange={onChange} />
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
    constructor(props){
        super(props);

        this.state = {  value: '' , header: HEADERS[0]};
        this.onInputChange = this.onInputChange.bind(this);
    }   

    onInputChange(e, {value}){
        this.setState({value});
        if(value === ''){
            this.setState({header: HEADERS[0]});
            if(this.headerTimeout) clearTimeout(this.headerTimeout);
        }
        else if(this.state.value === ''){
            this.setState({header: HEADERS[1]});
        }
    }

    componentDidUpdate(){
        if(this.state.header === HEADERS[1]){
            this.headerTimeout = setTimeout(() => {
                this.setState({header: HEADERS[2]});
            }, 3000);
        }
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
                                  <SingularSearch singularPriority={2} style={{width: '600px'}} value={this.state.value} onChange={this.onInputChange}/> : ''
                          }
                      </Grid.Column>
                  </Grid.Row>
              </Grid>
        </React.Fragment>;
    }

    
}