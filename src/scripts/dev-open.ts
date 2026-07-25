import { spawn } from 'node:child_process';

const siteUrl = 'https://localhost:4321';
const docsUrl = 'http://127.0.0.1:4322';

function openUrl(url: string): void {
  const platformCommand: Record<string, [string, string[]]> = {
    darwin: ['open', [url]],
    linux: ['xdg-open', [url]],
    win32: ['cmd', ['/c', 'start', '""', url]],
  };
  const [command, args] = platformCommand[process.platform] ?? [
    'xdg-open',
    [url],
  ];
  spawn(command, args, { detached: true, stdio: 'ignore' }).unref();
}

openUrl(siteUrl);
openUrl(docsUrl);
