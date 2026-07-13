const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 8080);
const host = process.env.HOST || '127.0.0.1';
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

const safeFilePath = (requestUrl) => {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://${host}:${port}`).pathname);
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const resolved = path.resolve(root, relative);
  return resolved.startsWith(`${root}${path.sep}`) || resolved === path.join(root, 'index.html')
    ? resolved
    : null;
};

const server = http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }
  const filePath = safeFilePath(request.url);
  if (!filePath) {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }
  fs.stat(filePath, (statError, stats) => {
    const target = !statError && stats.isFile() ? filePath : path.join(root, 'index.html');
    fs.readFile(target, (error, body) => {
      if (error) {
        response.writeHead(404);
        response.end('Not found');
        return;
      }
      response.writeHead(200, {
        'Content-Type': contentTypes[path.extname(target).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      response.end(request.method === 'HEAD' ? undefined : body);
    });
  });
});

server.listen(port, host, () => {
  console.log(`HabitFlow local: http://${host}:${port}/index.html?dev-preview=1`);
});
