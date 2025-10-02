import {
  pciScoreColourCodes,
  pciScoreLabelColour,
} from '@/src/helpers/pci-score-colour-codes';
import fs from 'fs';
import path from 'path';

// Simple helper to fetch CSS from a CDN (jsDelivr). If fetch fails returns '' gracefully.
async function fetchCss(url: string): Promise<string> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  }
}

function readFileSafe(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

export async function GET() {
  const root = process.cwd();
  const cssDir = path.join(root, 'src', 'css');

  const reset = readFileSafe(path.join(cssDir, 'reset.css'));
  const base = readFileSafe(path.join(cssDir, 'base.css'));
  const utils = readFileSafe(path.join(cssDir, 'utils.css'));

  const pciScoreColours = Object.keys(pciScoreColourCodes)
    .map(
      (key) =>
        `  --pci-${key}: ${
          pciScoreColourCodes[key as keyof typeof pciScoreColourCodes]
        };`,
    )
    .join('\n');

  const pciScoreLabelColours = Object.keys(pciScoreColourCodes)
    .map(
      (key) =>
        `  --pci-label-${key}: ${
          pciScoreLabelColour[key as keyof typeof pciScoreLabelColour]
        };`,
    )
    .join('\n');

  // Extract package versions from package.json (fallback to 'latest')
  function getPkgVersion(name: string): string {
    try {
      const pkgJson = JSON.parse(
        fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
      );
      const raw: string | undefined =
        pkgJson.dependencies?.[name] || pkgJson.devDependencies?.[name];
      if (!raw) return 'latest';
      const m = raw.match(/(\d+\.\d+\.\d+(?:[-+].*)?)/);
      return m?.[1] ?? 'latest';
    } catch {
      return 'latest';
    }
  }

  const radixVersion = getPkgVersion('@radix-ui/themes');
  const mapboxVersion = getPkgVersion('mapbox-gl');

  // Pinned (or fallback) CDN URLs
  const radixUrl = `https://cdn.jsdelivr.net/npm/@radix-ui/themes@${radixVersion}/styles.css`;
  const mapboxUrl = `https://cdn.jsdelivr.net/npm/mapbox-gl@${mapboxVersion}/dist/mapbox-gl.css`;

  // Parallel fetch
  const [radix, mapbox] = await Promise.all([
    fetchCss(radixUrl),
    fetchCss(mapboxUrl),
  ]);

  const css = [
    '@layer reset, base, radix_theme, mapbox, utilities;',
    `:root {\n${pciScoreColours}\n}`,
    `:root {\n${pciScoreLabelColours}\n}`,
    reset ? `@layer reset {\n${reset}\n}` : '',
    base ? `@layer base {\n${base}\n}` : '',
    radix
      ? `@layer radix_theme {\n/* source: ${radixUrl} */\n${radix}\n}`
      : `/* Radix theme CSS unavailable: ${radixUrl} */`,
    mapbox
      ? `@layer mapbox {\n/* source: ${mapboxUrl} */\n${mapbox}\n}`
      : `/* Mapbox CSS unavailable: ${mapboxUrl} */`,

    utils ? `@layer utilities {\n${utils}\n}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return new Response(css, {
    headers: {
      'content-type': 'text/css; charset=utf-8',
      'cache-control': 'public, max-age=60',
    },
  });
}
