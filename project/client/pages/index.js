import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query' // importerar
import Head from 'next/head'  // jsx
import styles from '../styles/Home.module.css'

import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'

import TestGraph, { GraphClass, graphMsg } from '../public/testVisual.js'
import BarChart from '../public/BarChart.js'
//import App from '../public/app.js'


export default function Home() {
  const queryClient = useQueryClient() // fetches queryClient defined in _app.js <!-- {JSON.stringify(hello.data)} -->         <TestGraph onClick={() => graphMsg()}/>
  const hello = useQuery("hello", () => fetch("http://localhost:3001/home").then((res)=>res.json())) 
  const [msg, setMsg] = useState("tjabba")

  //const [bCMsg, setBCMsg] = useState(BarChart());
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <button onClick={() => setMsg(JSON.stringify(hello.data))}>{msg}</button>
        <pre>
          {JSON.stringify(hello.data)}
          {' '}
          <Link href="/data-grid">
            <a>Click here for big grid</a>
          </Link>
          {msg}
        </pre>


        

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>
        <noscript>
            Your browser needs to allow JavaScript
        </noscript>

        <div className={styles.grid}>

            <div className={styles.card}>
                <TestGraph onClick={() => setMsg(graphMsg())}/>
                {msg}
            </div>

            <div className={styles.card}>
                <BarChart/>
            </div>


            <div className={styles.card}>
                <Image 
                src="/images/vader.jpg" // Route of the image file, I believe the file must be inside the public folder
                height={464} // Desired size with correct aspect ratio
                width={348} // Desired size with correct aspect ratio
                alt="Utanför mitt fönster"
                />
            </div>

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
        </div>
      </main>

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
