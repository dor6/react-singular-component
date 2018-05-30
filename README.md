# SingularComponent
move your react component around the dom

![alt text](https://image.ibb.co/jJ5Non/example.gif)

animates your components movement around the dom
just give your wrap ypur component with the SingularComponent and give it a singularKey and a singularPriority

## Install

    npm install react-singular-component

## Usage

here is a component (using semantic ui react) from the example project: 

```jsx
import SingularComponent from 'react-singular-component';

class SingularSearch extends Component{

    constructor(props){
        super(props);
    }

    handleRef(element){
        element.getElementsByTagName('input')[0].focus();
    }

    render(){
        const {singularPriority, style, value, onChange} = this.props;

        return <SingularComponent singularKey="SingleInput" singularPriority={singularPriority}>
            <Ref innerRef={this.handleRef}>
                <Input icon="search" value={value} style={style} onChange={onChange} />
            </Ref>
        </SingularComponent>;
    }
}
```

I will render the SingularSearch component twice once with a singularPriority of 1 and once with a singularPriority of 2.
while i render both we will only see the instance with a priority of 2, but i will unmount the higher priority instance the component will move and change to the position and size of the lower priority instance.


## Props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th style="width: 50px;">Required</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>singularKey</td>
          <td>String</td>
          <td></td>
          <td>Required</td>
          <td>The library will make sure you always have only one SingularComponent with that key</td>
        </tr>
        <tr>
          <td>singularPriority</td>
          <td>Number</td>
          <td></td>
          <td>Required</td>
          <td>The library will keep the  one with the lower priority</td>
        </tr>
        <tr>
          <td>animationDuration</td>
          <td>Number</td>
          <td>300</td>
          <td></td>
          <td>Miliseconds duration</td>
        </tr>
        <tr>
          <td>onAnimationBegin</td>
          <td>() => void</td>
          <td></td>
          <td></td>
          <td>callback when the animation begins</td>
        </tr>
        <tr>
          <td>onAnimationComplete</td>
          <td>() => void</td>
          <td></td>
          <td></td>
          <td>Callback when the animation ends</td>
        </tr>
        <tr>
          <td>customTransitionElement</td>
          <td>React element</td>
          <td>The previous element will be taken</td>
          <td></td>
          <td>You can use it to replace the element that transitioned from one element to another</td>
        </tr>
        <tr>
          <td>easing</td>
          <td>(Number) => Number</td>
          <td>EasingFunctions.Linear</td>
          <td></td>
          <td>Given the progress, return the easing progress value. See here: https://easings.net/ . You can import easing functions like that import SingularComponent, {EasingFunctions} from 'react-singular-component'; EasingFunctions.easeOutCubic or make your own function</td>
        </tr>
    </tbody>
</table>



## Contribute

Simply fork and clone

    cd example
    npm install
    npm start

and you're ready to go and make whatever changes you have in mind


Please note this is only the start of the this project there is a lot to add.
this is a concept i want to push forward and needs work.
you can download and open the example rar wich contains an example project with the component.
