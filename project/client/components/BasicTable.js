import React, { useMemo } from 'react'
import { useTable } from 'react-table'
import DATA from '../../server/test-aktie.json' //Not the right JSON!!
import { COLUMNS } from './columns'
//import './table.module.css'


export const BasicTable = (props) => {
    console.log(props)
    

    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => DATA, [])

    const tableInstance = useTable({
        columns,
        data
    })

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance
    //https://stackoverflow.com/questions/63234735/how-to-extract-rows-from-a-queryresult-array-from-postgres
    return (
        <div>
            <p>{JSON.stringify(props.rows)}</p>
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
                        return(
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
        </div>
        
    )
}