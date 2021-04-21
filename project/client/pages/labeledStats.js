import Link from 'next/link'
import styles from '../styles/Home.module.css' // TODO a common CSS strategy is needed
import Head from 'next/head' 

import LineDiagram from '../public/LineDiagram.js'

export default function LabeledStats() {
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

                    {/* Visualization over all stocks in a label catagory*/}
                    <div className={styles.card} >
                        <LineDiagram width={1000}/>
                    </div>
                </div>


            </main>
        </div>
    )
}