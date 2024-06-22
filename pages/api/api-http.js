// pages/api/fetch-rss-http.js

import http from 'http';
import { logDNS } from '../../utils/network';

export default async function handler(req, res) {
  const rssFeed = 'http://www.oris.cat/rss/12/0/';
  
  try {
    await logDNS(new URL(rssFeed).hostname);

    const fetchWithHttp = (url) => new Promise((resolve, reject) => {
      http.get(url, { timeout: 60000 }, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => { resolve(data); });
      }).on('error', (err) => {
        reject(err);
      });
    });

    const data = await fetchWithHttp(rssFeed);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
