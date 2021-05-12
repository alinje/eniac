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


export default function FirstPost() {
	const queryClient = useQueryClient()

	const labelQuery = useQuery("labelData", async () => await fetch("http://localhost:3001/get-labels").then(((res) => res.json()))) // despite the name, does not return a JSON object
	const portfolioQuery = useQuery("portfolioInfo", async () => await fetch("http://localhost:3001/get-portfolioinfo").then(((res) => res.json()))) // despite the name, does not return a JSON object
	const testArray = [{"stock": "Volvo", "labels": ["Coronawinner", "Car"]}, {"stock": "Chalmers", "labels": ["Coronawinner", "Education"]}]


	//console.log({ dataGrid: portfolioQuery.data })

	return (
		<>
			<Head>
				<title>Data grid</title>
			</Head>
			<h1>Big grid, DO reload the page :)</h1>

			<PieChart data={portfolioQuery.data} />

			<BasicTable dataRows={testArray} />

			<BasicTable dataRows={labelQuery.data} />


			<h2>
				<Link href="/">
					<a>Back to home</a>
				</Link>
			</h2>





		</>

	)

	/*
			<button onClick={() => testU()}>Click</button>

	function testU(){ 
		setDBData({
			...dBData, // use the old state (stripped)
			yeyUPDS: "tjo"
		})
		}
	}*/

}