// utils/network.js

const dns = require('dns');
const util = require('util');

const dnsLookup = util.promisify(dns.lookup);

async function logDNS(hostname) {
  try {
    const result = await dnsLookup(hostname);
    console.log(`DNS lookup for ${hostname}: ${result.address} (IPv${result.family})`);
    return result;
  } catch (error) {
    console.error(`DNS lookup failed for ${hostname}:`, error);
    throw error;
  }
}

module.exports = { logDNS };
