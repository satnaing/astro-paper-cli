import { z } from 'zod/v4';
import { log } from '@clack/prompts';

const lineBreak = () => console.log('');

export function handleError(error: unknown) {
  log.error(
    `Something went wrong. Please check the error below for more details.`
  );
  log.error(`If the problem persists, please open an issue on GitHub.`);
  log.error('');
  if (typeof error === 'string') {
    log.error(error);
    lineBreak();
    process.exit(1);
  }

  if (error instanceof z.ZodError) {
    log.error('Validation failed:');
    for (const [key, value] of Object.entries(error.flatten().fieldErrors)) {
      log.error(`- ${log.info(key)}: ${value}`);
    }
    lineBreak();
    process.exit(1);
  }

  if (error instanceof Error) {
    log.error(error.message);
    lineBreak();
    process.exit(1);
  }

  if (error instanceof Error) {
    log.error(error.message);
    lineBreak();
    process.exit(1);
  }

  lineBreak();
  process.exit(1);
}
