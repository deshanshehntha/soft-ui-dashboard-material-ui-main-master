import React, {Component} from 'react';
import {Input} from "@material-ui/core";

export default class PersonFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterText: null,
        };
    }

    doesFilterPass(params) {
        // make sure each word passes separately, ie search for firstname, lastname
        let passed = true;
        this.state.filterText
            .toLowerCase()
            .split(' ')
            .forEach((filterWord) => {
                const value = this.props.valueGetter(params);

                if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
                    passed = false;
                }
            });

        return passed;
    }

    isFilterActive() {
        return this.state.filterText != null && this.state.filterText !== '';
    }

    getModel() {
        return {value: this.state.filterText};
    }


    onChange(event) {
        this.setState({filterText: event.target.value}, () =>
            this.props.filterChangedCallback()
        );
    }

    render() {
        return (
            <div style={{padding: 4, width: 400}}>
                <div style={{fontWeight: 'bold'}}>Filter Patient</div>
                <div>
                    <Input
                        type="text"
                        value={this.state.filterText}
                        onChange={this.onChange.bind(this)}
                        placeholder="Full name search..."
                    />
                </div>
            </div>
        );
    }
}
