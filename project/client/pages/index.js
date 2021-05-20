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
        <div className={styles.container}>
            {/* html elements beginning with capital letters are actually React elements */}
            <Head>
                <title>Label Master 3000</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <br/> {/*I didn't want the title so close to the top. There's probably a more elegant way to do this.*/}
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

            <h1 className={styles.title}>
                Label Master 3000
            </h1>
            <pre>
                    {/*JSON.stringify(dBConnect.data)*/}
                {JSON.stringify(hello.data)}
                {' '}
                <Link href="/data-grid">
                        <a>Click here for big grid</a>
                    </Link>
            </pre>


            {/*
            </div>/div>form onSubmit="importData(id, [])">
                <input type="file" id="myFile" name="filename"></input>
                <input type="submit"></input>
            </form>
            */}

            <main className={styles.main}>
                {/* The lambda is necessary. Here we do not actually use any arguments from the click so the paranthesis is empty */}
                <div>
                    <ImportData/>
                </div>
                <div>
                    <button onClick={() => setMsg(JSON.stringify(hello.data))}>{msg}</button>
                    <button onClick={() => setDBData(JSON.stringify(dBConnect.data))}>{dBData}</button>
                </div>

                <div className={styles.fillLeftRight}>
                    <div className={styles.fillLeftRight}>
                        <BasicTable dataRows={data} />
                    </div>


                    <div className={styles.grid}>
                        {/* This is a link to another page. https://nextjs.org/docs/api-reference/next/link
                        It can be made with an a type of tag but we use React components when possible because of optimization
                        TODO I do not know what CSS to change to make this */}
                        <Link href="labeledStats" passHref>
                            {/* This is how to use multiple style classes*/}
                            <div className={styles.card + ' ' + styles.link}>
                                Fina grafer!
                            </div>
                        </Link>

                        <Link href="trustees" passHref>
                            <div className={styles.card + ' ' + styles.link}>
                                Förvaltarlista
                            </div>
                        </Link>
                        <Link href="editLabels" passHref>
                            <div className={styles.card + ' ' + styles.link}>
                                Redigera ettiketter
                            </div>
                        </Link>
                        <Link href="performanceLabels" passHref>
                            <div className={styles.card + ' ' + styles.link}>
                                Performance labels
                            </div>
                        </Link>
                        <Link href="specificLabel" passHref>
                            <div className={styles.card + ' ' + styles.link}>
                                Specifika labels
                            </div>
                        </Link>
                        <Link href="specificStock" passHref>
                            <div className={styles.card + ' ' + styles.link}>
                                Specifika aktier
                            </div>
                        </Link>

                        {/* a tag for hyperlink 

                        <a href="https://nextjs.org/docs" className={styles.card}>
                            <h3>Documentation &rarr;</h3>
                            <p>Find in-depth information about Next.js features and API.</p>
                        </a>

                        <a href="https://nextjs.org/learn" className={styles.card}>
                            <h3>Learn &rarr;</h3>
                            <p>Learn about Next.js in an interactive course with quizzes!</p>
                        </a>

                        <a
                            href="https://github.com/vercel/next.js/tree/master/examples"
                            className={styles.card}
                        >
                            <h3>Examples &rarr;</h3>
                            <p>Discover and deploy boilerplate example Next.js projects.</p>
                        </a>

                        <a
                            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                            className={styles.card}
                        >
                            <h3>Deploy &rarr;</h3>
                            <p>
                                Instantly deploy your Next.js site to a public URL with Vercel.
                </p>
                        </a>
                        */}

                    <div className={styles.card}>
                        <BarChart />
                    </div>
                    <div className={styles.card}>
                        <PieChart data={dBConnect.data}/>
                    </div>

                    <div className={styles.card}>
                        <Image
                            src="/images/labelmakerStockPhoto.jpg" // Route of the image file, I believe the file must be inside the public folder
                            height={200} // Desired size with correct aspect ratio
                            width={266} // Desired size with correct aspect ratio
                            alt="Stock foto av an etikettmaskin"
                        />
                        <p>Label editor (ingen länk ännu)</p>
                    </div>
                </div>
            </main>

            <p><a href="https://youtube.com/playlist?list=PLZ4DbyIWUwCq4V8bIEa8jm2ozHZVuREJP">Click here for a good time!</a></p>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
                </a>
            </footer>
        </div>


    )
}
