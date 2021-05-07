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


export default function FirstPost() {
	const queryClient = useQueryClient()

	const {data} = useQuery("dbConnect", () => fetch("http://localhost:3001/dBInit").then(((res) => res.json()))) // despite the name, does not return a JSON object


	return (
		<>
			<Head>
				<title>Data grid</title>
			</Head>
			<h1>Big grid, DO reload the page :)</h1>

			<p><BasicTable dataRows={data} /></p>


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