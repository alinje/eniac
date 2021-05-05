import Link from 'next/link'
import styles from '../styles/Home.module.css' // TODO a common CSS strategy is needed
import Head from 'next/head'
import React, { useState } from 'react'

import LineDiagram from '../public/LineDiagram.js'
import DistributionChart from '../public/DistributionChart.js'


export default function EditLabels() {
	const addLabel = async event => {
        event.preventDefault()
        const res = await fetch('http://localhost:3001/addLabels', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({label: event.target.name.value})           //Sends the added name
        })
        const result = await res.json()
	}
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
        })
        const result = await res.json()
    }
	
    return (
        /* TODO something about flex is messing with the style classes */
        <div /*className={styles.container}*/>
            <Head>
                <title>Stocks sorted by labels</title>
                <link rel="icon" href="/favicon.ico" />
            

            </Head>
            <main /*className={styles.main}*/>
                {/* Link to homepage*/
                /* Forms for editing labels*/
                }
                
				<h1>Edit labels</h1>
				
                <h2>Add new label</h2>
                <form onSubmit={addLabel}>
                    <input id="name" name="name" type="text" placeholder="Label" autoComplete="name" required />
                    <button type="submit">Add label</button>
                </form>

                <h2>Add labels to stock with associated weight</h2>
                <form onSubmit={addLabelToStock}>
                    <input id="stock" name="stock" type="text" placeholder= "Stock" autoComplete="stock" required />
                    <input id="label" name="label" type="text" placeholder= "Label" autoComplete="label" required />
                    <input id="weight" name="weight" type="number" step=".1" min="0" max="3" placeholder= "weight" autoComplete="weight" required />
                    <button type="submit">Add label to stock with associated weight</button>
                </form>

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