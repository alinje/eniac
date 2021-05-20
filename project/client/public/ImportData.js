import React, { useEffect, useState, useRef } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query' // importerar
import { DropzoneArea } from 'material-ui-dropzone'
import axios from 'axios'

export default function ImportData(props) {
  const queryClient = useQueryClient()
  //const myRef = useRef(null)

  const [fileState, setFileState] = useState('')

  /* does not work, invalid hook call
    useEffect(() => {
    useMutation(fileState)

  }, [fileState])
   */


  const onChange = (file) => {
    if (typeof file[0] === 'undefined') {
      return
    }

    setFileState(file[0])
    var reader = new FileReader()

    /*axios.post('http://localhost:3001/import-portfolio-alcur', { file: file[0] })
    //.then(console.log(file.path))
    .catch(err => { console.error(err) })*/

    
    reader.onloadend = function (event) {
      console.log(reader.result)

      axios.post('http://localhost:3001/import-portfolio-alcur', { file: reader.result })
        //.then(console.log(file.path))
        .catch(err => { console.error(err) })
    }

    reader.readAsText(file[0])

  }


  return (
    <div>
      <DropzoneArea acceptedFiles={['.csv']}
        onChange={(file) => {
          onChange(file)
        }}
        showFileNames={true}
        filesLimit={1} />
    </div>
  )
}



export function init() {
  console.log("Här är jag!")
  //document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
}
