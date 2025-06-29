import dayjs from 'dayjs';
import fs from 'fs-extra';
import path from 'node:path';
import { green } from 'kleur/colors';
import { isCancel, log, select, text } from '@clack/prompts';

import type { Options } from './index.js';
import { askPostInfo, PostInfo } from './ask-post-info.js';

const BLOG_PATH = 'src/data/blog';

export async function createPostFile(projectRoot: string, options: Options) {
  const postInfo = await askPostInfo(projectRoot, options);

  let fileName: string | symbol = postInfo.slug;
  let extension: symbol | 'md' | 'mdx' = 'md';

  if (options.yesAll) {
    log.info('Creating post file with default file name...');
  }

  if (!options.yesAll) {
    fileName = await select({
      message: 'Pick a file name without extension.',
      options: [
        { value: postInfo.slug, label: postInfo.slug, hint: 'Slugified title' },
        {
          value: dayjs().toISOString(),
          label: dayjs().toISOString(),
          hint: 'Current datetime',
        },
        { value: 'custom', label: 'Custom', hint: 'Enter a custom file name' },
      ],
    });

    if (isCancel(fileName)) {
      process.exit(0);
    }

    if (fileName === 'custom') {
      const customFileName = await text({
        message: 'Enter a custom file name without extension',
        placeholder: postInfo.slug,
      });

      if (isCancel(customFileName)) {
        process.exit(0);
      }

      fileName = customFileName;
    }

    extension = await select({
      message: 'Pick a file extension.',
      options: [
        { value: 'md', label: 'md', hint: `${fileName}.md` },
        { value: 'mdx', label: 'mdx', hint: `${fileName}.mdx` },
      ],
    });

    if (isCancel(extension)) {
      process.exit(0);
    }
  }

  const blogPath = path.join(projectRoot, BLOG_PATH, postInfo.path);

  if (!fs.existsSync(blogPath)) {
    fs.mkdirSync(blogPath, { recursive: true });
  }

  // Create file
  const initFilePath = path.join(blogPath, `${fileName}.${extension}`);
  let filePath = initFilePath;

  if (await fs.pathExists(initFilePath)) {
    let counter = 1;
    filePath = path.join(blogPath, `${fileName}-${counter}.${extension}`);
    while (await fs.pathExists(filePath)) {
      counter++;
      filePath = path.join(blogPath, `${fileName}-${counter}.${extension}`);
    }
  }

  const frontmatter = generateFrontmatter({
    ...postInfo,
  });

  await fs.writeFile(
    filePath,
    `${frontmatter}\nDescription\n\n## Table of contents\n\n## Intro\n\nContent\n`
  );

  log.success(`File created successfully at:\n ${green(filePath)}`);
}

function generateFrontmatter(options: PostInfo) {
  return `---
${Object.entries(options)
  .filter(([key]) => key !== 'path')
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
    }
    return `${key}: ${value}`;
  })
  .join('\n')}
---
`;
}
