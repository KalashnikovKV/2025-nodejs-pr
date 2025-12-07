const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const PORT = 3000;
const STATIC_DIR = path.join(__dirname, 'static');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript'
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'text/plain';
}

async function formatRequestDetails(req) {
  const templatePath = path.join(STATIC_DIR, 'details-template.html');
  let template = await fs.readFile(templatePath, 'utf8');
  
  const headers = Object.entries(req.headers)
    .map(([key, value]) => `    <tr><td><strong>${key}</strong></td><td>${value}</td></tr>`)
    .join('\n');
  
  template = template.replace('{{METHOD}}', req.method);
  template = template.replace('{{URL}}', req.url);
  template = template.replace('{{HTTP_VERSION}}', req.httpVersion);
  template = template.replace('{{REMOTE_ADDRESS}}', req.socket.remoteAddress);
  template = template.replace('{{REMOTE_PORT}}', req.socket.remotePort);
  template = template.replace('{{HEADERS}}', headers);
  
  return template;
}

async function serveStaticFile(filePath, res) {
  try {
    const fullPath = path.join(STATIC_DIR, filePath);
    const mimeType = getMimeType(fullPath);
    const content = await fs.readFile(fullPath, 'utf8');
    
    res.statusCode = 200;
    res.setHeader('Content-Type', mimeType);
    res.end(content);
  } catch (error) {
    res.statusCode = 404;
    res.end('<h1>404 - File Not Found</h1>');
  }
}

async function serveHTMLPage(res) {
  try {
    const htmlPath = path.join(STATIC_DIR, 'index.html');
    const content = await fs.readFile(htmlPath, 'utf8');
    res.statusCode = 200;
    res.end(content);
  } catch (error) {
    res.statusCode = 404;
    res.end('<h1>404 - HTML page not found</h1>');
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === '/hello' && req.method === 'GET') {
    res.statusCode = 200;
    res.end('<h1>Hello World</h1>');
    return;
  }

  if (pathname === '/details' && req.method === 'GET') {
    res.statusCode = 200;
    const html = await formatRequestDetails(req);
    res.end(html);
    return;
  }

  if (pathname === '/' && req.method === 'GET') {
    await serveHTMLPage(res);
    return;
  }

  if (pathname.startsWith('/static/')) {
    const filePath = pathname.replace('/static/', '');
    await serveStaticFile(filePath, res);
    return;
  }

  res.statusCode = 404;
  res.end('<h1>404 - Page Not Found</h1>');
});

server.listen(PORT, () => {
  console.log(`Базовый HTTP сервер запущен на http://localhost:${PORT}`);
  console.log('Задача 1: GET /hello - Hello World');
  console.log('Задача 2: GET /details - Детали запроса');
  console.log('Задача 3: GET / - HTML страница (CV)');
});

module.exports = server;

