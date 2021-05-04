import Link from 'next/link'
import styles from '../styles/Home.module.css' // TODO a common CSS strategy is needed
import Head from 'next/head'
import React, { useState } from 'react'

import LineDiagram from '../public/LineDiagram.js'
import DistributionChart from '../public/DistributionChart.js'


export async function createLabel(data) {
    const response = await fetch('/api/label', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({label: data})
      })
    return await response.json();
}

function Form() {
  const registerUser = async event => {
    event.preventDefault()

    const res = await fetch("http://localhost:3001/api/label", {
      body: JSON.stringify({
        name: event.target.name.value
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    const result = await res.json()
    // result.user => 'Ada Lovelace'
  }

  return (
    <form onSubmit={registerUser}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" autoComplete="name" required />
      <button type="submit">Register</button>
    </form>
  )
}

export default function EditLabels() {
	
	const registerUser = async event => {
    event.preventDefault()

    const res = await fetch("http://localhost:3001/api/label", {
      body: JSON.stringify({
        name: event.target.name.value
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    const result = await res.json()
    // result.user => 'Ada Lovelace'
  }
	
    return (
        /* TODO something about flex is messing with the style classes */
        <div /*className={styles.container}*/>
            <Head>
                <title>Stocks sorted by labels</title>
                <link rel="icon" href="/favicon.ico" />
<<<<<<< HEAD
            

=======
                <script type = "text/javascript" src="connection.js"></script> 
>>>>>>> 5e2da6afbc466bd7e8ff26f31057532038fbd44d
            </Head>
            <main /*className={styles.main}*/>
                {/* Link to homepage*/
                /* Forms for editing labels*/
                }
                
				<h1>Edit labels</h1>
				
                <h2>Add new label</h2>
<<<<<<< HEAD
                <form>
                    Label name: <input type="text" name="labelName" id="a"></input>
                    <button onclick={Form()}>Add</button>
                </form>

=======
                <form action="" onsubmit="addLabelFunction()" name="form1" id="form1">
                    label: <input type="text" name="label" id="a"></input>
                    <input type="submit" value="Submit" name="submit"></input>
                </form>

                <script>
                    function addLabelFunction(){
                        console.log('alex')
                    }
                </script>

>>>>>>> 5e2da6afbc466bd7e8ff26f31057532038fbd44d
                <h2>Add labels to stock</h2>
                <form>
                    <label onSubmit={createLabel}>
                        Stock:
                        <input type="text" name="stock" />
                    </label>
                        <input type="submit" value="Submit" />
				</form>
                
                <form>
                    <label>
                        Label:
                        <input type="text" name="label" />
                    </label>
                        <input type="submit" value="Submit" />
				</form>

				
				 <form onSubmit={registerUser}>
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" autoComplete="name" required />
                    <button type="submit">Register</button>
                 </form>

                <div className={styles.grid}>
                    <Link href="/" passHref>
                        <div className={styles.card}>
                            Back to homepage
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    )
}