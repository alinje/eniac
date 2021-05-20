import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from 'react-query' // importerar
import Head from 'next/head'  // jsx
import styles from '../styles/Home.module.css'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import TestGraph, { GraphClass, graphMsg } from '../public/testVisual.js'
import BarChart from '../public/BarChart.js'
import PieChart from "../public/PieChart";

import BasicTable from "../components/BasicTable";
import NavTabs from '../public/TabPanel'

import ImportData, {init} from '../public/ImportData.js'


//import App from '../public/app.js'


export default function Home() {
    const queryClient = useQueryClient() // fetches queryClient defined in _app.js        <TestGraph onClick={() => graphMsg()}/>
    const hello = useQuery("hello", () => fetch("http://localhost:3001/home").then((res) => res.json()))
    const [msg, setMsg] = useState("tjabba")
    const [dBData, setDBData] = useState("ye")
    const dBConnect = useQuery("dbConnect", () => fetch("http://localhost:3001/get-labelsummary").then(((res) => res.json())))
    const {data} = useQuery("dbConnect", () => fetch("http://localhost:3001/get-labelsummary").then(((res) => res.json()))) // despite the name, does not return a JSON object
    return (

        <div>
            {/* html elements beginning with capital letters are actually React elements */}
            <Head>
                <title>Label Master 3000</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavTabs/>

            <br/> {/*I didn't want the title so close to the top. There's probably a more elegant way to do this.*/}
            <br/>


            <h1 className={styles.title}>
                Label Master 3000
            </h1>
            <div className={styles.boxSmall}>
                <ImportData/>
            </div>


            {/*
            </div>/div>form onSubmit="importData(id, [])">
                <input type="file" id="myFile" name="filename"></input>
                <input type="submit"></input>
            </form>
            */}


            <main className={styles.container}>
                {/* The lambda is necessary. Here we do not actually use any arguments from the click so the paranthesis is empty */}

                <pre>
                <Link href="/data-grid">
                    <a>Click here for big grid</a>
                </Link>
                </pre>


                {/*<div>*/}
                {/*    <button onClick={() => setMsg(JSON.stringify(hello.data))}>{msg}</button>*/}
                {/*    <button onClick={() => setDBData(JSON.stringify(dBConnect.data))}>{dBData}</button>*/}
                {/*</div>*/}

                <div className={styles.wrapperSmall}>
                <div className={styles.fillLeftRight}>
                        <BasicTable dataRows={data} />
                </div>

                <div className={styles.nested}>
                    <PieChart data={dBConnect.data}/>
                </div>
                </div>

                    {/*<div className={styles.grid}>*/}
                    {/*    /!* This is a link to another page. https://nextjs.org/docs/api-reference/next/link*/}
                    {/*    It can be made with an a type of tag but we use React components when possible because of optimization*/}
                    {/*    TODO I do not know what CSS to change to make this *!/*/}
                    {/*    <Link href="labeledStats" passHref>*/}
                    {/*        /!* This is how to use multiple style classes*!/*/}
                    {/*        <div className={styles.card + ' ' + styles.link}>*/}
                    {/*            Fina grafer!*/}
                    {/*        </div>*/}
                    {/*    </Link>*/}

                    {/*    <Link href="trustees" passHref>*/}
                    {/*        <div className={styles.card + ' ' + styles.link}>*/}
                    {/*            Förvaltarlista*/}
                    {/*        </div>*/}
                    {/*    </Link>*/}
                    {/*    <Link href="editLabels" passHref>*/}
                    {/*        <div className={styles.card + ' ' + styles.link}>*/}
                    {/*            Redigera ettiketter*/}
                    {/*        </div>*/}
                    {/*    </Link>*/}
                    {/*    <Link href="performanceLabels" passHref>*/}
                    {/*        <div className={styles.card + ' ' + styles.link}>*/}
                    {/*            Performance labels*/}
                    {/*        </div>*/}
                    {/*    </Link>*/}
                    {/*    <Link href="specificLabel" passHref>*/}
                    {/*        <div className={styles.card + ' ' + styles.link}>*/}
                    {/*            Specifika labels*/}
                    {/*        </div>*/}
                    {/*    </Link>*/}
                    {/*    <Link href="specificStock" passHref>*/}
                    {/*        <div className={styles.card + ' ' + styles.link}>*/}
                    {/*            Specifika aktier*/}
                    {/*        </div>*/}
                    {/*    </Link>*/}
                    {/*</div>*/}
                <footer className={styles.box1}>
                    <a>
                        Powered by Eniac
                    </a>
                </footer>
            </main>





        </div>


    )
}
