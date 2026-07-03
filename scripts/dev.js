import { spawn } from 'node:child_process';
import net from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const children = new Map();
let shuttingDown = false;

function findOpenPort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        findOpenPort(startPort + 1).then(resolve, reject);
        return;
      }

      reject(error);
    });

    server.once('listening', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });

    server.listen(startPort);
  });
}

const backendPort = await findOpenPort(Number(process.env.PORT || 5000));
const frontendPort = await findOpenPort(Number(process.env.VITE_PORT || 5173));

if (backendPort !== 5000 || frontendPort !== 5173) {
  console.log(
    `Default port busy; using frontend http://localhost:${frontendPort} and backend http://localhost:${backendPort}`
  );
}

const commands = [
  [
    'backend',
    'npm',
    ['run', 'dev'],
    join(root, 'backend'),
    {
      PORT: String(backendPort),
      CLIENT_URL: `http://localhost:${frontendPort}`
    }
  ],
  [
    'frontend',
    'npm',
    ['run', 'dev', '--', '--host', 'localhost', '--port', String(frontendPort)],
    join(root, 'frontend'),
    {
      VITE_PORT: String(frontendPort),
      VITE_API_URL: `http://localhost:${backendPort}/api`,
      VITE_FILE_URL: `http://localhost:${backendPort}`,
      VITE_API_PROXY_TARGET: `http://localhost:${backendPort}`
    }
  ]
];

function stopChild(child) {
  if (!child.pid || child.killed) return;

  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' });
    return;
  }

  child.kill('SIGTERM');
}

function stopAll(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children.values()) {
    stopChild(child);
  }

  setTimeout(() => process.exit(exitCode), 250);
}

for (const [name, command, args, cwd, env] of commands) {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...env }
  });

  children.set(name, child);

  child.on('exit', (code) => {
    children.delete(name);
    if (shuttingDown) return;

    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
    }

    stopAll(code || 0);
  });
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
process.on('uncaughtException', (error) => {
  console.error(error);
  stopAll(1);
});
