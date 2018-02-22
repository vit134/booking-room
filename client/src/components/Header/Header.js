import React, { Component } from 'react';
import Button from '../Button/Button';

var buttonProps = {
    text: 'Создать встречу',
    cssClass: 'header__button',
    jsClass: 'js-add-event-btn',
    type: 'blue',
    link: '/newevent'
}

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openPopup: false
        };
    }

    render() {
        return (
            <header className={`header ${this.state.openPopup ? "header_hide-btn" : ""} `} >
                <div className="header__inner">
                    <a href="/" className="header__logo"></a>
                    <Button data={buttonProps}/>
                </div>
            </header>
        );
    }
}

export default Header;
