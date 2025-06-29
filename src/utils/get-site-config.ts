import path from 'path';
import { z } from 'zod/v4';
import fs from 'fs-extra';

import { handleError } from './handle-error.js';

const SITE_CONFIG_REGEX = /export const SITE = ({[\s\S]*?}) as const;/;

const configSchema = z.object({
  author: z.string("Could not find 'author' in SITE configuration"),
  desc: z.string("Could not find 'desc' in SITE configuration"),
  title: z.string("Could not find 'title' in SITE configuration"),
  postPerIndex: z.number("Could not find 'postPerIndex' in SITE configuration"),
  postPerPage: z.number("Could not find 'postPerPage' in SITE configuration"),
});

export async function getSiteConfig(projectRoot: string) {
  try {
    const configPath = path.join(projectRoot, 'src/config.ts');

    // Check if config file exists
    if (!(await fs.pathExists(configPath))) {
      throw new Error('Could not find config.ts in your project.');
    }

    // Read the config file content
    const configContent = await fs.readFile(configPath, 'utf-8');

    // Extract SITE object using regex
    const match = SITE_CONFIG_REGEX.exec(configContent);

    if (!match) {
      throw new Error('Could not find SITE config in config.ts');
    }

    // Convert the config to a safe JavaScript object
    const config = new Function(`return ${match[1].trim()}`)();

    return configSchema.parse(config);
  } catch (error: unknown) {
    handleError(error);
  }
}
