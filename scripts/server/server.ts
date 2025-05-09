import fs from 'node:fs';
import http from 'node:http';

const options = {
  cert: fs.readFileSync('server.crt'),
  key: fs.readFileSync('server.key'),
  ca: fs.readFileSync('public.crt'),
};

// Load HTTP module
const hostname = '192.168.1.201';
const port = 1313;
