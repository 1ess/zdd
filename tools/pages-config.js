'use strict';

const { isIP } = require('node:net');

function originFromEnv(env, name, fallback) {
  if (env[name] === undefined) return fallback;
  const value = env[name];
  const message = `${name} must be an absolute HTTPS origin without credentials, a path, query or fragment.`;
  if (typeof value !== 'string' || !/^https:\/\/[^/]+\/?$/i.test(value) || /[\s\\@?#"'`\u0000-\u001f\u007f]/.test(value)) {
    throw new Error(message);
  }
  let url;
  try { url = new URL(value); } catch { throw new Error(message); }
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error(message);
  }
  const hostname = url.hostname.replace(/^\[|\]$/g, '').replace(/\.$/, '');
  const dnsHostname = hostname.length <= 253 && hostname.split('.').every((label) =>
    /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label));
  if (!isIP(hostname) && !dnsHostname) throw new Error(message);
  return url.origin;
}

function getPagesConfig(env = process.env) {
  return {
    site: originFromEnv(env, 'PAGES_SITE_URL', 'https://blog.zhangdd.tech'),
    cdn: originFromEnv(env, 'PAGES_CDN_URL', 'https://blogcdn.zhangdd.tech')
  };
}

module.exports = { getPagesConfig };
