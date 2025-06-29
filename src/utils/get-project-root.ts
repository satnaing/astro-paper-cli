import path from 'path';
import fs from 'fs-extra';

/**
 * Finds the root directory of an AstroPaper project
 * @returns Current directory if it contains astro.config.*, null otherwise
 */
export async function getProjectRoot(): Promise<string | null> {
  try {
    let rootDir = null;
    let currentDir = process.cwd();

    while (rootDir === null && currentDir !== '/') {
      const files = await fs.readdir(currentDir);
      const hasAstroConfig = files.some(file =>
        /^astro\.config\.(js|mjs|cjs|ts)$/.test(file)
      );

      if (hasAstroConfig) {
        rootDir = currentDir;
        break;
      }

      currentDir = path.join(currentDir, '..');
    }

    return rootDir;
  } catch {
    return null;
  }
}
