import Link from 'next/link'
import styles from '../styles/Home.module.css' // TODO a common CSS strategy is needed
import Head from 'next/head'
import React, { useState } from 'react'

import LineDiagram from '../public/LineDiagram.js'
import DistributionChart from '../public/DistributionChart.js'



export default function EditLabels() {
    return (
        /* TODO something about flex is messing with the style classes */
        <div /*className={styles.container}*/>
            <Head>
                <title>Stocks sorted by labels</title>
                <link rel="icon" href="/favicon.ico" />
                <script src="connection.js"> </script>
            </Head>
            <main /*className={styles.main}*/>
                {/* Link to homepage*/
                /* Forms for editing labels*/
                }

                
				<h1>Edit labels</h1>
				
                <h2>Add new label</h2>
                <form>
                    <label>
                        Label:
                        <input type="text" name="label" id="a" />
                    </label>
                        <input type="submit" value="Submit" />
                    <button onClick="addLabel()">Add</button>
				</form>
				
                <h2>Add labels to stock</h2>
                <form>
                    <label>
                        Stock:
                        <input type="text" name="stock" />
                    </label>
                        <input type="submit" value="Submit" />
				</form>

                <form>
                    <label>
                        Label:
                        <input type="text" name="label" />
                    </label>
                        <input type="submit" value="Submit" />
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