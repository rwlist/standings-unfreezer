import React, { Component } from 'react';
import './TableRow.css';

class TableRow extends Component {
    render() {
        return (
            <div 
                className={`TableRow` + (this.props.row.isSelected ? ' TableRow-selected' : '')} 
                style={{ 
                    height: (this.props.size) + 'px',
                    top: ((this.props.size + this.props.margin) * this.props.row.actualPlace) + 'px'
                }}
            >
                <div className="TableRow-cell">{this.props.row.displayedPlace}</div>
                <div className="TableRow-name">{this.props.row.displayedName}</div>
                {this.props.row.cells.map(it => (
                    <div key={it.title} className={`TableRow-cell TableRow-cell-${it.status}`}>{it.display}</div>
                ))}
                <div className="TableRow-cell">{this.props.row.score}</div>
            </div>
        )
    }
}

export default TableRow;