// pages/api/fetch-rss-node-fetch.js

import fetch from 'node-fetch';
import { logDNS } from '../../utils/network';

export default async function handler(req, res) {
  const rssFeed = 'https://www.oris.cat/rss/12/0/';
  
  try {
    await logDNS(new URL(rssFeed).hostname);

    const response = await fetch(rssFeed, {
      timeout: 60000,
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
