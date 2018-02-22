import React, { Component } from 'react';
import propTypes from 'prop-types';

class Button extends Component {
    render() {
        return (
            <a href={this.props.data.link} className={`${this.props.data.cssClass} button button_${this.props.data.type} ${this.props.data.jsClass}`}>{this.props.data.text}</a>
        );
    }
}

Button.propTypes = {
    data: propTypes.object,
    data: propTypes.shape({
        text: propTypes.string.isRequired
    })
}

export default Button;


