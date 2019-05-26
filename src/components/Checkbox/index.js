import React, { Component } from 'react';


export default class Checkbox extends Component {
    render() {
        return (
            <div className="checkbox">
                <input type="checkbox" id="cb" />
                <label htmlFor="cb" className='checkbox-label'>Checkbox</label>
            </div>
        );
    }
}