import React, { Component } from 'react';
import Table from './Table';
import LLTE from './LLTE';
import cloneDeep from 'clone-deep';

const ANIMATION_LENGTH = 1000;

class Unfreeze extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.onKeyDown = this.onKeyDown.bind(this);
        this.animate = this.animate.bind(this);
    }

    animate() {
        this.requestId = setTimeout(this.animate, 30);
        this.setState({ time: Date.now() });
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
        if (!this.requestId) {
            this.animate();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown);
        if (this.requestId) {
            clearTimeout(this.requestId);
            this.requestId = null;
        }
    }

    calcTransition(prevTable, _table) {
        if (!prevTable || !prevTable.rows) {
            return null;
        }
        const table = cloneDeep(_table);
        table.rows.forEach(it => {
            const row = LLTE.findRow(prevTable, it.id);
            if (!row) return;
            it.prevPlace = row.actualPlace;
        });
        return table;
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
                    table,
                    composited: this.calcTransition(prevState.table, table),
                    lastUpdate: Date.now(),
                    time: Date.now()
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
        const passed = this.state.time - this.state.lastUpdate;
        let table;
        if (this.state.composited && passed < ANIMATION_LENGTH) {
            table = cloneDeep(this.state.composited);
            table.rows.forEach(it => {
                it.actualPlace = it.prevPlace + (it.actualPlace - it.prevPlace) * (passed / ANIMATION_LENGTH);
            })
        } else {
            table = this.state.table;
        }
        return <Table table={table} />;
    }
}

export default Unfreeze;