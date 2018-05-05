import React, { Component } from 'react';
import Bottom from './Bottom';
import Menu from './Menu'
import './App.css';

import demoContest from './demoContest'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contest: demoContest,
            llte: [], // low-level table events
            page: 'menu'
        }

        this.updateContest = this.updateContest.bind(this);
        this.updateLLTE = this.updateLLTE.bind(this);
    }

    updateContest(contest) {
        this.setState({ contest });
    }

    updateLLTE(llte) {
        this.setState({ llte });
    }

    render() {
        return (
            <div className="App">
                {this.state.page === 'menu' || <Menu 
                    contest={this.state.contest}
                    updateContest={this.updateContest}
                    llte={this.state.llte}
                    updateLLTE={this.updateLLTE}
                />}
                <Bottom />
            </div>
        );
    }
}

export default App;
