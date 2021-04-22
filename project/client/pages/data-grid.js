import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import {useQuery} from "react-query";
//import Layout from '../components/layout'
import { BasicTable} from "../components/BasicTable";


export default function FirstPost(){

/*
    const bigData = useQuery("???", () => fetch("http://localhost:3001/grid-data").then((res)=>res.json()))
    let jsonData = require('../../server/test_data.json');
    let jsonRows = jsonData.rows;
    let jsonPretty = JSON.stringify(jsonRows);
*/

    return(
        <>
            <Head>
                <title>Data grid</title>
            </Head>
            <h1>Big grid</h1>

            <p><BasicTable /></p>



            <h2>
                <Link href="/">
                    <a>Back to home</a>
                </Link>
            </h2>


        </>

    )
}