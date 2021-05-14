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

    //Variables that becomes the current selected item
    let deleteLabelSelected = null
    let stockSelected = null
	
    //Sends the added label name through JSON to the server
	const addLabel = async event => {
		event.preventDefault()
        const res = await fetch('http://localhost:3001/addLabels', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({label: event.target.name.value})    
		},window.location.reload())
        const result = await res.json()

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

    const deleteLabelFromStock = async event => {
        event.preventDefault()
        if(deleteLabelSelected != null){
            const res = await fetch('http://localhost:3001/deleteLabel', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    label: deleteLabelSelected.name,
                    stock: stockSelected.name
                })
            }, window.location.reload())
            const result = await res.json()
	    }
	}

	//Sends the stock, label and weight through JSON to the server
	const addLabelToStock= async event => {
        event.preventDefault()
		const newJSON = {
				'stock': event.target.stock.value,
				'label': event.target.label.value,
				'weight': event.target.weight.value
			};
        const res = await fetch('http://localhost:3001/addLabelsToStock', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newJSON)           //Sends the added stock
        },window.location.reload())
        const result = await res.json()
	}
	
	//Sends the stock, label and weight through JSON to the server
    const editWeight= async event => {
        event.preventDefault()
		const newJSON = {
				'stock': event.target.stock.value,
				'label': event.target.label.value,
				'weight': event.target.weight.value
			};
        const res = await fetch('http://localhost:3001/editWeight', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newJSON)           //Sends the edited weight
        },window.location.reload())
		const result = await res.json()
	}
	
	//Sends the stocka and label through JSON to the server
   /* const deleteLabelFromStock= async event => {
        event.preventDefault()
		const newJSON = {
				'stock': event.target.stock.value,
				'label': event.target.label.value,
			};
        const res = await fetch('http://localhost:3001/deleteLabelFromStock', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newJSON)
        },window.location.reload())
		const result = await res.json()
    }*/

    //Constant containing the labels
    const labelProps = {
        options: labelsdata.data,
        getOptionLabel: (option) => option.name,
    };
    //Constant that SHOULD contain the stocks! But contains the labels for now....
    const stockProps = {
        options: stocksdata.data,
        getOptionLabel: (option) => option.name,
    };

    // const options = data.map((option) => {
    //     const firstLetter = option.name[0].toUpperCase();
    //     return {
    //         firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
    //         ...option,
    //     };
    // });



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
    
				    <div className={styles.fillLeft}>
                    <div>

                    <h1>Edit labels</h1>

                {/* A form for adding a label*/}
                <h2>Add new label</h2>
                <form onSubmit={addLabel}>
                    <input id="name" name="name" type="text" placeholder="Label" autoComplete="name" required />
                    <button type="submit">Add label</button>
                </form>

                {/* A form for deleting a label*/}
                <h2>Delete label</h2>
                <form onSubmit={deleteLabel}>
				    <input id="name" name="name" type="text" placeholder="Label" autoComplete="name" required />
                    <button type="submit">Delete label</button>
                </form>

                {/* A form for adding labels to stocks with associated weight*/}
                <h2>Add labels to stock with associated weight</h2>
                <form onSubmit={addLabelToStock}>
                    <input id="stock" name="stock" type="text" placeholder= "Stock" autoComplete="stock" required />
                    <input id="label" name="label" type="text" placeholder= "Label" autoComplete="label" required />
                    <input id="weight" name="weight" type="number" step=".1" min="0" max="3" placeholder= "weight" autoComplete="weight" required />
                    <button type="submit">Add label to stock with associated weight</button>
                </form>

                {/* A form for editing weights*/}
                <h2>Edit weight</h2>
                <form onSubmit={editWeight}>
                    <input id="stock" name="stock" type="text" placeholder= "Stock" autoComplete="stock" required />
                    <input id="label" name="label" type="text" placeholder= "Label" autoComplete="label" required />
                    <input id="weight" name="weight" type="number" step=".1" min="0" max="3" placeholder= "weight" autoComplete="weight" required />
                    <button type="submit">Edit weight</button>
                </form>

                {/* A form for deleting labels from specific stocks*/}
                <h2>Delete label from stock</h2>
                    <form onSubmit={deleteLabelFromStock}>
                        <input id="stock" name="stock" type="text" placeholder= "Stock" autoComplete="stock" required />
                        <input id="label" name="label" type="text" placeholder= "Label" autoComplete="label" required />
                        <button type="submit">Delete label from stock</button>
                    </form>
                    </div>


                    
                <div className={styles.fillLeftRight}>
                <BasicTable dataRows={labelsdata.data} />
                </div>

                <div className={styles.fillLeftRight}>
                    <BasicTable dataRows={stockswithlabeldata.data} />
                </div>


                </div>
                <div style={{ width: 300 }}>
                <h2>Delete label</h2>
                {/* New form for deleting a label*/}
                <Autocomplete
                    onChange={(event, value) => deleteLabelSelected = value}
                    {...labelProps}
                    id="Delete Label"
                    clearOnEscape
                    renderInput={(params) => <TextField {...params} label="Delete Label" margin="normal" />}
                />
                <Button variant="contained" color="secondary" onClick={deleteLabel}>
                    Delete Label
                </Button>

                <h2>Delete label from stock</h2>
                {/* New form for deleting label from stock. Roll down menu where 
                only labels and stocks from databse show*/}
                <Autocomplete
                    onChange={(event, value) => stockSelected = value}
                    {...stockProps}
                    id="Stock"
                    clearOnEscape
                    renderInput={(params) => <TextField {...params} label="Stock" margin="normal" />}
                />
                 <Autocomplete
                    onChange={(event, value) => deleteLabelSelected = value}
                    {...labelProps}
                    id="Delete Label"
                    clearOnEscape
                    renderInput={(params) => <TextField {...params} label="Label" margin="normal" />}
                />
                <Button variant="contained" color="secondary" onClick={deleteLabelFromStock}>
                    Delete label from stock
                </Button>

                <h2>Add labels to stock with associated weight</h2>

                <h2>Edit weight</h2>

                {/*<Autocomplete*/}
                {/*    id="grouped-demo"*/}
                {/*    options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}*/}
                {/*    groupBy={(option) => option.firstLetter}*/}
                {/*    getOptionLabel={(option) => option.name}*/}
                {/*    style={{ width: 300 }}*/}
                {/*    renderInput={(params) => <TextField {...params} label="With categories" variant="outlined" />}*/}
                {/*/>*/}

                </div>

                <div className={styles.grid}>
                    <Link href="/" passHref>
                        <div className={styles.card}>
                            Back to homepage
                        </div>
                    </Link>
                </div>


            </main>


        </div>
    )
}