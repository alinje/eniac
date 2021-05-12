import React, { useEffect } from 'react'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from 'react-query' // importerar

export default function ImportData(props) {
    useQueryClient()
    const myRef = useRef(null)

    useEffect(() => {


    }, [])

    return (
        <div ref={myRef}></div>
    )
}

function sendPathToDB(path) {

    const res = useMutation(path => axois.post('/import-portfolio-alcur', path))
}

export function init() {
    console.log("Här är jag!")
    //document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
}
