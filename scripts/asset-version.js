'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const versions = new Map();

hexo.extend.helper.register('versioned_asset', function (assetPath) {
  const normalized = String(assetPath || '').replace(/^\/+/, '');
  const file = path.join(hexo.theme_dir, 'source', normalized);
  let version = versions.get(file);
  if (!version) {
    version = fs.existsSync(file)
      ? crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 12)
      : 'missing';
    versions.set(file, version);
  }
  return this.url_for(normalized) + '?v=' + version;
});
