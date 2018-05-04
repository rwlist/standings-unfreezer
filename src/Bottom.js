import React, { Component } from 'react';
import logo from './logo.svg';
import './Bottom.css';

class Bottom extends Component {
    render() {
        return (
            <div className="Bottom">
                Built with 
                <img src={logo} className="Bottom-logo" title="React" alt="React"/>
                by 
                <a className="Bottom-link" href="https://github.com/petuhovskiy">
                    Arthur Petukhovsky
                </a>
            </div>
        );
    }
}

export default Bottom;