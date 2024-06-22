// pages/api/fetch-rss-axios.js

import axios from 'axios';
import https from 'https';
import { logDNS } from '../../utils/network';

export default async function handler(req, res) {
  const rssFeed = 'https://www.oris.cat/rss/12/0/';
  
  try {
    await logDNS(new URL(rssFeed).hostname);

    const agent = new https.Agent({
      rejectUnauthorized: false,
      keepAlive: true,
      timeout: 60000,
    });

    const response = await axios.get(rssFeed, {
      responseType: "arraybuffer",
      timeout: 60000,
      httpsAgent: agent,
    });

    res.status(200).json({ success: true, data: response.data.toString() });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
