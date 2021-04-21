import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import {useQuery} from "react-query";
//import Layout from '../components/layout'

export default function FirstPost(){
    const bigData = useQuery("???", () => fetch("http://localhost:3001/grid-data").then((res)=>res.json()))
    return(
        <>
            <Head>
                <title>Data grid</title>
            </Head>
            <h1>Big grid</h1>

            <p>{JSON.stringify(bigData.data)}</p>


            <h2>
                <Link href="/">
                    <a>Back to home</a>
                </Link>
            </h2>


        </>

    )
}