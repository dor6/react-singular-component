# SingularComponent
move your react component around the dom

animates your components movement around the dom
just give your wrap ypur component with the SingularComponent and give it a singularKey and a singularPriority

here is a component (using semantic ui react) from the example project: 

```class SingularSearch extends Component{

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
}```

i will render the SingularSearch component twice once with a singularPriority of 1 and once with a singularPriority of 2.
while i render both we will only see the instance with a priority of 2, but i will unmount the higher priority instance the component will move and change to the position and size of the lower priority instance.

here is a gif of the example with the component above: https://ibb.co/iGNeZS


please note this is only the start of the this project there is a lot to add.
you can download and open the example rar wich contains an example project with the component.
