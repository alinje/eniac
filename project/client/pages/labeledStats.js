import Link from 'next/link'
import styles from '../styles/Home.module.css' // TODO a common CSS strategy is needed
import Head from 'next/head'
import React, { useState } from 'react'

import LineDiagram from '../public/LineDiagram.js'

export default function LabeledStats() {
    const [lDState, setLDState] = useState({ // placeholder data
        y: "Type of y",
        series: [{ name: "graph-1", values: [10, 30, 70, 90, 100] }, { name: "graph-2", values: [5, 26, 80, 70, 60] }, { name: "graph-3", values: [3, 37, 82, 77, 66] }],
        dates: [12, 13, 14, 15, 16]
    })
    return (
        /* TODO something about flex is messing with the style classes */
        <div /*className={styles.container}*/>
            <Head>
                <title>Stocks sorted by labels</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main /*className={styles.main}*/>
                {/* Link to homepage*/}
                <div className={styles.grid}>
                    <Link href="/" passHref>
                        <div className={styles.card}>
                            Back to homepage
                        </div>
                    </Link>

                    {/* Visualization over all stocks in a label catagory       */}
                    <div className={styles.card} >
                        <LineDiagram data={lDState} width={1000} />
                        <button onClick={() => theGreatDepression()}>Simulera börskrasch</button>
                        {JSON.stringify(lDState)}
                    </div>
                </div>


            </main>
        </div>
    )

    function theGreatDepression(){
        setLDState(() => ({ // placeholder data
            y: "Type of value",
            series: [{ name: "graph-1", values: [10, 30, 70, 90, 100, 0] }, { name: "graph-2", values: [5, 26, 80, 70, 60, 0] }, { name: "graph-3", values: [3, 37, 82, 77, 66, 0] }],
            dates: [12, 13, 14, 15, 16, 17]
        }))
    }
}