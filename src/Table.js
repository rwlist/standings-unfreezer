import React, { Component } from 'react'
import TableRow from './TableRow'
import './Table.css'

class Table extends Component {
    render() {
        const headerRow = {
            displayedPlace: '#',
            displayedName: 'Username',
            actualPlace: -1,
            score: 'Total',
            cells: this.props.table.problems.map(it => ({
                title: it.title,
                status: 'header',
                display: it.title
            }))
        };

        return (
            <div className="Table">
                <h1 className="Table-header">{this.props.table.name}</h1>
                <div>
                    <div className="Table-rows" style={{
                        minHeight: (this.props.table.rows.length * (this.props.table.rowSize + this.props.table.rowMargin)) + 'px'
                    }}>
                        <TableRow
                            row={headerRow}
                            size={this.props.table.rowSize}
                            offset={this.props.table.rowOffset}
                            margin={this.props.table.rowMargin}
                        />
                        {this.props.table.rows.map(it => (
                            <TableRow
                                row={it}
                                key={it.id}
                                size={this.props.table.rowSize}
                                offset={this.props.table.rowOffset}
                                margin={this.props.table.rowMargin}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default Table;