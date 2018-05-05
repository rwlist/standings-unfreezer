import React, { Component } from 'react'
import TableRow from './TableRow'
import './Table.css'

class Table extends Component {
    render() {
        return (
            <div className="Table" style={{
                minHeight: (this.props.table.rows.length * (this.props.table.rowSize + this.props.table.rowMargin)) + 'px'
            }}>
                <h1 className="Table-header">{this.props.table.name}</h1>
                <div className="Table-rows">
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
        )
    }
}

export default Table;