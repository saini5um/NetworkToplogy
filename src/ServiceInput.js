import React from 'react';
import States from './IndiaStates.json';

class ServiceInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedState: 'GUJ'};
        
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    handleChange(event) {
        this.setState({selectedState:event.target.value})
    }

    render () {
        const states = States;
        return (
            <div className="App-default">
                <label htmlFor="Circle">Circle:</label>

                <select className="App-default" value={this.state.selectedState} onChange={this.handleChange} name="state" id="state">
                {states.map((state) => (
                    <option value={state.id}>{state.display}</option>
                ))}
                </select>
                <label htmlFor="Service">Service:</label>
                <select className="App-default" name="service" id="service">
                    <option value="1">901575590</option>
                </select>
            </div>
        );
    }
}

export default ServiceInput;