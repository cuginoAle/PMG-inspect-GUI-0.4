import http from 'http';
import fs from 'fs';
import path from 'path';

type RequestName = 'get_files_list' | 'parse_project';

// Lazy load stubs from the same locations used by route interception.
function readJSON(rel: string) {
  const p = path.resolve(__dirname, 'mocks', 'stubs', rel); // renamed from msw -> mocks
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

const projectList = readJSON('project-list.json');
let projectDetails: any;
try {
  projectDetails = readJSON('project-details.json');
} catch {
  projectDetails = { name: 'sample_project', status: 'ok' };
}

// Track usage counts for endpoints (SSR + any test harness queries)
// Use Partial so we can lazily add and delete keys without compile-time errors.
const usage: Partial<Record<RequestName | string, number>> = {};
function hit(key: RequestName) {
  usage[key] = (usage[key] || 0) + 1;
}

export interface MockApiServer {
  close: () => Promise<void>;
  port: number;
}

export function startMockApiServer(port = 8088): Promise<MockApiServer> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (!req.url) {
        res.statusCode = 400;
        return res.end('Bad request');
      }
      if (req.url === '/__mock-usage__') {
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ usage }));
      }
      if (req.url === '/__mock-usage__/reset') {
        Object.keys(usage).forEach((k) => delete usage[k]);
        res.statusCode = 204;
        return res.end();
      }

      if (req.url.startsWith('/api/v1/get_files_list')) {
        hit('get_files_list');
        console.log('[mock-api] GET /api/v1/get_files_list');
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(projectList));
      }
      if (req.url.startsWith('/api/v1/parse_project')) {
        hit('parse_project');
        console.log('[mock-api] GET /api/v1/parse_project');
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(projectDetails));
      }
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({ detail: { message: 'Unhandled test API call' } }),
      );
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        if (process.env.ALLOW_REAL_BACKEND === '1') {
          console.warn(
            '[mock-api] Port 8088 busy; ALLOW_REAL_BACKEND=1 set – proceeding without mock server.',
          );
          return resolve({
            port,
            close: async () => {
              /* no-op */
            },
          });
        }
        console.error(
          '[mock-api] Port 8088 already in use. Failing tests (set ALLOW_REAL_BACKEND=1 to bypass).',
        );
        return reject(err);
      }
      reject(err);
    });

    server.listen(port, () => {
      console.log('[mock-api] listening on', port);
      resolve({
        port,
        close: () =>
          new Promise<void>((resClose) => server.close(() => resClose())),
      });
    });
  });
}
