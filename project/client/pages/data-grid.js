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
import {BasicTable} from "../components/BasicTable";


export default function FirstPost() {
	const queryClient = useQueryClient()

	const dBConnect = useQuery("dbConnect", () => fetch("http://localhost:3001/dBInit").then(((res) => res.json())))
	const [dBData, setDBData] = useState(dBConnect)

    //console.log(dBConnect)

	/*
	const bigData = useQuery("???", () => fetch("http://localhost:3001/grid-data").then((res)=>res.json()))
	let jsonData = require('../../server/test_data.json');
	let jsonRows = jsonData.rows;
	let jsonPretty = JSON.stringify(jsonRows);
	*/

	return (
		<>
			<Head>
				<title>Data grid</title>
			</Head>
			<h1>Big grid</h1>

			<p><BasicTable rows={dBConnect.data} /></p>


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