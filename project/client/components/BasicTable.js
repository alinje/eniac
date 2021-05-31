import 'regenerator-runtime/runtime' // https://github.com/tannerlinsley/react-table/issues/2071
import React, { useMemo, useEffect, useState } from 'react'
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable, useAsyncDebounce, useExpanded } from 'react-table'
import { matchSorter } from "match-sorter"
import { COLUMNS } from './columns'

import Slider from '@material-ui/core/Slider';
import PieChart from '../public/PieChart'
//import './table.module.css'
import SubComponentLabel from '../public/SubComponentLabel.js'


export default function BasicTable(props) {

    // FILTER SETUP

    // Formats string to beginning character capitalized and '_' replaced with ' '
    const formatString = (str) => {
        try {
            if (typeof str === "number") {                
                return str
            }
            var fStr = String(str)
            if (fStr.length < 2) return fStr.toUpperCase()
            return fStr.charAt(0).toUpperCase() + fStr.replace(/_/g, ' ').slice(1)
        } catch (e) { // if column value is not supported as argument to String(str) the value is just returned in its original form
            console.log(e)
            return str
        }

    }

    /**
     * UI for the global filter, presenting as the global search field
     * Global search filter is currently not used due to incompability with expanding rows
     * This might be fixable
     */
    const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter, }) => {
        const count = preGlobalFilteredRows.length
        const [value, setValue] = useState(globalFilter)
        const onChange = useAsyncDebounce(value => {
            setGlobalFilter(value || undefined)
        }, 200)

        return (
            <span>
                Search:{' '}
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
     * The default column filter UI is a search field
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


    /**
     * A type of column filter UI is a checkbox column filter
     */
    function CheckboxColumnFilter({
        column: { filterValue, setFilter, preFilteredRows, id },
    }) {
        // options is a set of the the different options for the filter, this is every value in any row in the column
        const options = useMemo(() => {
            try {
                const options = new Set()
                preFilteredRows.forEach(row => {
                    row.values.labels.forEach(item => options.add(item))
                })
                return [...options.values()]
            } catch (e) {
                console.log(e)
                return []
            }

        }, [id, preFilteredRows])

        // change the filter (filter presumed to be a list of possible values) 
        // to include or not include checkbox value depending on initial value
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
                        <label>
                            <input type="checkbox" key={i} value={option || ''}
                                name="label"
                                checked={typeof filterValue !== 'undefined' && filterValue.includes(option) ? true : false}
                                onChange={onChange}></input>
                            {formatString(option)}
                        </label>

                    </span>

                ))}
            </form>
        )
    }

    /**
     * Filter used for filtering with multiple possible kinds of values
     * Here used with CheckboxColumnFilter UI
     */
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


    /**
     * A type of column filter UI with a slider
     */
    function SliderColumnFilter({
        column: { filterValue = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], preFilteredRows, setFilter, id },
    }) {
        // Min and max values are dynamic, changing depending on the values present in the column
        // TODO this occasionally causes a null pointer exception
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


    /**
     * Default search filter uses fuzzy search
     */
    function fuzzyTextFilterFn(rows, id, filterValue) {
        return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
    }

    // Let the table remove the filter if the string is empty
    fuzzyTextFilterFn.autoRemove = val => !val


    // DATA FROM PROPS

    // props.dataRows defaults to an empty string if not set by client or undefined in other way
    const { dataRows = [] } = props

    // memoizing is required by react-table https://react-table.tanstack.com/docs/api/useTable
    // when not memoizing both data and columns the component complains of maximum update depth exceeded
    const data = useMemo(() => dataRows, [props.dataRows]) 

    // function for finding filter UIs to different types of columns
    const findFilterFunc = (dataEx) => {
        switch (dataEx) {
            case "total_volume":
            case "Long":
            case "Short":
            case "Total":
                return SliderColumnFilter
            case "labels":
                return CheckboxColumnFilter
            case "label":
            default:
                return DefaultColumnFilter
        }
    }

    // function for finding filters to different types of columns
    // the documentation for these filters is well fucking hidden https://github.com/tannerlinsley/react-table/blob/master/src/filterTypes.js
    const findFilter = (dataEx) => {
        switch (dataEx) {
            case "total_volume":
            case "Long":
            case "Short":
            case "Total":
                return "between"
            case "labels":
                return multipleSelectionFilter // custom filter
            case "label":
            default:
                return "fuzzyText"
        }
    }

    // usage of defaultColumn will render BasicTable unusable. It does not however crash the entire application
    const defaultColumn = React.useMemo(
        () => ({
            accessor: "column_fail",
            // default column uses default filter
            Filter: DefaultColumnFilter
        }),
        []
    );



    // sets columns based on the keys of the first item in data list
    const columns = useMemo(() => {
        try {
            //let keys = Object.keys(dataRows[0])
            return Object.keys(dataRows[0]).map((key, id) => {
                try {
                    return ({
                        Header: formatString(key),
                        accessor: key,
                        Filter: findFilterFunc(key),
                        filter: findFilter(key),
                        Cell: ({ value }) => {
                            if (typeof value === "string") return formatString(value)

                            if (typeof value != "object") return value
                            // if the cell value is an array we want to join the values with comma and spacing
                            try {
                                const tagList = value.map(formatString).join(", ")
                                return <span>{tagList}</span>
                            } catch (Error) { // ugly way to catch case where cell value is neither flat nor array
                                return formatString(value)
                            }

                        }
                    })
                } catch (e) {
                    console.log(e)
                    return ({
                        Header: key,
                        accessor: key
                    })
                }
            })
        } catch (TypeError) {
            // TODO this is not very pretty nor appropriate
            return [defaultColumn]
        }

    }, [props.dataRows])


    const newTableFilter = (item, cat, filter) => {
        return item.labels.includes()
    }

    // this is required for useTable
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


    // This function is the one called from the table and creates the subcomponent
    const renderRowSubComponent = React.useCallback(

        ({ row }) => {
            if (typeof props.childShow === 'undefined') {
                return (<div></div>)
            }
            return (
                <div>
                    {props.childShow.map((val) => {
                        return renderASubComp(row, val)
                    })}

                </div>

            )
        },
        [props.dataRows]
    )

    // Used by renderRowSubComponent
    const renderASubComp = (row, type) => {
        return (
            <div>
                <SubComponentLabel data={row.values[type]} show={type} />
            </div>
        )
    }

    // this is where the actual useTable function from react-table library is called
    var tableInstance = useTable({
        columns,
        data,
        defaultColumn,
        filterTypes,
    },
        useFilters,
        //useGlobalFilter,
        useSortBy,
        useExpanded,
    )

    // these are the props we receive from the above call
    var {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { expanded },
        visibleColumns,
        //preGlobalFilteredRows,
        //setGlobalFilter
    } = tableInstance



    // this is the actual table being composed
    return (
        <div>
            <table {...getTableProps()}>
                <thead>
                    {
                        headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {
                                    headerGroup.headers.map((column) => (
                                        <th className="tableHeaderLabels" {...column.getHeaderProps()}>  
                                            {column.render('Header')}
                                            {/* Add a sort direction indicator */}
                                            <span {...column.getHeaderProps(column.getSortByToggleProps)}>
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
                            {/* <GlobalFilter
                                preGlobalFilteredRows={preGlobalFilteredRows}
                                globalFilter={state.globalFilter}
                                setGlobalFilter={setGlobalFilter}
                            /> */}

                        </th>
                    </tr>
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        rows.map(row => {
                            prepareRow(row)

                            return (
                                <React.Fragment>

                                    {/* renders rows normally if not extended, with top half of border if extended */}
                                    {row.isExpanded ? (
                                        <tr {...row.getRowProps()} {...row.getToggleRowExpandedProps()} className="blueBorderTop">

                                            {
                                                row.cells.map((cell) => {
                                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                })
                                            }


                                        </tr>
                                    ) : (
                                        <tr {...row.getRowProps()} {...row.getToggleRowExpandedProps()}>

                                            {
                                                row.cells.map((cell) => {
                                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                })
                                            }


                                        </tr>
                                    )}

                                    {/* renders the expanded content */}
                                    {row.isExpanded ? (
                                        <tr className="blueBorderBottom">
                                            <td colSpan={visibleColumns.length}>
                                                {renderRowSubComponent({ row })}
                                            </td>
                                        </tr>
                                    ) : null}
                                </React.Fragment>
                            )
                        }
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}