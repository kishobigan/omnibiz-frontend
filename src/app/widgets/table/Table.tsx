'use client';
import React from "react";

interface TableColumn {
    key: string;
    header: string;
}

interface TableAction<T> {
    icon: React.ReactNode | ((row: T) => React.ReactNode);
    onClick: (row: T) => void;
}

interface TableProps<T> {
    data: T[];
    columns?: TableColumn[];
    actions?: TableAction<T>[];
    currentPage?: number;
    rowsPerPage?: number;
    handleStatusChange?: (id: number, status: boolean) => void;
    emptyMessage?: string;
    cellRenderer?: (columnKey: string, cellData: any, row: T) => React.ReactNode;
    onRowClick?: (row: T) => void;
}

const Table = <T extends Record<string, any>>({
                                                  data,
                                                  columns = [],
                                                  actions = [],
                                                  currentPage = 1,
                                                  rowsPerPage = 10,
                                                  handleStatusChange,
                                                  emptyMessage,
                                                  cellRenderer,
                                                  onRowClick
                                              }: TableProps<T>) => {
    const startRow = (currentPage - 1) * rowsPerPage;
    const endRow = startRow + rowsPerPage;
    const currentData = data.slice(startRow, endRow);

    const renderCellContent = (columnKey: string, cellData: any, row: T) => {
        if (cellRenderer) {
            return cellRenderer(columnKey, cellData, row);
        }

        if (columnKey === 'action' && actions.length > 0) {
            return (
                <div className="action-icons">
                    {actions.map((action, index) => (
                        <span key={index} onClick={() => action.onClick(row)}
                              style={{marginRight: '14px', cursor: 'pointer'}}>
                            {typeof action.icon === 'function' ? action.icon(row) : action.icon}
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
                        id={`switch-${(row as any).staffId}`}
                        checked={cellData === 'on'}
                        onChange={() => handleStatusChange((row as any).staffId, cellData === 'off')}
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
