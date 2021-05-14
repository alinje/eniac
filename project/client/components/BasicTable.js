import 'regenerator-runtime/runtime' // https://github.com/tannerlinsley/react-table/issues/2071
import React, { useMemo, useEffect, useState } from 'react'
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable, useAsyncDebounce } from 'react-table'
import { matchSorter } from "match-sorter"
import { COLUMNS } from './columns'

import Slider from '@material-ui/core/Slider';
//import './table.module.css'


export default function BasicTable(props) {

    // Formats string to beginning character capitalized and '_' replaced with ' '
    const formatString = (str) => {
        if (str.length < 2) return str.toUpperCase()
        return str.charAt(0).toUpperCase() + str.replace(/_/g, ' ').slice(1)
    }

    /**
     * UI for the global filter, presenting as the global search field
     */
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

    /**
     * The default column filter is a search field
     */
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
        // options is a set of the the different options for the filter, this is every value in any row in the column
        const options = useMemo(() => {
            const options = new Set()
            preFilteredRows.forEach(row => {
                row.values.labels.forEach(item => options.add(item))
            })
            return [...options.values()]
        }, [id, preFilteredRows])

        const onChange = (e) => {
            const t = e.target.value;
            if (typeof filterValue === 'undefined' || filterValue === []) {
                setFilter([t])
            } else {
                setFilter((old) => (old.includes(t) ? old.filter(filter => filter != t) : [...old, t]))
            }
        }

        // https://github.com/tannerlinsley/react-table/discussions/2350
        return (
            <form
                value={filterValue}
            >
                <input type="checkbox" key="All labels" value="" onChange={() => {
                    if (typeof filterValue === 'undefined' || filterValue.length != 0) setFilter([])
                }} checked={typeof filterValue === 'undefined' || filterValue.length == 0 ? true : false}
                ></input>
                <label for="All labels">All labels</label>
                {options.map((option, i) => (
                    <span>
                        {/** key is for the checkbox label
                           * value is for filtering in onChange
                           * checked is a boolean determening whether the box is checked or not
                        */}
                        <input type="checkbox" key={i} value={option || ''}
                            name="label"
                            checked={typeof filterValue !== 'undefined' && filterValue.includes(option) ? true : false}
                            onChange={onChange}></input>
                        <label for={i}>{formatString(option)}</label>
                    </span>

                ))}
            </form>
        )
    }


    const multipleSelectionFilter = (rows, ids, filterValues) => {
        if (typeof filterValues == 'undefined' || filterValues.length === 0) return rows;
        
        return rows.filter(row => { // returns rows which pass the test
            return ids.some(id => { // returns columns, of rows which pass the test, which test is applicable for
                const rowValue = row.values[id] // values that can be determined passing or not
                return rowValue.some(val => { // returns values which match any of the provided filters
                    return filterValues.includes(val)
                })
            })
        })
    }


    function SliderColumnFilter({
        column: { filterValue = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], preFilteredRows, setFilter, id },
    }) {

        // https://codesandbox.io/s/91yti?file=/demo.js


        // Min and max values are dynamic, changing depending on the values present in the column
        const [min, max] = useMemo(() => {
            let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
            let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
            preFilteredRows.forEach(row => {
                min = Math.min(row.values[id], min)
                max = Math.max(row.values[id], max)
            })
            return [min, max]
        }, [id, filterValue])


        return (
            <>
                <Slider
                    min={min}
                    max={max}
                    value={filterValue || [min, max]}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    getAriaValueText={(val) => (String(val) || "")}
                    onChange={(e, val) => {
                        setFilter(val || undefined)
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
        switch (dataEx) {
            case "total_volume":
                return SliderColumnFilter
            case "labels":
                return CheckboxColumnFilter
            case "label":
            default:
                return DefaultColumnFilter
        }
    }

    // the documentation for these filters is well fucking hidden https://github.com/tannerlinsley/react-table/blob/master/src/filterTypes.js
    const findFilter = (dataEx) => {
        switch (dataEx) {
            case "total_volume":
                return "between"
            case "labels":
                return multipleSelectionFilter // custom filter
            case "label":
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
                        Header: formatString(key),
                        accessor: key,
                        Filter: findFilterFunc(key),
                        filter: findFilter(key),
                        Cell: ({value}) => {
                            if (typeof value != "object") return formatString(value)
                            // if the cell value is an array we want to join the values with comma and spacing
                            try {
                                const tagList = value.map(formatString).join(", ")
                                return <span>{tagList}</span>
                            } catch(Error){ // ugly way to catch case where cell value is neither flat nor array
                                return formatString(value)
                            }

                        }
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
                                            <span {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? ' 🔽'
                                                        : ' 🔼'
                                                    : ' ⏫'}
                                            </span>
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
        </div>
    )
}