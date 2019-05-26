import React, { Component } from 'react';
import Grid from './components/Grid';


export default class Hello extends Component {
    render() {
        console.log('HELLO');

        return (
            <div>
                <h2>
                    HELLO COMPONENT
                </h2>

                <Grid />
            </div>
        )
    }
}
