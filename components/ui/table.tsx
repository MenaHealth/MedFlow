"use client"

import React, {useState, useMemo, useRef, useEffect} from 'react'
import { ChevronUp, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'
import { Resizable } from './../ui/Resizable'

export interface TableColumn<T> {
    key: keyof T | string
    id?: string
    header: string
    render?: (value: any, item: T) => React.ReactNode
    hidden?: boolean
    nestedKey?: string
    width?: string
    resizable?: boolean
}

interface TableProps<T> {
    data: T[]
    columns: TableColumn<T>[]
    onRowClick?: (item: T) => void
    backgroundColor?: string
    textColor?: string
    borderColor?: string
    headerBackgroundColor?: string
    headerTextColor?: string
    hoverBackgroundColor?: string
    hoverTextColor?: string
    stickyHeader?: boolean
}

export function Table<T>({
                             data,
                             columns,
                             onRowClick,
                             backgroundColor = 'bg-white',
                             textColor = 'text-gray-900',
                             borderColor = 'border-gray-200',
                             headerBackgroundColor = 'bg-gray-100',
                             headerTextColor = 'text-gray-700',
                             hoverBackgroundColor = 'hover:bg-gray-50',
                             hoverTextColor = 'hover:text-gray-900',
                             stickyHeader = false,
                         }: TableProps<T>) {
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [expandedColumns, setExpandedColumns] = useState<string[]>([])
    const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({})
    const tableRef = useRef<HTMLDivElement>(null)
    const [isOneColumn, setIsOneColumn] = useState(false)

    const hiddenColumns = useMemo(() => columns.filter(col => col.hidden).map(col => col.key.toString()), [columns])

    useEffect(() => {
        setIsOneColumn(columns.filter(col => !col.hidden).length === 1)
    }, [columns, expandedColumns])

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const toggleColumnExpansion = (column: string) => {
        setExpandedColumns(prev =>
            prev.includes(column) ? prev.filter(col => col !== column) : [...prev, column]
        )
    }

    const toggleAllColumns = () => {
        setExpandedColumns(prev =>
            prev.length === hiddenColumns.length ? [] : hiddenColumns
        )
    }

    const handleColumnResize = (columnKey: string, width: number) => {
        setColumnWidths(prev => ({ ...prev, [columnKey]: width }))
    }

    const sortedData = useMemo(() => {
        if (!data) return []; // Return an empty array if data is undefined
        if (sortColumn) {
            return [...data].sort((a: any, b: any) => {
                const aValue = sortColumn.includes('.') ? sortColumn.split('.').reduce((obj, key) => obj && obj[key], a) : a[sortColumn];
                const bValue = sortColumn.includes('.') ? sortColumn.split('.').reduce((obj, key) => obj && obj[key], b) : b[sortColumn];
                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return data;
    }, [data, sortColumn, sortDirection]);

    const getNestedValue = (obj: any, path: string): any => {
        return path.split('.').reduce((value, key) => (value && typeof value === 'object' ? value[key] : undefined), obj);
    };

    const getCellValue = (item: T, column: TableColumn<T>): React.ReactNode => {
        let value;
        if (column.render) {
            value = column.render(
                column.nestedKey ? getNestedValue(item, column.nestedKey) : item[column.key as keyof T],
                item
            );
        } else if (column.nestedKey) {
            value = getNestedValue(item, column.nestedKey);
        } else {
            value = item[column.key as keyof T];
        }

        if (Array.isArray(value)) {
            return (
                <div className="space-y-2">
                    {value.map((item, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <hr className="border-t-2 border-orange-500" />}
                            <div>{item}</div>
                        </React.Fragment>
                    ))}
                </div>
            );
        }

        return value as React.ReactNode;
    };

    const renderHeaderCell = (column: TableColumn<T>) => {
        const content = (
            <div className="flex items-center">
                {column.hidden ? (
                    <button
                        onClick={() => toggleColumnExpansion(column.key.toString())}
                        className="flex items-center focus:outline-none group relative"
                        title={column.header}
                    >
                        <ChevronRight
                            className={`mr-1 h-4 w-4 transition-transform ${expandedColumns.includes(column.key.toString()) ? 'rotate-90' : ''}`}
                        />
                        <span className={`font-bold ${expandedColumns.includes(column.key.toString()) ? '' : 'truncate w-8'}`}>
              {expandedColumns.includes(column.key.toString()) ? column.header : column.header.substring(0, 2)}
            </span>
                        <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                    </button>
                ) : (
                    <button
                        onClick={() => handleSort(column.key.toString())}
                        className="flex items-center focus:outline-none group relative"
                    >
                        {column.header}
                        {sortColumn === column.key && (
                            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                        <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                    </button>
                )}
            </div>
        )

        if (column.resizable) {
            return (
                <Resizable
                    defaultWidth={columnWidths[column.key.toString()] || 200}
                    onResize={(width) => handleColumnResize(column.key.toString(), width)}
                >
                    {content}
                </Resizable>
            )
        }

        return content
    }

    return (
        <div
            ref={tableRef}
            className={`relative overflow-x-auto ${backgroundColor} ${stickyHeader ? 'max-h-[500px] overflow-y-auto' : ''}`}
            style={{ paddingBottom: isOneColumn ? '2rem' : '0' }} // Add padding when there's only one column
        >
            <table className={`w-full border-collapse ${textColor}`}>
                <thead
                    className={`${headerBackgroundColor} ${headerTextColor} ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.id || column.key.toString()}
                            className={`px-4 py-2 ${column.width || ''} ${column.hidden && !expandedColumns.includes(column.key.toString()) ? 'w-12' : ''}`}
                            style={{width: columnWidths[column.key.toString()]}}
                        >
                            {renderHeaderCell(column)}
                        </th>
                    ))}
                    <th className="px-4 py-2 w-12">
                        <button
                            onClick={toggleAllColumns}
                            className="flex items-center focus:outline-none group relative"
                            title={expandedColumns.length === hiddenColumns.length ? "Collapse All" : "Expand All"}
                        >
                            <ChevronLeft className="h-4 w-4"/>
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>
                {sortedData.length > 0 ? (
                    sortedData.map((item, index) => (
                        <tr
                            key={index}
                            className={`border-t ${borderColor} ${onRowClick ? 'cursor-pointer' : ''} ${hoverBackgroundColor} ${hoverTextColor}`}
                            onClick={() => onRowClick && onRowClick(item)}
                        >
                            {columns.map((column) => (
                                <td
                                    key={column.key.toString()}
                                    className={`px-4 py-2 ${column.width || ''} ${column.hidden && !expandedColumns.includes(column.key.toString()) ? 'hidden' : ''}`}
                                    style={{width: columnWidths[column.key.toString()]}}
                                >
                                    {getCellValue(item, column)}
                                </td>
                            ))}
                            <td className="px-4 py-2 w-12"></td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} className="text-center py-4">
                            No data available.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}