'use client'
import React from "react";

interface TableData {
    [key: string]: any;
}

interface TableColumn {
    key: string;
    header: string;
}

interface TableAction {
    icon: React.ReactNode;
    onClick: (row: TableData) => void;
}

interface TableProps {
    data: TableData[];
    columns?: TableColumn[];
    actions?: TableAction[];
    currentPage?: number;
    rowsPerPage?: number;
    handleStatusChange?: (id: number, status: boolean) => void;
    emptyMessage?: string;
}

const Table: React.FC<TableProps> = ({
                                         data,
                                         columns = [],
                                         actions = [],
                                         currentPage = 1,
                                         rowsPerPage = 10,
                                         handleStatusChange,
                                         emptyMessage
                                     }) => {
    const startRow = (currentPage - 1) * rowsPerPage;
    const endRow = startRow + rowsPerPage;
    const currentData = data.slice(startRow, endRow);

    const renderCellContent = (columnKey: string, cellData: any, row: TableData) => {
        if (columnKey === 'action' && actions.length > 0) {
            return (
                <div className="action-icons">
                    {actions.map((action, index) => (
                        <span key={index} onClick={() => action.onClick(row)}
                              style={{marginRight: '14px', cursor: 'pointer'}}>
                            {action.icon}
                        </span>
                    ))}
                </div>
            );
        }
        if (columnKey === 'status' && handleStatusChange) {
            return (
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id={`switch-${row.staffId}`}
                        checked={cellData === 'on'}
                        onChange={() => handleStatusChange(row.staffId, cellData === 'off')}
                    />
                </div>
            );
        }
        return cellData;
    };

    return (
        <table className="table">
            <thead className='table-light'>
            <tr>
                {columns.map((column) => (
                    <th key={column.key}>{column.header}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {currentData.length === 0 ? (
                <tr>
                    <td colSpan={columns.length + 1} className="text-center">
                        <p>No {emptyMessage} found.</p>
                    </td>
                </tr>
            ) : (
                currentData.map((row, index) => (
                    <tr key={index}>
                        {columns.map((column) => (
                            <td key={column.key}>
                                {renderCellContent(column.key, row[column.key], row)}
                            </td>
                        ))}
                    </tr>
                ))
            )}
            </tbody>
        </table>
    );
};

export default Table;
