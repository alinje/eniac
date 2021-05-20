import Link from 'next/link'
import styles from '../styles/Home.module.css' // TODO a common CSS strategy is needed
import Head from 'next/head'
import React, { useState } from 'react'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from 'react-query' // importerar

import LineDiagram from '../public/LineDiagram.js'
import DistributionChart from '../public/DistributionChart.js'
import BasicTable from "../components/BasicTable";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';


export default function EditLabels() {
	const queryClient = useQueryClient()
	const labelsdata = useQuery("dbLabelsdata", () => fetch("http://localhost:3001/get-labels").then(((res) => res.json()))) // despite the name, does not return a JSON object
	const stockswithlabeldata = useQuery("dbStocksWithLabelsData", () => fetch("http://localhost:3001/get-stocks-with-labels").then(((res) => res.json()))) // despite the name, does not return a JSON object
    const stocksdata = useQuery("dbStocksData", () => fetch("http://localhost:3001/get-stocks").then(((res) => res.json()))) // despite the name, does not return a JSON object
    const stocksonlywithlabeldata = useQuery("dbOnlyStocksWithLabelsData", () => fetch("http://localhost:3001/get-onlystocks-with-labels").then(((res) => res.json()))) // despite the name, does not return a JSON object

    //Variables that becomes the current selected item
    //addLabel
    let addLabelConst = null
    //deleteLabel
    let deleteLabelSelected = null
    //addLabelToStock
    let stockSelectedAdd = null
    let labelSelectedAdd = null
    let assWeightAdd = null
    //deleteLabelFromStock
    let stockSelectedDel = null
    let labelSelectedDel = null
    //editWeight
    let stockSelectedEdit = null
    let labelSelectedEdit = null
    let assWeightEdit = null

	
    //Sends the added label name through JSON to the server
	const addLabel = async event => {
		event.preventDefault()
        if(addLabelConst != null){
        const res = await fetch('http://localhost:3001/addLabels', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({label: addLabelConst})
		},window.location.reload())
        const result = await res.json()
        }
	}
	
	 //Sends the deleted label name through JSON to the server
	const deleteLabel = async event => {
        event.preventDefault()
        if(deleteLabelSelected != null){
            const res = await fetch('http://localhost:3001/deleteLabel', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({label: deleteLabelSelected.name})
            }, window.location.reload())
            const result = await res.json()
	    }
	}

    //Sends stock and label name through JSON to the server
    const deleteLabelFromStock = async event => {
        event.preventDefault()
        if(labelSelectedDel != null || stockSelectedDel != null){
            const res = await fetch('http://localhost:3001/deleteLabelFromStock', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    label: labelSelectedDel.name,
                    stock: stockSelectedDel.stock
                })
            }, window.location.reload())
            const result = await res.json()
	    }
	}

    const addLabelToStock = async event => {
        event.preventDefault()
        if(labelSelectedAdd != null || stockSelectedAdd != null){
            if(assWeightAdd == null){assWeightAdd=1}
            const res = await fetch('http://localhost:3001/addLabelsToStock', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    label: labelSelectedAdd.name,
                    stock: stockSelectedAdd.name,
                    weight: assWeightAdd
                })
            }, window.location.reload())
            const result = await res.json()
	    }
	}

    const editWeight = async event => {
        event.preventDefault()
		if (labelSelectedEdit != null || stockSelectedEdit != null) {
            if(assWeightEdit == null){assWeightEdit=1}
            const res = await fetch('http://localhost:3001/editWeight', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    label: labelSelectedEdit.name,
                    stock: stockSelectedEdit.stock,
                    weight: assWeightEdit
                })
            }, window.location.reload())
            const result = await res.json()
	    }
	}


    //Constant containing the labels
    const labelProps = {
        options: labelsdata.data,
        getOptionLabel: (option) => option.name,
    };
    //Constant containing ALL the stocks
    const stockProps = {
        options: stocksdata.data,
        getOptionLabel: (option) => option.name,
	};
    //Constant containing only the stocks with labels
	const stockLabelProps = {
        options: stocksonlywithlabeldata.data,
        getOptionLabel: (option) => option.stock,
	};
	

    return (
        /* TODO something about flex is messing with the style classes */
        <div /*className={styles.container}*/>
            <Head>
                <title>Stocks sorted by labels</title>
                <link rel="icon" href="/favicon.ico" />

            </Head>
            <main  /*className={styles.main}*/>
                {/* Link to homepage*/
                /* Forms for editing and adding labels*/
                }
                <div className={styles.wrapper}>
                <h1 >Edit labels</h1>

                    <Link href="/" passHref>
                        <div className={styles.card}>
                            Back to homepage
                        </div>
                    </Link>
                </div>

                <div className={styles.wrapper}>




                    <div className={styles.nestedSpecial}>
                    <h3>Add label</h3>
                    <TextField
                        onChange={(event) => addLabelConst=event.target.value}
                        id="Add label"
                        label="Label"
                        type="text"
                    />
                    <Button variant="contained" color="primary" onClick={addLabel}>
                        Create label
                    </Button>
                    </div>

                    <div className={styles.nested}>
                        <h3>Delete label</h3>
                        {/* Form for deleting a label*/}
                        <Autocomplete
                            onChange={(event, value) => deleteLabelSelected = value}
                            {...labelProps}
                            id="Delete Label"
                            clearOnEscape
                            renderInput={(params) => <TextField {...params} label="Label" margin="normal" />}
                        />
                        <Button variant="contained" color="secondary" onClick={deleteLabel}>
                            Delete Label
                        </Button>
                    </div>

                    <div className={styles.nested}>
                    <h3>Add labels to stock with associated weight</h3>
                    <Autocomplete
                        onChange={(event, value) => stockSelectedAdd = value}
                        {...stockProps}
                        id="Stock"
                        clearOnEscape
                        renderInput={(params) => <TextField {...params} label="Stock" margin="normal" />}
                    />
                    <Autocomplete
                        onChange={(event, value) => labelSelectedAdd = value}
                        {...labelProps}
                        id="Add Label"
                        clearOnEscape
                        renderInput={(params) => <TextField {...params} label="Label" margin="normal" />}
                    />
                    <TextField
                        onChange={(event) => assWeightAdd=event.target.value}
                        id="standard-weight"
                        label="Weight"
                        type="number"
                        InputProps={{
                            inputProps: {
                                max: 3, min: 0, step: .1
                            }
                        }}
                    />
                    <Button variant="contained" color="primary" onClick={addLabelToStock}>
                        Add label to stock
                    </Button>
                    </div>


                    <div className={styles.nested}>
                        <h3>Delete label from stock</h3>
                        {/* Form for deleting label from stock. Roll down menu where
                    only labels and stocks from databse show*/}
                        <Autocomplete
                            onChange={(event, value) => stockSelectedDel = value}
                            {...stockLabelProps}
                            id="Stock"
                            clearOnEscape
                            renderInput={(params) => <TextField {...params} label="Stock" margin="normal" />}
                        />
                        <Autocomplete
                            onChange={(event, value) => labelSelectedDel = value}
                            {...labelProps}
                            id="Delete Label"
                            clearOnEscape
                            renderInput={(params) => <TextField {...params} label="Label" margin="normal" />}
                        />
                        <Button variant="contained" color="secondary" onClick={deleteLabelFromStock}>
                            Delete label from stock
                        </Button>
                    </div>


                    <div className={styles.nested}>
                    <h3>Edit weight</h3>
                    <Autocomplete
                        onChange={(event, value) => stockSelectedEdit = value}
                        {...stockLabelProps}
                        id="Stock"
                        clearOnEscape
                        renderInput={(params) => <TextField {...params} label="Stock" margin="normal" />}
                    />
                    <Autocomplete
                        onChange={(event, value) => labelSelectedEdit = value}
                        {...labelProps}
                        id="Add Label"
                        clearOnEscape
                        renderInput={(params) => <TextField {...params} label="Label" margin="normal" />}
                    />
                    <TextField
                        onChange={(event) => assWeightEdit=event.target.value}
                        id="standard-weight"
                        label="Weight"
                        type="number"
                        InputProps={{
                            inputProps: {
                                max: 3, min: 0, step: .1
                            }
                        }}
                    />
                    <Button variant="contained" color="primary" onClick={editWeight}>
                        Edit weight
                    </Button>
                    </div>

                    <div className={styles.box1}>
                    <div className={styles.fillLeftRight}>
                        <BasicTable dataRows={labelsdata.data} />
                    </div>
                    </div>

                    <div className={styles.box2}>
                    <div className={styles.fillLeftRight}>
                        <BasicTable dataRows={stockswithlabeldata.data} />
                    </div>
                    </div>
                </div>






            </main>

        </div>
    )
}