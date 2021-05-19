import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,
	QueryClientProvider,
} from 'react-query' // importerar

import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
//import Layout from '../components/layout'
import BasicTable from "../components/BasicTable";
import PieChart from '../public/PieChart'
import { StylesProvider } from '@material-ui/styles'


import styles from '../styles/Home.module.css'


export default function FirstPost() {
	const queryClient = useQueryClient()

	const labelQuery = useQuery("labelData", async () => await fetch("http://localhost:3001/get-labels").then(((res) => res.json()))) // despite the name, does not return a JSON object
	const portfolioQuery = useQuery("portfolioInfo", async () => await fetch("http://localhost:3001/get-portfolioinfo").then(((res) => res.json()))) // despite the name, does not return a JSON object
	const testArray = [{ "stock": "Volvo", "labels": ["corona_winner", "Car"] }, { "stock": "Chalmers", "labels": ["corona_winner", "Education"] }]


	//console.log({ dataGrid: portfolioQuery.data })

	return (
		<div className={styles.container}>
			<Head>
				<title>Data grid</title>
			</Head>
			<h1 className={styles.title}>Big grid, DO reload the page :)</h1>
			<main className={styles.main}>
				<div className={styles.grid}>
					<div className={styles.card}>
						<PieChart data={portfolioQuery.data} />
					</div>
					<div className={styles.card}>
						<BasicTable dataRows={testArray} />
					</div>
					<div className={styles.card}>
						<BasicTable dataRows={labelQuery.data} />
					</div>



				</div>
			</main>

			<footer className={styles.footer}>
				<Link href="/" passhref>
					<div className={styles.card + ' ' + styles.link}>
						Back to home
					</div>
				</Link>
			</footer>
		</div>

	)

}