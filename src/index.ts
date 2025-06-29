#!/usr/bin/env node

import { Command } from 'commander';
import packageJson from '../package.json' with { type: 'json' };
import { addNewPost } from './commands/new/index.js';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

const program = new Command();

// Set up the CLI
program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(
    packageJson.version,
    '-v, --version',
    `Display ${packageJson.name} version number`
  );

// Add commands
program.addCommand(addNewPost);

// Show help by default if no command is provided
program.action(() => {
  program.help();
});

program.parse();
