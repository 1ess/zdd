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
  if ((!isIP(hostname) && !dnsHostname) || /(?:^|\.)zhangdd\.tech$/i.test(hostname)) throw new Error(message);
  return url.origin;
}

function getPagesConfig(env = process.env) {
  return getPublishConfig('pages', env);
}

function getPublishConfig(target, env = process.env) {
  const defaults = {
    pages: ['PAGES', 'https://zdd-blog.pages.dev', 'https://zdd-blogcdn.pages.dev'],
    vercel: ['VERCEL', 'https://zdd.vercel.app', 'https://cdn-fawn.vercel.app']
  };
  if (!Object.hasOwn(defaults, target)) throw new Error('Unknown publish target');
  const [prefix, site, cdn] = defaults[target];
  return {
    site: originFromEnv(env, `${prefix}_SITE_URL`, site),
    cdn: originFromEnv(env, `${prefix}_CDN_URL`, cdn)
  };
}

module.exports = { getPagesConfig, getPublishConfig };
