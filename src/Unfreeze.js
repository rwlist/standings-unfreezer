import React, { Component } from 'react';
import Table from './Table';
import LLTE from './LLTE';
import cloneDeep from 'clone-deep';

class Unfreeze extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.onKeyDown = this.onKeyDown.bind(this);
    }

    init() {
        const llte = cloneDeep(this.props.llte);
        llte.reverse();
        this.setState({ 
            pending: llte,
            table: {} 
        });
        this.makeStep();
    }

    componentWillMount() {
        this.init();
        document.addEventListener('keydown', this.onKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown);
    }

    makeStep() {
        this.setState((prevState, props) => {
            const pending = cloneDeep(prevState.pending);
            const event = pending.pop();
            if (event) {
                const table = cloneDeep(prevState.table);
                LLTE.applyEvent(table, event);
                table.rows.sort(LLTE.placeComparator);
                return {
                    pending,
                    table
                }
            }
            return {};
        });
    }

    onKeyDown(e) {
        if (e.keyCode === 70) { // f
            this.init();
        }
        if (e.keyCode === 39) { // right arrow
            this.makeStep();
        }
        if (e.keyCode === 27) { // stop unfreeze
            this.props.stopUnfreeze();
        }
    }

    render() {
        return <Table table={this.state.table} />;
    }
}

export default Unfreeze;