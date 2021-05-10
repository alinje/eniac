import 'regenerator-runtime/runtime'
import React, { useMemo, useEffect, useState } from 'react'
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable, useAsyncDebounce } from 'react-table'
import {matchSorter} from "match-sorter"
import { COLUMNS } from './columns'
//import './table.module.css'


export default function BasicTable(props) {

    const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter, }) => {
        const count = preGlobalFilteredRows.length
        const [value, setValue] = useState(globalFilter)
        const onChange = useAsyncDebounce(value => {
            setGlobalFilter(value || undefined)
        }, 200)

        return (
            <span>
                Search:{' '} {/* This filter is for every kind of value */}
                <input
                    value={value || ""}
                    onChange={e => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    placeholder={`${count} records...`}
                    style={{
                        fontSize: '1.1rem',
                        border: '0',
                    }}
                />
            </span>
        )
    }

    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length

        return (
            <input
                value={filterValue || ''}
                onChange={e => {
                    setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
                }}
                placeholder={`Search ${count} records...`}
            />
        )
    }

    function CheckboxColumnFilter({
        column: { filterValue, setFilter, preFilteredRows, id },
    }) {
        // Calculate the options for filtering
        // using the preFilteredRows
        const options = React.useMemo(() => {
            const options = new Set()
            preFilteredRows.forEach(row => {
                options.add(row.values[id])
            })
            return [...options.values()]
        }, [id, preFilteredRows])

        // Render a multi-select box
        return (
            <form
                value={filterValue}
                onChange={e => {
                    setFilter(e.target.value || undefined)
                }}
            >
                <input type="checkbox" value="">All</input>
                {options.map((option, i) => (
                    <input type="checkbox" key={i} value={option}>
                        {option}
                    </input>
                ))}
            </form>
        )


    }


    function filterGreaterThan(rows, id, filterValue) {
        return rows.filter((row) => {
            const rowValue = row.values[id];
            return rowValue >= filterValue;
        });
    }

    filterGreaterThan.autoRemove = (val) => typeof val !== "number";

    function SliderColumnFilter({
        column: { filterValue, setFilter, preFilteredRows, id },
    }) {
        // Calculate the min and max
        // using the preFilteredRows

        const [min, max] = React.useMemo(() => {
            let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
            let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
            preFilteredRows.forEach(row => {
                min = Math.min(row.values[id], min)
                max = Math.max(row.values[id], max)
            })
            return [min, max]
        }, [id, preFilteredRows])

        return (
            <>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={filterValue || min}
                    onChange={e => {
                        setFilter(parseInt(e.target.value, 10))
                    }}
                />
                <button onClick={() => setFilter(undefined)}>Off</button>
            </>
        )
    }

    function fuzzyTextFilterFn(rows, id, filterValue) {
        return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
    }

    // Let the table remove the filter if the string is empty
    fuzzyTextFilterFn.autoRemove = val => !val

    const { dataRows = [] } = props
    const data = useMemo(() => dataRows, [props.dataRows]) // when not memoizing both data and columns the component complains of maximum update depth exceeded

    const findFilterFunc = (dataEx) => {
        //var dataEx = dataRows[0].key
        console.log({filterFunc: dataEx})

        switch (dataEx) {
            case (typeof dataEx == "number"):
                return SliderColumnFilter
            case (typeof dataEx == "object"): // list, aka labels
                return CheckboxColumnFilter
            default:
                return DefaultColumnFilter
        }
    }

    const findFilter = (dataEx) => {
        console.log({filterGen: dataEx})
        switch (dataEx) {
            case (typeof dataEx == "number"):
                return "equals"
            case (typeof dataEx == "object"): // list, aka labels
                return "includes"
            default:
                return "fuzzyText"
        }
    }

    // sets columns based on the keys of the first item in data list
    const columns = useMemo(() => {
        try {
            let keys = Object.keys(dataRows[0])
            if (keys.length > 0) {
                return Object.keys(dataRows[0]).map((key, id) => {
                    return ({
                        Header: key.charAt(0).toUpperCase() + key.slice(1), //TODO handle short strings
                        accessor: key,
                        Filter: findFilterFunc(dataRows[0][key]),
                        filter: findFilter(dataRows[0][key])
                        /*() => {
                            var dataEx = dataRows[0].key
                            switch (dataEx) {
                                case (typeof dataEx == "number"):
                                    return SliderColumnFilter
                                case (typeof dataEx == "object"): // list, aka labels
                                    return CheckboxColumnFilter
                                default:
                                    return DefaultColumnFilter
                            }
                        },
                        filter: () => {
                            var dataEx = dataRows[0].key
                            switch (dataEx) {
                                case (typeof dataEx == "number"):
                                    return "equals"
                                case (typeof dataEx == "object"): // list, aka labels
                                    return "includes"
                                default:
                                    return "fuzzyText"
                            }
                        }*/
                    })
                })
            } else {
                return COLUMNS //TODO some kind of nicer default
            }
        } catch (TypeError) {
            return COLUMNS
        }
    }, [props.dataRows])

    const filterTypes = React.useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id]
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        [props.dataRows]
    )

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter
        }),
        []
    );

    var tableInstance = useTable({
        columns,
        data,
        defaultColumn,
        filterTypes,
    },
        useFilters,
        useGlobalFilter,
        useSortBy
    )

    var {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter
    } = tableInstance







    return (
        <div>
            <table {...getTableProps()} className="tableWhole">
                <thead className="tableHeader" >
                    {
                        headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {
                                    headerGroup.headers.map((column) => (
                                        <th className="tableHeaderLabels" >  {/*      {...headerGroup.getHeaderGroupProps()}>       Should say "...column.getHeaderGroupProps()" according to YT tutorial, but it don't work ¯\_(ツ)_/¯ */}
                                            {column.render('Header')}
                                            {/* Add a sort direction indicator */}
                                            <div {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? ' 🔽'
                                                        : ' 🔼'
                                                    : ' ⏫'}
                                            </div>
                                            <div>{column.canFilter ? column.render('Filter') : null}</div>
                                            
                                        </th>
                                    ))
                                }

                            </tr>
                        ))
                    }
                    <tr>
                        <th colSpan={visibleColumns.length} style={{
                            textAlign: "left"
                        }}>
                            <GlobalFilter
                                preGlobalFilteredRows={preGlobalFilteredRows}
                                globalFilter={state.globalFilter}
                                setGlobalFilter={setGlobalFilter}
                            />
                        </th>
                    </tr>
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
            <div>
                <pre>
                    <code>{JSON.stringify(state.filters, null, 2)}</code>
                </pre>
            </div>
        </div>
    )
}