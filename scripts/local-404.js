'use strict';

const fs = require('fs');
const path = require('path');

hexo.extend.filter.register('server_middleware', function (app) {
  app.use(function (request, response, next) {
    if (request.method !== 'GET') return next();
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch (error) {
      return next();
    }
    const relative = pathname.replace(/^\/+/, '');
    const extension = path.extname(relative).toLowerCase();
    if (extension && extension !== '.html') return next();
    const publicDir = path.resolve(hexo.public_dir);
    const direct = path.resolve(publicDir, relative);
    const index = path.resolve(direct, 'index.html');
    if (!direct.startsWith(publicDir) || fs.existsSync(direct) || fs.existsSync(index)) return next();
    const notFound = path.join(publicDir, '404.html');
    if (!fs.existsSync(notFound)) return next();
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    fs.createReadStream(notFound).pipe(response);
  });
}, 0);
