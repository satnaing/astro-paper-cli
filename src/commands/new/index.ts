import { z } from 'zod/v4';
import { Command } from 'commander';
import { intro, log, outro } from '@clack/prompts';

import { handleError } from '../../utils/handle-error.js';
import { getProjectRoot } from '../../utils/get-project-root.js';
import { createPostFile } from './create-post-file.js';

const optionsSchema = z.object({
  title: z.string().optional(),
  path: z.string().optional(),
  yes: z.boolean().optional(),
  draft: z.boolean().optional(),
  featured: z.boolean().optional(),
  yesAll: z.boolean().optional(),
});
export type Options = z.infer<typeof optionsSchema>;

export const addNewPost = new Command()
  .name('new')
  .argument('[title]', 'The title of the post')
  .description('Add a new post to the blog')
  .option(
    '-p, --path <path>',
    'The path to the post (e.g. "./examples/posts/")'
  )
  .option('-y, --yes', 'Create post with default values')
  .option('-Y, --yes-all', 'Create post with default values and file name')
  .option('-d,--draft', 'Create as draft')
  .option('-f, --featured', 'Mark as featured')
  .action(async (title, opts) => {
    try {
      const projectRoot = await getProjectRoot();

      if (!projectRoot) {
        log.error(
          'Not in an AstroPaper project. \nPlease run this command inside your AstroPaper project.'
        );
        process.exit(1);
      }

      const options = optionsSchema.parse({
        title,
        ...opts,
      });

      intro(`Adding new post`);

      await createPostFile(projectRoot, options);

      outro(`Post created successfully`);
    } catch (error) {
      console.log('');
      handleError(error);
    }
  });
