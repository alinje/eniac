import React, { useEffect, useState } from 'react'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from 'react-query' // importerar
import BasicTable from '../components/BasicTable'
//import axios from 'axios';

export default function SubComponentLabel(props) {

    

    const { data = '', show = "label" } = props

    var fetchString = ''

    
    switch (show){
        case "label":
            fetchString = "http://localhost:3001/get-stocks-from-stockswithlabels-with-argument?label="
            break
        case "manager":
        default:
            fetchString = "http://localhost:3001/get-stocks-from-portfolio-with-argument?manager="
    }
    

    //showLabel ? fetchString = "http://localhost:3001/get-stocks-from-stockswithlabels-with-argument?label=" : fetchString = "http://localhost:3001/get-stocks-from-portfolio-with-argument?manager="

    const queryClient = useQueryClient()



    const selectedLabel = useQuery("stockArg", async () => await fetch(fetchString + props.data).then((res) => res.json()).catch(e => {console.error(e)}), {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            label: props.data
        }),
        enabled: !((!props.data) || props.data == ''),
        retry: 3,
        retryDelay: 1000,
    })



    const [label, setLabel] = useState([])


    useEffect(() => {
        
        

        if (typeof selectedLabel.data !== 'undefined') {
            console.log(selectedLabel.data)
            setLabel(selectedLabel.data)
        }

    }, [selectedLabel.data])

    return (
        <div>
            <BasicTable dataRows={label}/>
        </div>

    )

}