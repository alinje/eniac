import React, { useMemo, useEffect } from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'
import { COLUMNS } from './columns'
//import './table.module.css'


export default function BasicTable(props) {

    const { dataRows = [] } = props
    const data = useMemo(() => dataRows, [props.dataRows]) // when not memoizing both data and columns the component complains of maximum update depth exceeded

    // sets columns based on the keys of the first item in data list
    const columns = useMemo(() => {
        try {
            let keys = Object.keys(dataRows[0])
            if (keys.length == COLUMNS.length) {
                return Object.keys(dataRows[0]).map((key, id) => {
                    return {
                        Header: key.charAt(0).toUpperCase() + key.slice(1), //TODO handle short strings
                        accessor: key
                    }
                })
            } else {
                return COLUMNS //TODO some kind of nicer default
            }
        } catch (TypeError) {
            return COLUMNS
        }
    }, [props.dataRows])


    var tableInstance = useTable({
        columns,
        data,
    },
        useSortBy
    )

    var {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance


    return (
        <table {...getTableProps()} className="tableWhole">
            <thead className="tableHeader" >
                {
                    headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {
                                headerGroup.headers.map((column) => (
                                    <th className="tableHeaderLabels" {...column.getHeaderProps(column.getSortByToggleProps())}>  {/*      {...headerGroup.getHeaderGroupProps()}>       Should say "...column.getHeaderGroupProps()" according to YT tutorial, but it don't work ¯\_(ツ)_/¯ */}
                                        {column.render('Header')}
                                        {/* Add a sort direction indicator */}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? ' 🔽'
                                                    : ' 🔼'
                                                : ' ⏫'}
                                        </span>
                                            
                                    </th>
                                ))
                            }

                        </tr>
                    ))
                }
            </thead>
            <tbody {...getTableBodyProps()}>
                {
                    rows.map(row => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()} className="tableRows">
                                {
                                    row.cells.map((cell) => {
                                        return <td className="tableItems"{...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })
                                }
                            </tr>
                        )
                    }
                    )
                }
            </tbody>

        </table>

    )
}