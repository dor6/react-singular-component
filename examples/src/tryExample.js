import React from 'react';
import SingularComponent from '../../src';
import Playground from 'component-playground';
import "./stylesheets/component-playground/codemirror.min.css";
import "./stylesheets/component-playground/monokai.min.css";
export default class TryExample extends React.Component{
    render(){
        return <div>
            <Playground codeText={`<div>
                <SingularComponent singularKey="TryExample" singularPriority={1}>
                    <div style={{position: "absolute", left: 0}}>hey</div>
                </SingularComponent>
                <SingularComponent singularKey="TryExample" singularPriority={2}>
                    <div style={{position: "absolute", right: 0}}>hey</div>
                </SingularComponent>
            </div>`} scope={{React, SingularComponent}}/>
        </div>
    }
}