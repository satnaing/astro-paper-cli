import dayjs from 'dayjs';
import kebabCase from 'lodash.kebabcase';
import { confirm, isCancel, text, log } from '@clack/prompts';

import { getSiteConfig } from '../../utils/get-site-config.js';
import type { Options } from './index.js';

const DEFAULT_TITLE = 'New Post';
const DEFAULT_DESCRIPTION = 'A brief description of this blog post.';
const DEFAULT_PATH = './';

export interface PostInfo {
  title: string;
  description: string;
  pubDatetime: string;
  tags: string[];
  draft: boolean;
  featured: boolean;
  path: string;
  slug: string;
  author: string;
}

export async function askPostInfo(
  projectRoot: string,
  options: Options
): Promise<PostInfo> {
  const { yes, yesAll, draft, featured } = options;
  const siteConfig = await getSiteConfig(projectRoot);

  if (!siteConfig) {
    log.error('Could not find SITE config in config.ts');
    process.exit(1);
  }

  if (yes || yesAll) {
    const { author } = siteConfig;
    const title = options.title || DEFAULT_TITLE;

    log.info('Creating post file with default frontmatter...');

    return {
      title,
      author,
      description: DEFAULT_DESCRIPTION,
      slug: kebabCase(title),
      path: options.path ?? DEFAULT_PATH,
      pubDatetime: dayjs().toISOString(),
      tags: ['others'],
      draft: draft ?? false,
      featured: featured ?? false,
    };
  }

  let title: string | symbol | undefined = options.title;
  let path: string | symbol | undefined = options.path;
  let isDraft: boolean | symbol | undefined = draft;
  let isFeatured: boolean | symbol | undefined = featured;

  if (!title) {
    title = await text({
      message: 'What is the title of the post?',
      placeholder: DEFAULT_TITLE,
    });
  }

  if (isCancel(title)) {
    process.exit(0);
  }

  const description = await text({
    message: 'What is the description of the post?',
    placeholder: DEFAULT_DESCRIPTION,
  });

  if (isCancel(description)) {
    process.exit(0);
  }

  if (!path) {
    path = await text({
      message: 'Where should the post be created? (e.g. "./examples/posts")',
      placeholder: DEFAULT_PATH,
    });

    if (isCancel(path)) {
      process.exit(0);
    }
  }

  const defaultSlug = kebabCase(title ?? DEFAULT_TITLE);
  const slug = await text({
    message: 'What is the slug of the post? (e.g. "my-first-post")',
    placeholder: defaultSlug,
  });

  if (isCancel(slug)) {
    process.exit(0);
  }

  const author = await text({
    message: 'What is the author of the post?',
    placeholder: siteConfig.author,
  });

  if (isCancel(author)) {
    process.exit(0);
  }

  if (isDraft === undefined) {
    isDraft = await confirm({
      message: 'Create as draft?',
      initialValue: draft ?? false,
    });
  }

  if (isCancel(isDraft)) {
    process.exit(0);
  }

  if (isFeatured === undefined) {
    isFeatured = await confirm({
      message: 'Mark as featured?',
      initialValue: featured ?? false,
    });
  }

  if (isCancel(isFeatured)) {
    process.exit(0);
  }

  const tags = await text({
    message: 'Tags (eg: others, astro, React Query):',
    placeholder: 'others',
  });

  if (isCancel(tags)) {
    process.exit(0);
  }

  return {
    title: title ?? DEFAULT_TITLE,
    description: description ?? DEFAULT_DESCRIPTION,
    path: path ?? DEFAULT_PATH,
    slug: slug ?? defaultSlug,
    author: (author as string) ?? siteConfig.author,
    pubDatetime: dayjs().toISOString(),
    tags: tags ? tags.split(',').map(tag => tag.trim()) : ['others'],
    draft: isDraft,
    featured: isFeatured,
  };
}
