import React, { useMemo, useEffect } from 'react'
import { usePagination, useTable } from 'react-table'
import { COLUMNS } from './columns'
//import './table.module.css'


export default function BasicTable(props) {

    const columns = COLUMNS
    const {dataRows = []} = props
    var data = dataRows
    


    
    var tableInstance = useTable({
        columns,
        data,
    })

    var {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance 


    return (
        <table {...getTableProps()}>
            <thead>
                {
                    headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {
                                headerGroup.headers.map((column) => (
                                    <th {...headerGroup.getHeaderGroupProps()}> {/* Should say "...column.getHeaderGroupProps()" according to YT tutorial, but it don't work ¯\_(ツ)_/¯ */}
                                   t {column.render('Header')}

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
                            <tr {...row.getRowProps()}>
                                {
                                    row.cells.map((cell) => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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