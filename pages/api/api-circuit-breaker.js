// pages/api/fetch-rss-circuit-breaker.js

import axios from 'axios';
import { logDNS } from '../../utils/network';

class CircuitBreaker {
  constructor(action, options = {}) {
    this.action = action;
    this.failureThreshold = options.failureThreshold || 3;
    this.resetTimeout = options.resetTimeout || 30000;
    this.state = 'CLOSED';
    this.failures = 0;
    this.nextAttempt = Date.now();
  }

  async fire(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF-OPEN';
      } else {
        throw new Error('Circuit is OPEN');
      }
    }

    try {
      const result = await this.action(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures += 1;
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
  }
}

const breaker = new CircuitBreaker(async (url) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 60000,
  });
  return response.data;
});

export default async function handler(req, res) {
  const rssFeed = 'https://www.oris.cat/rss/12/0/';
  
  try {
    await logDNS(new URL(rssFeed).hostname);

    const data = await breaker.fire(rssFeed);
    res.status(200).json({ success: true, data: data.toString() });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
