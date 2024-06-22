// pages/test-rss-fetch.js

import Head from 'next/head'
import { useState } from 'react'

export default function TestRSSFetch() {
  const [result, setResult] = useState('')

  const testEndpoint = async (endpoint) => {
    try {
      const response = await fetch(`/api/${endpoint}`)
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error.message}`)
    }
  }

  return (
    <div>
      <Head>
        <title>Test RSS Fetch Methods</title>
      </Head>
      <main>
        <h1>Test RSS Fetch Methods</h1>
        <div>
          <button onClick={() => testEndpoint('fetch-rss-axios')}>Test Axios</button>
          <button onClick={() => testEndpoint('fetch-rss-node-fetch')}>Test node-fetch</button>
          <button onClick={() => testEndpoint('fetch-rss-https')}>Test HTTPS</button>
          <button onClick={() => testEndpoint('fetch-rss-circuit-breaker')}>Test Circuit Breaker</button>
          <button onClick={() => testEndpoint('fetch-rss-http')}>Test HTTP</button>
          <button onClick={() => testEndpoint('fetch-rss-undici')}>Test Undici</button>
        </div>
        <pre>{result}</pre>
      </main>
    </div>
  )
}
