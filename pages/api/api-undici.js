// pages/api/fetch-rss-undici.js

import { fetch } from 'undici';
import { logDNS } from '../../utils/network';

export default async function handler(req, res) {
  const rssFeed = 'https://www.oris.cat/rss/12/0/';
  
  try {
    await logDNS(new URL(rssFeed).hostname);

    const response = await fetch(rssFeed, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      // Undici doesn't have a direct timeout option, but you can use AbortController
      signal: AbortSignal.timeout(60000) // 60 seconds timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
