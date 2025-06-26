#!/usr/bin/env node

import { Command } from 'commander';
import packageJson from '../package.json' with { type: 'json' };

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
    `display ${packageJson.name} version number`
  );

// Add commands
// program.addCommand(addPost);

// Show help by default if no command is provided
program.action(() => {
  program.help();
});

program.parse();
