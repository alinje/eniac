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
import NavTabs from '../public/TabPanel'


export default function Trustees() {


    const portfolioData = useQuery("dbPortfolio", () => fetch("http://localhost:3001/get-portfolioinfo").then(((res) => res.json())))
    const summaryData = useQuery("dbPortfolioSummary", () => fetch("http://localhost:3001/get-PortfolioSummary").then(((res) => res.json())))
    return (
        /* TODO something about flex is messing with the style classes */
        <div /*className={styles.container}*/>
            <Head>
                <title>Manager portfolios</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main /*className={styles.main}*/>
                                {/* Link to homepage*/}
                                <NavTabs/>
                                <div className={styles.grid}>
                    <Link href="/" passHref>
                        <div className={styles.card}>
                            Back to homepage
                        </div>
                    </Link>
                </div>
            </main>
                
                
                <div className={styles.fillLeftRight}>
                    <BasicTable dataRows={summaryData.data} />
                </div>
                

               
                <div className={styles.fillLeftRight}>
                    <BasicTable dataRows={portfolioData.data} />
                </div>
               


        </div>
    )



}